"use client";

import { motion } from "framer-motion";
import { Star, ThumbsUp, ThumbsDown, Heart, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoredItem } from "@/algorithms/engine";
import { toast } from "sonner";
import { useState } from "react";

interface ItemCardProps {
  item: ScoredItem;
  index: number;
}

export function ItemCard({ item, index }: ItemCardProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  const handleInteraction = async (type: string, weight: number) => {
    setIsInteracting(true);
    try {
      const res = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item._id, type, weight }),
      });

      if (!res.ok) throw new Error();
      toast.success(`Recorded ${type.toLowerCase()} interaction`);
    } catch {
      toast.error("Failed to record interaction");
    } finally {
      setIsInteracting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group">
        <div className="relative h-48 overflow-hidden bg-black/50">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <Eye className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-none shadow-xl">
              {item.matchPercentage}% Match
            </Badge>
          </div>
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary/80 backdrop-blur-md text-white border-none shadow-xl">
              {item.category}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
          <div className="flex items-center text-sm text-yellow-500">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span>{item.rating}</span>
            <span className="text-white/40 ml-2 text-xs">Pop: {item.popularityScore}</span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-sm text-white/60 line-clamp-3 mb-4">{item.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] py-0 border-white/20 text-white/70">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] py-0 border-white/20 text-white/70">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex justify-between gap-2 border-t border-white/5 mt-4 pt-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-red-500/20 hover:text-red-400 text-white/50 transition-colors"
            onClick={() => handleInteraction("DISLIKE", -1)}
            disabled={isInteracting}
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-blue-500/20 hover:text-blue-400 text-white/50 transition-colors"
            onClick={() => handleInteraction("VIEW", 0.5)}
            disabled={isInteracting}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-green-500/20 hover:text-green-400 text-white/50 transition-colors"
            onClick={() => handleInteraction("LIKE", 2)}
            disabled={isInteracting}
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-pink-500/20 hover:text-pink-400 text-white/50 transition-colors"
            onClick={() => handleInteraction("FAVORITE", 3)}
            disabled={isInteracting}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
