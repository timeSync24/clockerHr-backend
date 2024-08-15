import { Router } from 'express';
import * as ContactController from '../../controllers/ContactController';

const router = Router();

router.post('/', ContactController.createContact);
router.get('/', ContactController.getContacts);
router.get('/:id', ContactController.getContactById);
router.put('/:id/resolve', ContactController.resolveContact); 
router.put('/:id', ContactController.updateContact);
router.delete('/:id', ContactController.deleteContact);

export default router;
