import { Request, Response, NextFunction } from 'express';
import * as SubscriptionService from '../services/SubscriptionService';
import { ISubscription } from '../models/SubscriptionModel';

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptionData: ISubscription = req.body;
    const newSubscription = await SubscriptionService.createSubscription(subscriptionData);
    res.status(201).json(newSubscription);
  } catch (error) {
    next(error);
  }
};

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await SubscriptionService.getSubscriptions();
    res.status(200).json(subscriptions);
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await SubscriptionService.getSubscriptionById(req.params.id);
    if (subscription) {
      res.status(200).json(subscription);
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptionData: ISubscription = req.body;
    const updatedSubscription = await SubscriptionService.updateSubscription(subscriptionData);
    if (updatedSubscription) {
      res.status(200).json(updatedSubscription);
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await SubscriptionService.deleteSubscription(req.params.id);
    if (subscription) {
      res.status(200).json({ message: 'Subscription deleted successfully' });
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, newsletterId } = req.body;
    const subscription = await SubscriptionService.unsubscribe(email, newsletterId);
    if (subscription) {
      res.status(200).json({ message: 'Unsubscribed successfully' });
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    next(error);
  }
};
