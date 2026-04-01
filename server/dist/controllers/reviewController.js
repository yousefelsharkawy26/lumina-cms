"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.getProductReviews = void 0;
const prisma_1 = require("../lib/prisma");
const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId;
        const reviews = await prisma_1.prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error });
    }
};
exports.getProductReviews = getProductReviews;
const createReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { rating, comment } = req.body;
        const userId = req.user.id;
        if (!rating || !comment) {
            return res.status(400).json({ message: 'Rating and comment are required' });
        }
        // Optional: Prevent duplicate reviews from same user for same product
        const existingReview = await prisma_1.prisma.review.findFirst({
            where: {
                productId,
                userId,
            },
        });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }
        const review = await prisma_1.prisma.review.create({
            data: {
                rating: Number(rating),
                comment,
                productId,
                userId,
            },
            include: {
                user: { select: { name: true } },
            },
        });
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create review', error });
    }
};
exports.createReview = createReview;
