// src/routes/v1/emergencyContactRoutes.ts
import { Router } from 'express';
import EmergencyContactController from '../../controllers/EmergencyContactController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new emergency contact (Employee, Admin, Tenant-Admin)
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee']), EmergencyContactController.createEmergencyContact);

// Get all emergency contacts for a specific company (Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), EmergencyContactController.getEmergencyContactsByCompany);

// Get a specific emergency contact by ID (Employee, Admin, Tenant-Admin, LogaxpAdmin)
router.get('/:companyId/:emergencyContactId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), EmergencyContactController.getEmergencyContactById);

// Update a specific emergency contact (Employee, Admin, Tenant-Admin)
router.put('/:companyId/:emergencyContactId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee']), EmergencyContactController.updateEmergencyContact);

// Delete a specific emergency contact (Admin, Tenant-Admin)
router.delete('/:companyId/:emergencyContactId', verifyToken, verifyRole(['Admin', 'Tenant-Admin']), EmergencyContactController.deleteEmergencyContact);

export default router;
