// src/routes/v1/departmentRoutes.ts

import { Router } from 'express';
import DepartmentController from '../../controllers/DepartmentController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new department
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), DepartmentController.createDepartment);

// Get all departments for a specific company
router.get('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), DepartmentController.getDepartments);

// Get a specific department by ID
router.get('/:departmentId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), DepartmentController.getDepartmentById);

// Update a department
router.put('/:departmentId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), DepartmentController.updateDepartment);

// Delete a department
router.delete('/:departmentId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), DepartmentController.deleteDepartment);

export default router;
