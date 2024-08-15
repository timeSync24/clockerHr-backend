// src/controllers/PublishedArticleController.ts
import { Request, Response, NextFunction } from 'express';
import * as ArticleService from '../services/ArticleService';

export const getPublishedArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await ArticleService.getPublishedArticles();
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

export const getPublishedArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await ArticleService.getPublishedArticleBySlug(req.params.slug);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    next(error);
  }
};
