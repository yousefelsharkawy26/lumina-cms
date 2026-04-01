"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, orderController_1.createStripeCheckoutSession);
router.get('/myorders', authMiddleware_1.protect, orderController_1.getUserOrders);
// Admin routes
router.get('/', authMiddleware_1.protect, authMiddleware_1.admin, orderController_1.getAllOrders);
router.put('/:id/status', authMiddleware_1.protect, authMiddleware_1.admin, orderController_1.updateOrderStatus);
exports.default = router;
