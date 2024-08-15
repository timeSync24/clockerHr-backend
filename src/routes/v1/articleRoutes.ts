// src/routes/articleRoutes.ts
import { Router } from 'express';
import {
  createArticle,
  getArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  addLike,
  addComment,
  likeComment,
  addReply
} from '../../controllers/ArticleController';
import {
  getPublishedArticles,
  getPublishedArticleBySlug
} from '../../controllers/PublishedArticleController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

// Admin routes
router.post('/', verifyToken, createArticle);
router.get('/', verifyToken, getArticles);
router.get('/:slug', verifyToken, getArticleBySlug);
router.put('/:id', verifyToken, updateArticle);
router.delete('/:id', verifyToken, deleteArticle);
router.post('/:id/like', verifyToken, addLike);
router.post('/:id/comment', verifyToken, addComment);
router.post('/:articleId/comments/:commentId/like', verifyToken, likeComment);
router.post('/:articleId/comments/:commentId/reply', verifyToken, addReply);

// Public routes
router.get('/published', verifyToken, getPublishedArticles);
router.get('/published/:slug', getPublishedArticleBySlug);

export default router;
