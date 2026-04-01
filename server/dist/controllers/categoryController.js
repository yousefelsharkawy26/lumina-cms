"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const prisma_1 = require("../lib/prisma");
const getCategories = async (req, res) => {
    try {
        const categories = await prisma_1.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories', error });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const categoryExists = await prisma_1.prisma.category.findUnique({
            where: { name },
        });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        const category = await prisma_1.prisma.category.create({
            data: { name },
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create category', error });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const category = await prisma_1.prisma.category.update({
            where: { id: id },
            data: { name },
        });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update category', error });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if category has products
        const linkedProducts = await prisma_1.prisma.product.count({
            where: { categoryId: id },
        });
        if (linkedProducts > 0) {
            return res.status(400).json({ message: 'Cannot delete category with linked products' });
        }
        await prisma_1.prisma.category.delete({
            where: { id: id },
        });
        res.json({ message: 'Category removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error });
    }
};
exports.deleteCategory = deleteCategory;
