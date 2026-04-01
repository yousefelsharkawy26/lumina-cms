"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getUserOrders = exports.createStripeCheckoutSession = void 0;
const prisma_1 = require("../lib/prisma");
const stripe_1 = __importDefault(require("stripe"));
const createStripeCheckoutSession = async (req, res) => {
    try {
        const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2026-03-25.dahlia',
        });
        const { items } = req.body;
        const userId = req.user?.id;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        // 1. Fetch real product prices from DB securely
        const productIds = items.map((item) => item.productId);
        const dbProducts = await prisma_1.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        if (dbProducts.length !== productIds.length) {
            return res.status(400).json({ message: 'One or more products could not be found' });
        }
        // 2. Build secure Order Items & Stripe Line Items
        let totalAmount = 0;
        const orderItemsData = [];
        const stripeLineItems = [];
        items.forEach((clientItem) => {
            const product = dbProducts.find((p) => p.id === clientItem.productId);
            if (!product)
                return;
            const quantity = clientItem.quantity;
            const price = product.price;
            totalAmount += price * quantity;
            orderItemsData.push({
                productId: product.id,
                quantity,
                price,
            });
            stripeLineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: product.imageUrl && product.imageUrl.startsWith('http') ? [product.imageUrl] : [],
                    },
                    unit_amount: Math.round(price * 100), // Stripe expects cents
                },
                quantity,
            });
        });
        // 3. Create Stripe Checkout Session
        const origin = req.headers.origin || 'http://localhost:3000';
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: stripeLineItems,
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
            client_reference_id: userId,
        });
        if (!session.url) {
            return res.status(500).json({ message: 'Failed to generate Stripe checkout URL' });
        }
        // 4. Create Prisma Order in PENDING status
        await prisma_1.prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: 'PENDING',
                stripeSession: session.id,
                orderItems: {
                    create: orderItemsData,
                },
            },
        });
        // 5. Send back URL
        res.json({ url: session.url });
    }
    catch (error) {
        console.error('Stripe Order creation error:', error);
        res.status(500).json({ message: 'Failed to create checkout session', error });
    }
};
exports.createStripeCheckoutSession = createStripeCheckoutSession;
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const orders = await prisma_1.prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(orders);
    }
    catch (error) {
        console.error('Failed to fetch user orders', error);
        res.status(500).json({ message: 'Failed to fetch user orders', error });
    }
};
exports.getUserOrders = getUserOrders;
// Admin: Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma_1.prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                orderItems: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    }
    catch (error) {
        console.error('Failed to fetch all orders', error);
        res.status(500).json({ message: 'Failed to fetch all orders', error });
    }
};
exports.getAllOrders = getAllOrders;
// Admin: Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const order = await prisma_1.prisma.order.update({
            where: { id: id },
            data: { status },
        });
        res.json(order);
    }
    catch (error) {
        console.error('Failed to update order status', error);
        res.status(500).json({ message: 'Failed to update order status', error });
    }
};
exports.updateOrderStatus = updateOrderStatus;
