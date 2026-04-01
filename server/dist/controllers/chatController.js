"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = void 0;
const prisma_1 = require("../lib/prisma");
const genai_1 = require("@google/genai");
const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'Server configuration error: Gemini API key missing' });
        }
        // Initialize the new Google Gen AI SDK client
        const ai = new genai_1.GoogleGenAI({ apiKey });
        // Fetch active products to provide context
        const products = await prisma_1.prisma.product.findMany({
            include: {
                category: true,
            },
        });
        const contextList = products.map((p) => {
            return `- ${p.name} ($${p.price}): ${p.description}. Category: ${p.category?.name || 'Uncategorized'}. In Stock: ${p.stockCount}`;
        }).join('\n');
        const systemInstruction = `You are SBot, an AI shopping assistant for Lumina Premium E-Commerce store.
You help users find products, answer questions, and provide recommendations based ONLY on the products available in the store.
Format your responses nicely. Do NOT invent products that don't exist in the list below.

Available Products:
${contextList}

Answer the user's latest message appropriately. Keep it concise, friendly, and helpful.`;
        // Map history to the required format
        // '@google/genai' models.generateContent accepts an object with `contents` and `systemInstruction`
        const formattedHistory = (history || []).map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user', // genai sdk uses 'model' and 'user'
            parts: [{ text: msg.content }],
        }));
        // Add the new user message
        formattedHistory.push({
            role: 'user',
            parts: [{ text: message }],
        });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: formattedHistory,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });
        const reply = response.text || "I'm sorry, I couldn't process that request.";
        res.json({ reply });
    }
    catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ message: 'Failed to generate response', error: error.message });
    }
};
exports.handleChat = handleChat;
