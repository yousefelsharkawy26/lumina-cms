import express from 'express';
import { registerUser, loginUser, googleLogin, forgotPassword, resetPassword, getUserProfile, updateUserProfile, getAllUsers, updateUserRole, deleteUser, refreshUserToken } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/google', googleLogin);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh', refreshUserToken as any);
router.route('/profile')
  .get(protect, getUserProfile as any)
  .put(protect, updateUserProfile as any);

// Admin routes
router.get('/', protect, admin, getAllUsers);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

export default router;
