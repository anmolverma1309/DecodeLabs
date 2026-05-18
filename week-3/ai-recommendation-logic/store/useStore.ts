import { create } from 'zustand';
import { ScoredItem } from '@/algorithms/engine';

interface AppState {
  preferences: string[];
  setPreferences: (prefs: string[]) => void;
  recommendations: ScoredItem[];
  setRecommendations: (items: ScoredItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  preferences: [],
  setPreferences: (prefs) => set({ preferences: prefs }),
  recommendations: [],
  setRecommendations: (items) => set({ recommendations: items }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
