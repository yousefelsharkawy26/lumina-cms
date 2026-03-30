import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { name },
    });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const category = await prisma.category.update({
      where: { id: id as string },
      data: { name },
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const linkedProducts = await prisma.product.count({
      where: { categoryId: id as string },
    });

    if (linkedProducts > 0) {
      return res.status(400).json({ message: 'Cannot delete category with linked products' });
    }

    await prisma.category.delete({
      where: { id: id as string },
    });

    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error });
  }
};
