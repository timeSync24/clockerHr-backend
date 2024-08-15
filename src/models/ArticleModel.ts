// src/models/ArticleModel.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the possible categories as an enum
const categories = ['Technology', 'Health', 'Finance', 'Education', 'Lifestyle'] as const;

export interface IReplyDoc {
  _id: Types.ObjectId;
  body: string;
  date: Date;
  user: Types.ObjectId | {
    _id: string;
    firstName: string;
    lastName: string;
  };
  likes: number;
}

export interface ICommentDoc {
  _id: Types.ObjectId;
  body: string;
  date: Date;
  user: Types.ObjectId | {
    _id: string;
    firstName: string;
    lastName: string;
  };
  likes: number;
  replies: IReplyDoc[];
}

export interface IArticle extends Document {
  title: string;
  description: string;
  content: string;
  slug: string;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  author: Types.ObjectId;
  tags: string[];
  likes: number;
  comments: Types.DocumentArray<ICommentDoc>;
  category: typeof categories[number];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  featuredImage: string;
  readingTime: number;
  relatedArticles: Types.ObjectId[];
  publishedAt?: Date;
  draftedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReplySchema = new Schema<IReplyDoc>({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number, default: 0 },
});

const CommentSchema = new Schema<ICommentDoc>({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number, default: 0 },
  replies: [ReplySchema],
});

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    images: [{ type: String, required: false }],
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String, required: false }],
    likes: { type: Number, default: 0 },
    comments: [CommentSchema],
    category: { type: String, enum: categories, required: true },
    metaTitle: { type: String, required: false },
    metaDescription: { type: String, required: false },
    keywords: [{ type: String, required: false }],
    featuredImage: { type: String, required: false },
    readingTime: { type: Number, required: false },
    relatedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    publishedAt: { type: Date, required: false },
    draftedAt: { type: Date, required: false },
  },
  { timestamps: true }
);

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);
