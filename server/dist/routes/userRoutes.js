"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/google', userController_1.googleLogin);
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.post('/forgot-password', userController_1.forgotPassword);
router.post('/reset-password/:token', userController_1.resetPassword);
router.post('/refresh', userController_1.refreshUserToken);
router.route('/profile')
    .get(authMiddleware_1.protect, userController_1.getUserProfile)
    .put(authMiddleware_1.protect, userController_1.updateUserProfile);
// Admin routes
router.get('/', authMiddleware_1.protect, authMiddleware_1.admin, userController_1.getAllUsers);
router.put('/:id/role', authMiddleware_1.protect, authMiddleware_1.admin, userController_1.updateUserRole);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, userController_1.deleteUser);
exports.default = router;
