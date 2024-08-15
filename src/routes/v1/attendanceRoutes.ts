// src/routes/v1/attendanceRoutes.ts
import { Router } from 'express';
import AttendanceController from '../../controllers/AttendanceController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new attendance record (Admin, Tenant-Admin)
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), AttendanceController.createAttendance);

// Get all attendance records for a specific company (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), AttendanceController.getAttendanceByCompany);

// Get a specific attendance record by ID (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId/:attendanceId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), AttendanceController.getAttendanceById);

// Update a specific attendance record by ID (Admin, Tenant-Admin)
router.put('/:companyId/:attendanceId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), AttendanceController.updateAttendance);

// Delete a specific attendance record by ID (Admin, Tenant-Admin)
router.delete('/:companyId/:attendanceId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), AttendanceController.deleteAttendance);

export default router;
