"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const prisma_1 = require("../lib/prisma");
const getProducts = async (req, res) => {
    try {
        const { q, categoryId, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc', page = '1', limit = '9' } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 9;
        const skip = (pageNumber - 1) * limitNumber;
        let whereClause = {};
        if (q && typeof q === 'string') {
            whereClause.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { category: { name: { contains: q, mode: 'insensitive' } } }
            ];
        }
        if (categoryId && typeof categoryId === 'string' && categoryId !== 'all') {
            whereClause.categoryId = categoryId;
        }
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice)
                whereClause.price.gte = parseFloat(minPrice);
            if (maxPrice)
                whereClause.price.lte = parseFloat(maxPrice);
        }
        let orderBy = {};
        if (sortBy === 'price') {
            orderBy = { price: order === 'asc' ? 'asc' : 'desc' };
        }
        else {
            orderBy = { createdAt: order === 'asc' ? 'asc' : 'desc' };
        }
        const [products, totalItems] = await Promise.all([
            prisma_1.prisma.product.findMany({
                where: whereClause,
                include: {
                    category: true,
                },
                orderBy,
                skip,
                take: limitNumber,
            }),
            prisma_1.prisma.product.count({ where: whereClause })
        ]);
        const totalPages = Math.ceil(totalItems / limitNumber);
        res.json({
            products,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                totalPages,
                totalItems,
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await prisma_1.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let similarProducts = [];
        if (product.categoryId) {
            similarProducts = await prisma_1.prisma.product.findMany({
                where: {
                    categoryId: product.categoryId,
                    id: { not: product.id }
                },
                take: 4,
                orderBy: { stockCount: 'desc' },
                include: { category: true }
            });
        }
        // Fallback if category is empty or missing
        if (similarProducts.length === 0) {
            similarProducts = await prisma_1.prisma.product.findMany({
                where: {
                    id: { not: product.id }
                },
                take: 4,
                orderBy: { createdAt: 'desc' },
                include: { category: true }
            });
        }
        res.json({ ...product, similarProducts });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch product', error });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, categoryId, stockCount } = req.body;
        // For simplicity, if categoryId isn't provided, just grab the first one or throw error
        // But let's assume categoryId is optional in our quick form, or we pass null.
        // In our Prisma schema, categoryId might be optional or required. We'll pass it if it exists.
        const product = await prisma_1.prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                imageUrl: imageUrl || 'https://via.placeholder.com/300',
                stockCount: parseInt(stockCount) || 0,
                categoryId,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create product', error });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, price, imageUrl, stockCount, categoryId } = req.body;
        const updatedProduct = await prisma_1.prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                imageUrl,
                stockCount: parseInt(stockCount),
                categoryId,
            },
        });
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.prisma.product.delete({
            where: { id },
        });
        res.json({ message: 'Product removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};
exports.deleteProduct = deleteProduct;
