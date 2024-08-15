// controllers/newsletterController.ts
import { Request, Response, NextFunction } from 'express';
import * as NewsletterService from '../services/NewsletterService';
import { INewsletter } from '../models/NewsletterModel';
import { sendEmail } from '../services/emailService';
import path from 'path';
import { Subscription } from '../models/SubscriptionModel';

export const sendNewsletterNow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsletter = await NewsletterService.getNewsletterById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }

    const subscribers = await Subscription.find();
    const sendPromises = subscribers.map((subscriber) =>
      sendEmail({
        to: subscriber.email,
        subject: newsletter.title,
        html: newsletter.content,
        attachments: [{
          filename: 'logo.png',
          path: path.resolve(__dirname, '../assets/images/blue.png'),
          cid: 'logo'
        }]
      })
    );

    await Promise.all(sendPromises);
    newsletter.status = 'sent';
    await newsletter.save();

    res.status(200).json({ message: 'Newsletter sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const scheduleNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsletter = await NewsletterService.getNewsletterById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }

    const { scheduledAt } = req.body;
    newsletter.scheduledAt = scheduledAt;
    newsletter.status = 'scheduled';
    await newsletter.save();

    // Logic to handle scheduled sending can be added here (e.g., using a cron job)

    res.status(200).json({ message: 'Newsletter scheduled successfully' });
  } catch (error) {
    next(error);
  }
};

export const createNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsletterData: INewsletter = req.body;
    const newNewsletter = await NewsletterService.createNewsletter(newsletterData);
    res.status(201).json(newNewsletter);
  } catch (error) {
    next(error);
  }
};

export const getNewsletters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsletters = await NewsletterService.getNewsletters();
    res.status(200).json(newsletters);
  } catch (error) {
    next(error);
  }
};

export const getNewsletterById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsletter = await NewsletterService.getNewsletterById(req.params.id);
    if (newsletter) {
      res.status(200).json(newsletter);
    } else {
      res.status(404).json({ message: 'Newsletter not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsletterData: INewsletter = req.body;
    const updatedNewsletter = await NewsletterService.updateNewsletter(newsletterData);
    if (updatedNewsletter) {
      res.status(200).json(updatedNewsletter);
    } else {
      res.status(404).json({ message: 'Newsletter not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsletter = await NewsletterService.deleteNewsletter(req.params.id);
    if (newsletter) {
      res.status(200).json({ message: 'Newsletter deleted successfully' });
    } else {
      res.status(404).json({ message: 'Newsletter not found' });
    }
  } catch (error) {
    next(error);
  }
};
