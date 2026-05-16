import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  type: 'VIEW' | 'LIKE' | 'DISLIKE' | 'FAVORITE';
  weight: number;
  timestamp: Date;
}

const InteractionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    type: { type: String, enum: ['VIEW', 'LIKE', 'DISLIKE', 'FAVORITE'], required: true },
    weight: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  }
);

// Indexing for faster lookups
InteractionSchema.index({ userId: 1, itemId: 1 });

export const Interaction: Model<IInteraction> = mongoose.models.Interaction || mongoose.model<IInteraction>('Interaction', InteractionSchema);
