import { Router } from 'express';
import userRoutes from './userRoutes';
import companyRoutes from './companyRoutes';
import authRoutes from './authRoutes';
import contactRoutes from './contactRoutes';
import newslettersRoutes from './newsletterRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import articleRoutes from './articleRoutes';
import departmentRoutes from './departmentRoutes';
import demographicsRoutes from './demographicsRoutes';
import unitRoutes from './unitRoutes';
import branchRoutes from './branchRoutes';
import jobTitleRoutes from './jobTitleRoutes';
import employeeRoutes from './employeeRoutes';
import logaxpAdminRoutes from './logaxpAdminRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);
router.use('/newsletters', newslettersRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/articles', articleRoutes);
router.use('/departments', departmentRoutes);
router.use('/demographics', demographicsRoutes);
router.use('/units', unitRoutes);
router.use('/jobtitles', jobTitleRoutes);
router.use('/branches', branchRoutes);
router.use('/employees', employeeRoutes);
router.use('/logaxp-admins', logaxpAdminRoutes);

export default router;
