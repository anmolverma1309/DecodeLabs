import dbConnect from '@/lib/db';
import { Item, IItem } from '@/models/Item';
import { Interaction } from '@/models/Interaction';
import { User } from '@/models/User';
import { jaccardSimilarity } from './similarity';

export interface ScoredItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  popularityScore: number;
  difficultyLevel?: string;
  metadata?: any;
  imageUrl?: string;
  score: number;
  matchPercentage: number;
}

const INTERACTION_WEIGHTS = {
  VIEW: 0.5,
  LIKE: 2.0,
  FAVORITE: 3.0,
  DISLIKE: -1.0,
};

export async function getRecommendations(userId: string, limit = 10): Promise<ScoredItem[]> {
  await dbConnect();

  // 1. Fetch user and their interactions
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const interactions = await Interaction.find({ userId });
  const interactedItemIds = new Set(interactions.map(i => i.itemId.toString()));

  // Calculate dynamic tag weights from interactions
  const tagWeights: Record<string, number> = {};
  
  // Base weights from explicit user preferences
  user.preferences.forEach(tag => {
    tagWeights[tag] = 2.0; // High base weight for explicit preferences
  });

  // Fetch items user has interacted with to adjust tag weights
  const interactedItems = await Item.find({ _id: { $in: Array.from(interactedItemIds) } });
  
  interactions.forEach(interaction => {
    const item = interactedItems.find(i => i._id.toString() === interaction.itemId.toString());
    if (item) {
      const weightMultiplier = INTERACTION_WEIGHTS[interaction.type] || 0;
      item.tags.forEach(tag => {
        tagWeights[tag] = (tagWeights[tag] || 0) + weightMultiplier;
      });
    }
  });

  // Extract the top positively weighted tags as the "effective profile"
  const effectiveUserTags = new Set(
    Object.entries(tagWeights)
      .filter(([_, weight]) => weight > 0)
      .map(([tag]) => tag)
  );

  // 2. Fetch candidate items (items user hasn't interacted with negatively)
  // For simplicity, let's fetch all items not disliked
  const dislikedItemIds = interactions
    .filter(i => i.type === 'DISLIKE')
    .map(i => i.itemId.toString());

  const candidateItems = await Item.find({
    _id: { $nin: dislikedItemIds }
  });

  // 3. Score candidates
  const scoredItems: ScoredItem[] = candidateItems.map(item => {
    const itemTags = new Set(item.tags);
    
    // Content-Based Similarity (Jaccard)
    const similarityScore = jaccardSimilarity(effectiveUserTags, itemTags);
    
    // Popularity Boost (normalize to 0-1)
    const popularityBoost = (item.popularityScore || 0) / 100 * 0.2; // 20% weight max
    
    // Rating Boost
    const ratingBoost = (item.rating || 0) / 10 * 0.2; // 20% weight max
    
    // Calculate final score
    let finalScore = similarityScore + popularityBoost + ratingBoost;
    
    // Penalize if already viewed (to encourage discovery)
    if (interactedItemIds.has(item._id.toString())) {
      finalScore *= 0.5;
    }

    const obj = item.toObject();
    return {
      ...obj,
      _id: obj._id.toString(),
      score: finalScore,
      matchPercentage: Math.min(Math.round(similarityScore * 100 + popularityBoost * 50 + ratingBoost * 50), 99),
    } as ScoredItem;
  });

  // 4. Sort and return
  scoredItems.sort((a, b) => b.score - a.score);
  
  return scoredItems.slice(0, limit);
}
