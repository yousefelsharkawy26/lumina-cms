"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
// Important: Note that this route should be nested if we want to extract productId from parent route,
// or we can pass productId directly as a route parameter.
// Assuming the mount in index.ts is: app.use('/api/products/:productId/reviews', reviewRoutes)
const router = express_1.default.Router({ mergeParams: true });
router.route('/')
    .get(reviewController_1.getProductReviews)
    .post(authMiddleware_1.protect, reviewController_1.createReview);
exports.default = router;
