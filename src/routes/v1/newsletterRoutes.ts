// routes/newsletterRoutes.ts
import { Router } from 'express';
import {
  createNewsletter,
  getNewsletters,
  getNewsletterById,
  updateNewsletter,
  deleteNewsletter,
  sendNewsletterNow,
  scheduleNewsletter,
} from '../../controllers/newsletterController';

const router = Router();

router.post('/', createNewsletter);
router.get('/', getNewsletters);
router.get('/:id', getNewsletterById);
router.put('/:id', updateNewsletter);
router.delete('/:id', deleteNewsletter);
router.post('/:id/send', sendNewsletterNow);
router.post('/:id/schedule', scheduleNewsletter);

export default router;
