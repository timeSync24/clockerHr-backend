// src/routes/v1/branchRoutes.ts
import { Router } from 'express';
import BranchController from '../../controllers/BranchController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new branch (Admin, Tenant-Admin)
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), BranchController.createBranch);

// Get all branches for a specific company (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), BranchController.getBranchesByCompany);

// Get a specific branch by ID (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:branchId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), BranchController.getBranchById);

// Update a specific branch by ID (Admin, Tenant-Admin)
router.put('/:branchId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), BranchController.updateBranch);

// Delete a specific branch by ID (Admin, Tenant-Admin)
router.delete('/:branchId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), BranchController.deleteBranch);

export default router;
