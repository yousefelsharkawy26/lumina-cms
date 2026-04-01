"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookHandler = void 0;
const stripe_1 = __importDefault(require("stripe"));
const prisma_1 = require("../lib/prisma");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-03-25.dahlia',
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        if (!sig) {
            throw new Error('Missing stripe-signature header');
        }
        // Note: req.body MUST be raw buffer here securely parsed by Express middleware upstream
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event natively
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(`Payment successful for Stripe session ID: ${session.id}`);
            try {
                // Connect directly into our DB and securely upgrade the Order's PENDING status
                const order = await prisma_1.prisma.order.findFirst({
                    where: { stripeSession: session.id },
                });
                if (order) {
                    await prisma_1.prisma.order.update({
                        where: { id: order.id },
                        data: { status: 'PAID' },
                    });
                    console.log(`Order ${order.id} marked as PAID`);
                }
                else {
                    console.error(`No Order found mathematically matching session ID: ${session.id}`);
                }
            }
            catch (dbError) {
                console.error('Database connection failed adjusting paid status:', dbError);
                return res.status(500).send('Internal Server Error updating native DB constraints');
            }
            break;
        // Future expansion: You logically can handle cancelled, expired, refunded events here!
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to safely acknowledge receipt of the event
    res.send();
};
exports.stripeWebhookHandler = stripeWebhookHandler;
