import express from 'express';
import * as SubscriptionController from '../../controllers/subscriptionController';

const router = express.Router();

router.post('/', SubscriptionController.createSubscription);
router.get('/', SubscriptionController.getSubscriptions);
router.get('/:id', SubscriptionController.getSubscriptionById);
router.put('/:id', SubscriptionController.updateSubscription);
router.delete('/:id', SubscriptionController.deleteSubscription);
router.post('/unsubscribe', SubscriptionController.unsubscribe);

export default router;
