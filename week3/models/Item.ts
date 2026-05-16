import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItem extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  popularityScore: number;
  difficultyLevel?: string;
  metadata?: any;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
    difficultyLevel: { type: String },
    metadata: { type: Schema.Types.Mixed },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
