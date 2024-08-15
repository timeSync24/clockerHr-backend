// src/routes/v1/directDepositRoutes.ts
import { Router } from 'express';
import DirectDepositController from '../../controllers/DirectDepositController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new direct deposit record (Employee, Admin, Tenant-Admin)
router.post('/', verifyToken, verifyRole(['Employee', 'Admin', 'Tenant-Admin']), DirectDepositController.createDirectDeposit);

// Get all direct deposit records for a specific company (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), DirectDepositController.getDirectDepositsByCompany);

// Get a specific direct deposit record by ID (Employee, Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId/:directDepositId', verifyToken, verifyRole(['Employee', 'Admin', 'Tenant-Admin', 'LogaxpAdmin']), DirectDepositController.getDirectDepositById);

// Update a specific direct deposit record (Employee, Admin, Tenant-Admin)
router.put('/:companyId/:directDepositId', verifyToken, verifyRole(['Employee', 'Admin', 'Tenant-Admin']), DirectDepositController.updateDirectDeposit);

// Delete a specific direct deposit record (Admin, Tenant-Admin)
router.delete('/:companyId/:directDepositId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), DirectDepositController.deleteDirectDeposit);

export default router;
