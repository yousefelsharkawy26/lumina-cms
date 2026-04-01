"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refreshUserToken = exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateUserProfile = exports.getUserProfile = exports.googleLogin = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const generateToken_1 = require("../utils/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: (0, generateToken_1.generateToken)(user.id, user.role),
            refreshToken: (0, generateToken_1.generateRefreshToken)(user.id, user.role),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to register user', error });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (user && (await bcryptjs_1.default.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.generateToken)(user.id, user.role),
                refreshToken: (0, generateToken_1.generateRefreshToken)(user.id, user.role),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to authenticate user', error });
    }
};
exports.loginUser = loginUser;
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        // Verify the Google ID Token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.email) {
            return res.status(400).json({ message: 'Invalid Google Token' });
        }
        const { email, name } = payload;
        // Check if user already exists
        let user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            // If user doesn't exist, create them
            // Generate a strong random password since they logged in with Google
            const crypto = require('crypto');
            const randomPassword = crypto.randomBytes(32).toString('hex');
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(randomPassword, salt);
            user = await prisma_1.prisma.user.create({
                data: {
                    email,
                    name: name || 'Google User',
                    password: hashedPassword,
                },
            });
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: (0, generateToken_1.generateToken)(user.id, user.role),
            refreshToken: (0, generateToken_1.generateRefreshToken)(user.id, user.role),
        });
    }
    catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ message: 'Failed to authenticate with Google', error });
    }
};
exports.googleLogin = googleLogin;
const getUserProfile = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get profile', error });
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { name, email, password } = req.body;
        let hashedPassword = user.password;
        if (password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            hashedPassword = await bcryptjs_1.default.hash(password, salt);
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: {
                name: name || user.name,
                email: email || user.email,
                password: hashedPassword,
            },
        });
        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: (0, generateToken_1.generateToken)(updatedUser.id, updatedUser.role),
            refreshToken: (0, generateToken_1.generateRefreshToken)(updatedUser.id, updatedUser.role),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update profile', error });
    }
};
exports.updateUserProfile = updateUserProfile;
// Admin: Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
};
exports.getAllUsers = getAllUsers;
// Admin: Update user role
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const user = await prisma_1.prisma.user.update({
            where: { id: id },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update user role', error });
    }
};
exports.updateUserRole = updateUserRole;
// Admin: Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.user.delete({
            where: { id: id },
        });
        res.json({ message: 'User removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};
exports.deleteUser = deleteUser;
// Refresh token
const refreshUserToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_fallback_secret');
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid refresh token - user not found' });
            return;
        }
        res.json({
            token: (0, generateToken_1.generateToken)(user.id, user.role),
            refreshToken: (0, generateToken_1.generateRefreshToken)(user.id, user.role),
        });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};
exports.refreshUserToken = refreshUserToken;
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Return 200 even if user not found for security (prevent email enumeration)
            return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
        }
        // Generate token (expires in 15 mins)
        const resetToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '15m',
        });
        // Create reset url matching our frontend
        // In production, use your actual domain
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <div style="text-align: center; padding: 30px 0; background-color: #f8f9fa; border-radius: 12px 12px 0 0; border: 1px solid #e2e8f0; border-bottom: none;">
          <h1 style="color: #0f172a; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Lumina Premium</h1>
        </div>
        <div style="padding: 40px 30px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Password Reset Request</h2>
          <p style="color: #475569; font-size: 16px;">
            Hello from Lumina Premium,
          </p>
          <p style="color: #475569; font-size: 16px;">
            We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email.
          </p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background-color: #0f172a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Reset Your Password</a>
          </div>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
            <em>Note: This link is only valid for 15 minutes. For security reasons, do not share this link with anyone.</em>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #94a3b8; font-size: 13px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all; margin-top: 8px; display: inline-block;">${resetUrl}</a>
          </p>
        </div>
        <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Lumina Premium. All rights reserved.
        </div>
      </div>
    `;
        try {
            await (0, sendEmail_1.default)({
                email: user.email,
                subject: 'Lumina Premium - Password Reset',
                message,
            });
            res.status(200).json({ message: 'Email sent successfully!' });
        }
        catch (error) {
            console.error('Email could not be sent', error);
            res.status(500).json({ message: 'Email could not be sent' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error processing forgot password' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const { password } = req.body;
        // Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        }
        catch (err) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Find and update user
        await prisma_1.prisma.user.update({
            where: { id: decoded.id },
            data: { password: hashedPassword },
        });
        res.status(200).json({ message: 'Password reset completely successful. Please log in.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error resetting password' });
    }
};
exports.resetPassword = resetPassword;
