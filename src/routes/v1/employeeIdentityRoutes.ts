// src/routes/v1/employeeIdentityRoutes.ts
import { Router } from 'express';
import EmployeeIdentityController from '../../controllers/EmployeeIdentityController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new employee identity record (Admin, Tenant-Admin)
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmployeeIdentityController.createEmployeeIdentity);

// Get all employee identity records for a specific company (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), EmployeeIdentityController.getEmployeeIdentitiesByCompany);

// Get a specific employee identity record by ID (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId/:identityId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), EmployeeIdentityController.getEmployeeIdentityById);

// Update a specific employee identity record by ID (Admin, Tenant-Admin)
router.put('/:companyId/:identityId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmployeeIdentityController.updateEmployeeIdentity);

// Delete a specific employee identity record by ID (Admin, Tenant-Admin)
router.delete('/:companyId/:identityId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmployeeIdentityController.deleteEmployeeIdentity);

export default router;
