import { Router } from 'express';
import JobTitleController from '../../controllers/JobTitleController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = Router();

// Create a new job title
router.post('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), JobTitleController.createJobTitle);

// Get all job titles for a specific company
router.get('/', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), JobTitleController.getJobTitles);

// Get a specific job title by ID
router.get('/:jobTitleId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'Employee', 'LogaxpAdmin']), JobTitleController.getJobTitleById);

// Update a job title
router.put('/:jobTitleId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), JobTitleController.updateJobTitle);

// Delete a job title
router.delete('/:jobTitleId', verifyToken, verifyRole(['Admin', 'Tenant-Admin', 'LogaxpAdmin']), JobTitleController.deleteJobTitle);

export default router;
