"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Sparkles, RefreshCw } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { ItemCard } from "@/components/dashboard/item-card";
import { ScoredItem } from "@/algorithms/engine";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { recommendations, setRecommendations, isLoading, setIsLoading } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/recommendations?limit=12");
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [status]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRecommendations();
  };

  if (status === "loading" || (isLoading && recommendations.length === 0)) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48 bg-white/10" />
            <Skeleton className="h-10 w-32 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-xl bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="text-primary w-8 h-8" />
              For You, <span className="text-white/60 font-light">{session?.user?.name}</span>
            </h1>
            <p className="text-white/50 mt-1">Personalized recommendations based on your unique taste.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-white/10 hover:bg-white/5"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button 
              variant="ghost" 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <main>
          {recommendations.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {recommendations.map((item: ScoredItem, index: number) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-2">No recommendations yet</h2>
              <p className="text-white/60 mb-6">Let's set up your preferences to get started.</p>
              <Button onClick={() => router.push("/onboarding")}>
                Setup Preferences
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
