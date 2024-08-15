// src/routes/v1/demographicsRoutes.ts
import { Router } from 'express';
import DemographicsController from '../../controllers/DemographicsController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Employees can create their own demographics record
// Admins and Tenant-Admins can create records for others
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee']), DemographicsController.createDemographics);

// Get all demographics records for a specific company (Admin, Tenant-Admin, Employee, LogaxpAdmin)
router.get('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), DemographicsController.getDemographicsByCompany);

// Employees can view their own demographics record
// Admins, Tenant-Admins, and LogaxpAdmins can view any record within their company
router.get('/:demographicsId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), DemographicsController.getDemographicsById);

// Employees can update their own demographics record
// Admins and Tenant-Admins can update any record within their company
router.put('/:demographicsId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee']), DemographicsController.updateDemographics);

// Only Admins and Tenant-Admins can delete demographics records
router.delete('/:demographicsId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), DemographicsController.deleteDemographics);

export default router;
