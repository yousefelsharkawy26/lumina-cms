import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      q, 
      categoryId, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      order = 'desc',
      page = '1',
      limit = '9'
    } = req.query;
    
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 9;
    const skip = (pageNumber - 1) * limitNumber;

    let whereClause: any = {};
    
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
      if (minPrice) whereClause.price.gte = parseFloat(minPrice as string);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice as string);
    }

    let orderBy: any = {};
    if (sortBy === 'price') {
      orderBy = { price: order === 'asc' ? 'asc' : 'desc' };
    } else {
      orderBy = { createdAt: order === 'asc' ? 'asc' : 'desc' };
    }

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limitNumber,
      }),
      prisma.product.count({ where: whereClause })
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let similarProducts: any[] = [];
    if (product.categoryId) {
      similarProducts = await prisma.product.findMany({
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
      similarProducts = await prisma.product.findMany({
        where: {
          id: { not: product.id }
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      });
    }

    res.json({ ...product, similarProducts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, categoryId, stockCount } = req.body;
    
    // For simplicity, if categoryId isn't provided, just grab the first one or throw error
    // But let's assume categoryId is optional in our quick form, or we pass null.
    // In our Prisma schema, categoryId might be optional or required. We'll pass it if it exists.
    
    const product = await prisma.product.create({
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, price, imageUrl, stockCount, categoryId } = req.body;

    const updatedProduct = await prisma.product.update({
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};
