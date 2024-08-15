import { Router } from 'express';
import {
  login,
  logout,
  resetPassword,
  updatePassword,
  session,
  enable2FA,
  verify2FA,
  disable2FA,
} from '../../controllers/authController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);

// 2FA routes
router.post('/enable-2fa', verifyToken, enable2FA);
router.post('/verify-2fa', verifyToken, verify2FA);
router.post('/disable-2fa', verifyToken, disable2FA);

router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);
router.get('/session', verifyToken, session);



export default router;
