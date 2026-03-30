import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId as string;

    const reviews = await prisma.review.findMany({
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId as string;
    const { rating, comment } = req.body;
    const userId = (req as any).user.id;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    // Optional: Prevent duplicate reviews from same user for same product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await prisma.review.create({
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error });
  }
};
