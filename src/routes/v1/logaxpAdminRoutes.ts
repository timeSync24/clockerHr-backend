import express from 'express';
import {
  getAllLogaxpAdmins,
  getActiveLogaxpAdmins,
  createLogaxpAdmin,
  updateLogaxpAdmin,
  deleteLogaxpAdmin,
  getLogaxpAdminById,
  activateLogaxpAdmin,
  deactivateLogaxpAdmin,
  getTotalUsersPerCompany
} from '../../controllers/logaxpAdminController';
import { verifyToken } from '../../middlewares/authMiddleware';
import verifyRole from '../../middlewares/verifyRole';

const router = express.Router();

// Routes to manage LogaxpAdmins
router.get('/', verifyToken, verifyRole(['LogaxpAdmin']), getAllLogaxpAdmins);
router.get('/active', verifyToken, verifyRole(['LogaxpAdmin']), getActiveLogaxpAdmins);
router.get('/total-users-per-company',  verifyToken, verifyRole(['LogaxpAdmin']), getTotalUsersPerCompany);
router.post('/', verifyToken, verifyRole(['LogaxpAdmin']), createLogaxpAdmin);
router.put('/:id', verifyToken, verifyRole(['LogaxpAdmin']), updateLogaxpAdmin);
router.delete('/:id', verifyToken, verifyRole(['LogaxpAdmin']), deleteLogaxpAdmin);
router.get('/:id', verifyToken, verifyRole(['LogaxpAdmin']), getLogaxpAdminById);
router.put('/:id/activate', verifyToken, verifyRole(['LogaxpAdmin']), activateLogaxpAdmin);
router.put('/:id/deactivate', verifyToken, verifyRole(['LogaxpAdmin']), deactivateLogaxpAdmin);

export default router;
