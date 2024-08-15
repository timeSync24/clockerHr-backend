// src/routes/v1/timeLogRoutes.ts
import { Router } from 'express';
import TimeLogController from '../../controllers/TimeLogController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new time log (Admin, Tenant-Admin, Employee)
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee']), TimeLogController.createTimeLog);

// Get all time logs for a specific company (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), TimeLogController.getTimeLogsByCompany);

// Get time logs for a specific employee in a company (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId/employee/:employeeId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), TimeLogController.getTimeLogsByEmployee);

// Get a specific time log by ID (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId/:timeLogId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), TimeLogController.getTimeLogById);

// Update a specific time log by ID (Admin, Tenant-Admin)
router.put('/:companyId/:timeLogId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), TimeLogController.updateTimeLog);

// Delete a specific time log by ID (Admin, Tenant-Admin)
router.delete('/:companyId/:timeLogId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), TimeLogController.deleteTimeLog);

export default router;
