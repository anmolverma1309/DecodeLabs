"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";

const AVAILABLE_TAGS = [
  "Action", "Sci-Fi", "Drama", "Comedy", "Thriller", 
  "Programming", "Web Development", "Data Science", 
  "Machine Learning", "Design", "Business", "Classic"
];

export default function OnboardingPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setPreferences } = useStore();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (selectedTags.length < 3) {
      toast.error("Please select at least 3 categories");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: selectedTags }),
      });

      if (!res.ok) throw new Error("Failed to save preferences");

      setPreferences(selectedTags);
      toast.success("Preferences saved!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred while saving preferences");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-black/90">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Welcome to NextRecs
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-white/60">
              Select at least 3 topics you're interested in to help us personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={tag}>
                    <Badge
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                        isSelected 
                          ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,255,255,0.3)] border-transparent" 
                          : "hover:border-primary/50 text-white/70"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-8 pb-8">
            <Button 
              size="lg" 
              onClick={handleSave} 
              disabled={isSubmitting || selectedTags.length < 3}
              className="w-full max-w-sm rounded-full font-semibold tracking-wide"
            >
              {isSubmitting ? "Personalizing..." : `Continue (${selectedTags.length} selected)`}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
