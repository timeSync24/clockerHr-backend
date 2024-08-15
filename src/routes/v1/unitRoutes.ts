// src/routes/v1/unitRoutes.ts
import { Router } from 'express';
import UnitController from '../../controllers/UnitController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new unit (Admin, Tenant-Admin)
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), UnitController.createUnit);

// Get all units for a specific company (Admin, Tenant-Admin, Employee)
router.get('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), UnitController.getUnitsByCompany);

// Get a specific unit by ID (Admin, Tenant-Admin, Employee)
router.get('/:unitId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), UnitController.getUnitById);

// Update a specific unit by ID (Admin, Tenant-Admin)
router.put('/:unitId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), UnitController.updateUnit);

// Delete a specific unit by ID (Admin, Tenant-Admin)
router.delete('/:unitId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), UnitController.deleteUnit);

export default router;
