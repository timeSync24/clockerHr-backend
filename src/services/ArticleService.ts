// src/services/ArticleService.ts
import { IArticle, ICommentDoc } from '../models/ArticleModel';
import { Article } from '../models/ArticleModel';
import slugify from 'slugify';
import mongoose from 'mongoose';

export const createArticle = async (articleData: Partial<IArticle>): Promise<IArticle> => {
  articleData.slug = slugify(articleData.title!, { lower: true });
  const wordsPerMinute = 200;
  const textLength = articleData.content?.split(' ').length ?? 0;
  articleData.readingTime = Math.ceil(textLength / wordsPerMinute);

  if (!articleData.author) {
    throw new Error('Author is required when creating an article');
  }

  const article = new Article(articleData);
  return await article.save();
};

export const getArticles = async (): Promise<IArticle[]> => {
  return await Article.find().populate('author relatedArticles');
};


// Ensure this function returns an array
export const getPublishedArticles = async (): Promise<IArticle[]> => {
  const articles = await Article.find({ status: 'published' }).populate('author relatedArticles');
  return Array.isArray(articles) ? articles : [articles]; // Ensure it returns an array
};



export const getArticleBySlug = async (slug: string): Promise<IArticle | null> => {
  return await Article.findOne()
};

export const getPublishedArticleBySlug = async (slug: string): Promise<IArticle | null> => {
  return await Article.findOne({ slug, status: 'published' }).populate('author relatedArticles');
};

export const updateArticle = async (id: string, articleData: Partial<IArticle>): Promise<IArticle | null> => {
  if (articleData.content) {
    const wordsPerMinute = 200;
    const textLength = articleData.content.split(' ').length;
    articleData.readingTime = Math.ceil(textLength / wordsPerMinute);
  }

  return await Article.findByIdAndUpdate(id, articleData, { new: true }).populate('author relatedArticles');
};

export const deleteArticle = async (id: string): Promise<IArticle | null> => {
  return await Article.findByIdAndDelete(id);
};

export const addComment = async (id: string, commentData: { body: string; user: mongoose.Types.ObjectId }): Promise<IArticle | null> => {
  console.log('Article ID:', id);
  console.log('Comment Data:', commentData);

  const article = await Article.findById(id);
  console.log('Found Article:', article);

  if (!article) {
    throw new Error('Article not found');
  }

  const comment = {
    ...commentData,
    date: new Date(),
  };
  console.log('Comment:', comment);

  article.comments.push(comment as any); // Use `as any` if TypeScript complains here
  const savedArticle = await article.save();
  console.log('Saved Article:', savedArticle);

  return savedArticle;
};

export const addLike = async (id: string): Promise<IArticle | null> => {
  return await Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
};

export const likeComment = async (articleId: string, commentId: string): Promise<IArticle | null> => {
  const article = await Article.findById(articleId);
  if (!article) throw new Error('Article not found');

  const comment = article.comments.id(commentId) as unknown as mongoose.Types.Subdocument & ICommentDoc;
  if (!comment) throw new Error('Comment not found');

  comment.likes += 1;

  return await article.save();
};

export const addReply = async (articleId: string, commentId: string, replyData: { body: string; user: mongoose.Types.ObjectId }): Promise<IArticle | null> => {
  const article = await Article.findById(articleId);
  if (!article) throw new Error('Article not found');

  const comment = article.comments.id(commentId) as unknown as mongoose.Types.Subdocument & ICommentDoc;
  if (!comment) throw new Error('Comment not found');

  const reply = {
    ...replyData,
    _id: new mongoose.Types.ObjectId(),
    date: new Date(),
    likes: 0
  };

  comment.replies.push(reply);

  return await article.save();
};
