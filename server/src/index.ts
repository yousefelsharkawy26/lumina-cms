import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
import reviewRoutes from './routes/reviewRoutes';
import webhookRoutes from './routes/webhookRoutes';
import uploadRoutes from './routes/uploadRoutes';
import settingsRoutes from './routes/settingsRoutes';
import chatRoutes from './routes/chatRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

// Webhooks must be handled here BEFORE any global express.json() can parse the buffers out!
app.use('/api/webhooks', webhookRoutes);

// Global parsing middleware (for standard JSON posts)
app.use(express.json());

app.get("/api/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "ok", message: "E-commerce API is running!" });
});

app.use('/api/products', productRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/chat', chatRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), '/uploads')));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
