"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const prisma_1 = require("../lib/prisma");
// @desc    Get store settings
// @route   GET /api/settings
// @access  Public (or Admin depending on your needs, but mostly safe to be public or admin-only)
const getSettings = async (req, res) => {
    try {
        let settings = await prisma_1.prisma.storeSettings.findUnique({
            where: { id: "default" },
        });
        if (!settings) {
            settings = await prisma_1.prisma.storeSettings.create({
                data: {
                    id: "default",
                    storeName: "Lumina Premium",
                    supportEmail: "support@lumina.com",
                    currency: "USD ($)",
                    theme: "system",
                    taxRate: 0.0,
                    orderEmails: true,
                    stockAlerts: true,
                    twoFactorAdmin: false,
                    sessionTimeout: 24,
                    maintenanceMode: false,
                    apiVersion: "v1.0.0",
                },
            });
        }
        res.status(200).json(settings);
    }
    catch (error) {
        console.error("Failed to fetch settings:", error);
        res.status(500).json({ message: "Server error while fetching settings" });
    }
};
exports.getSettings = getSettings;
// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const { storeName, supportEmail, currency, theme, taxRate, stripePublicKey, stripeSecretKey, orderEmails, stockAlerts, twoFactorAdmin, sessionTimeout, maintenanceMode, apiVersion, } = req.body;
        const settings = await prisma_1.prisma.storeSettings.upsert({
            where: { id: "default" },
            update: {
                storeName,
                supportEmail,
                currency,
                theme,
                taxRate: taxRate !== undefined ? Number(taxRate) : undefined,
                stripePublicKey,
                stripeSecretKey,
                orderEmails,
                stockAlerts,
                twoFactorAdmin,
                sessionTimeout: sessionTimeout !== undefined ? Number(sessionTimeout) : undefined,
                maintenanceMode,
                apiVersion,
            },
            create: {
                id: "default",
                storeName: storeName || "Lumina Premium",
                supportEmail: supportEmail || "support@lumina.com",
                currency: currency || "USD ($)",
                theme: theme || "system",
                taxRate: taxRate !== undefined ? Number(taxRate) : 0.0,
                stripePublicKey,
                stripeSecretKey,
                orderEmails: orderEmails !== undefined ? orderEmails : true,
                stockAlerts: stockAlerts !== undefined ? stockAlerts : true,
                twoFactorAdmin: twoFactorAdmin !== undefined ? twoFactorAdmin : false,
                sessionTimeout: sessionTimeout !== undefined ? Number(sessionTimeout) : 24,
                maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : false,
                apiVersion: apiVersion || "v1.0.0",
            },
        });
        res.status(200).json(settings);
    }
    catch (error) {
        console.error("Failed to update settings:", error);
        res.status(500).json({ message: "Server error while updating settings" });
    }
};
exports.updateSettings = updateSettings;
