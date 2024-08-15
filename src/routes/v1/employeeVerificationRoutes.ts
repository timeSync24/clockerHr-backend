// src/routes/v1/employeeVerificationRoutes.ts
import { Router } from 'express';
import EmployeeVerificationController from '../../controllers/EmployeeVerificationController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new employee verification record (Admin, Tenant-Admin)
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmployeeVerificationController.createEmployeeVerification);

// Get all employee verification records for a specific company (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), EmployeeVerificationController.getEmployeeVerificationsByCompany);

// Get a specific employee verification record by ID (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId/:verificationId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), EmployeeVerificationController.getEmployeeVerificationById);

// Update a specific employee verification record by ID (Admin, Tenant-Admin)
router.put('/:companyId/:verificationId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmployeeVerificationController.updateEmployeeVerification);

// Delete a specific employee verification record by ID (Admin, Tenant-Admin)
router.delete('/:companyId/:verificationId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmployeeVerificationController.deleteEmployeeVerification);

export default router;
