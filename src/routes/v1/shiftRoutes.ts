// src/routes/v1/shiftRoutes.ts
import { Router } from 'express';
import ShiftController from '../../controllers/ShiftController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new shift (Admin, Tenant-Admin)
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), ShiftController.createShift);

// Get all shifts for a specific company (Admin, Tenant-Admin, Employee)
router.get('/:companyId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), ShiftController.getShiftsByCompany);

// Get shifts for a specific employee in a company (Admin, Tenant-Admin, Employee)
router.get('/:companyId/employee/:employeeId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), ShiftController.getShiftsByEmployee);

// Get a specific shift by ID (Admin, Tenant-Admin, Employee)
router.get('/:companyId/:shiftId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), ShiftController.getShiftById);

// Update a specific shift by ID (Admin, Tenant-Admin)
router.put('/:companyId/:shiftId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), ShiftController.updateShift);

// Delete a specific shift by ID (Admin, Tenant-Admin)
router.delete('/:companyId/:shiftId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), ShiftController.deleteShift);

export default router;
