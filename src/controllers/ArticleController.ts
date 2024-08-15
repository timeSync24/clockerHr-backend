// src/controllers/ArticleController.ts
import { Request, Response, NextFunction } from 'express';
import * as ArticleService from '../services/ArticleService';
import { IArticle } from '../models/ArticleModel';
import mongoose from 'mongoose';


export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleData: Partial<IArticle> = req.body;
    const userId = new mongoose.Types.ObjectId(req.user!._id);
    console.log('Creating article with author:', userId);
    const newArticle = await ArticleService.createArticle({ ...articleData, author: userId });
    res.status(201).json(newArticle);
  } catch (error) {
    next(error);
  }
};

export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await ArticleService.getArticles();
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

export const getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await ArticleService.getArticleBySlug(req.params.slug);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleData: Partial<IArticle> = req.body;
    const updatedArticle = await ArticleService.updateArticle(req.params.id, articleData);
    if (updatedArticle) {
      res.status(200).json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await ArticleService.deleteArticle(req.params.id);
    if (article) {
      res.status(200).json({ message: 'Article deleted successfully' });
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const addLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedArticle = await ArticleService.addLike(req.params.id);
    if (updatedArticle) {
      res.status(200).json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    next(error);
  }
};



export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req.body;
    console.log('Comment body:', body);

    const userId = new mongoose.Types.ObjectId(req.user!._id);
    console.log('User ID:', userId);

    const updatedArticle = await ArticleService.addComment(req.params.id, { body, user: userId });
    console.log('Updated Article:', updatedArticle);

    if (updatedArticle) {
      res.status(200).json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    next(error);
  }
};


export const likeComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleId, commentId } = req.params;
    const updatedArticle = await ArticleService.likeComment(articleId, commentId);
    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

export const addReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user!._id);
    const { articleId, commentId } = req.params;

    const updatedArticle = await ArticleService.addReply(articleId, commentId, { body, user: userId });

    if (updatedArticle) {
      res.status(200).json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article or comment not found' });
    }
  } catch (error) {
    console.error('Error adding reply:', error);
    next(error);
  }
};


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