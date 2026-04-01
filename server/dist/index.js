"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
// Webhooks must be handled here BEFORE any global express.json() can parse the buffers out!
app.use('/api/webhooks', webhookRoutes_1.default);
// Global parsing middleware (for standard JSON posts)
app.use(express_1.default.json());
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "E-commerce API is running!" });
});
app.use('/api/products', productRoutes_1.default);
app.use('/api/products/:productId/reviews', reviewRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), '/uploads')));
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
