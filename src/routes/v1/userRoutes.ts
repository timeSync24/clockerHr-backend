// src/routes/userRoutes.ts
import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  verifyEmail,
  bulkCreateUsers,
  inviteUser,
  acceptInvitation,
  getUserProfile,
  updateUserProfile,
  getTenantAdmins,
  deactivateUser,
  reactivateUser,
} from '../../controllers/userController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';
import upload from '../../middlewares/fileUpload';
import verifyCompany from '../../middlewares/verifyCompany';

const router = express.Router();

// Routes accessible by LogaxpAdmin and Admin
router.get('/', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Tenant-Admin']), verifyCompany, getUsers);
router.get('/profile', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Employee']), getUserProfile);
router.get('/tenant-admins', verifyToken, verifyRole(['LogaxpAdmin']), getTenantAdmins);

router.get('/:id', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Tenant-Admin']), verifyCompany, getUserById);
router.post('/', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Tenant-Admin']), verifyCompany, createUser);
router.put('/:id', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Tenant-Admin']), verifyCompany, updateUser);


router.delete('/:id', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Tenant-Admin']), verifyCompany, deleteUser);
router.post('/bulk-create', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Tenant-Admin']), verifyCompany, upload.single('file'), bulkCreateUsers);
router.post('/invite', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Tenant-Admin']), verifyCompany, inviteUser);

// Route to deactivate a user
router.put('/:id/deactivate', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Tenant-Admin']), deactivateUser);

// Route to reactivate a user
router.put('/:id/activate', verifyToken, verifyRole(['LogaxpAdmin', 'Admin', 'Tenant-Admin']), reactivateUser);


// Public routes
router.post('/accept-invitation', acceptInvitation);
router.get('/verify-email', verifyEmail);



export default router;
