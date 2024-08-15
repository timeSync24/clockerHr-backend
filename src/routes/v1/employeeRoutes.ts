// src/routes/v1/employeeRoutes.ts
import { Router } from 'express';
import EmployeeController from '../../controllers/EmployeeController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new employee (Admin, Tenant-Admin)
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmployeeController.createEmployee);

// Get all employees for a specific company (Admin, Tenant-Admin)
router.get('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), EmployeeController.getEmployeesByCompany);

// Get a specific employee by ID (Admin, Tenant-Admin, Employee)
router.get('/:employeeId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), EmployeeController.getEmployeeById);

// Update a specific employee by ID (Admin, Tenant-Admin)
router.put('/:employeeId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmployeeController.updateEmployee);

// Delete a specific employee by ID (Admin, Tenant-Admin)
router.delete('/:employeeId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmployeeController.deleteEmployee);

export default router;
