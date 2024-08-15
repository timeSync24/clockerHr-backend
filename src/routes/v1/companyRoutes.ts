import { Router } from 'express';
import * as companyController from '../../controllers/companyController';
import { validateCompanySignup } from '../../middlewares/validation';

const router = Router();

router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.post('/', validateCompanySignup, companyController.createCompany);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

router.get('/verify-email', companyController.verifyEmail); 

export default router;
