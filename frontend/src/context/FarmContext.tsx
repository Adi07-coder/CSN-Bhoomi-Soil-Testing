import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { farmsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Farm } from '../types';

interface FarmContextType {
  farms: Farm[];
  isLoadingFarms: boolean;
  selectedFarmId: string | null;
  selectedFarm: Farm | null;
  setSelectedFarmId: (id: string | null) => void;
  refetchFarms: () => void;
  lastSoilAnalysis: any | null;
  setLastSoilAnalysis: (analysis: any | null) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

const STORAGE_ACTIVE_FARM_KEY = 'aibhoomi_active_farm_id';
const STORAGE_LAST_ANALYSIS_KEY = 'aibhoomi_last_soil_analysis';

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  const { data: farmsData, isLoading: isLoadingFarms, refetch: refetchFarms } = useQuery({
    queryKey: ['farms'],
    queryFn: () => farmsApi.list().then(r => r.data),
    enabled: isAuthenticated,
  });

  const farms: Farm[] = Array.isArray(farmsData) 
    ? farmsData 
    : (farmsData?.items || farmsData?.data || []);

  const [selectedFarmId, setSelectedFarmIdState] = useState<string | null>(() => {
    // 1. Check URL search params if in browser
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlFarmId = params.get('farmId');
      if (urlFarmId) return urlFarmId;
      try {
        const saved = localStorage.getItem(STORAGE_ACTIVE_FARM_KEY);
        if (saved) return saved;
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [lastSoilAnalysis, setLastSoilAnalysisState] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_LAST_ANALYSIS_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return null;
  });

  // Keep selectedFarmId valid against loaded farms
  useEffect(() => {
    if (farms.length > 0) {
      if (!selectedFarmId || !farms.some(f => f.id === selectedFarmId)) {
        // Default to first farm if none or invalid
        setSelectedFarmIdState(farms[0].id);
        try {
          localStorage.setItem(STORAGE_ACTIVE_FARM_KEY, farms[0].id);
        } catch {
          // ignore
        }
      }
    }
  }, [farms, selectedFarmId]);

  const setSelectedFarmId = useCallback((id: string | null) => {
    setSelectedFarmIdState(id);
    if (typeof window !== 'undefined') {
      try {
        if (id) {
          localStorage.setItem(STORAGE_ACTIVE_FARM_KEY, id);
        } else {
          localStorage.removeItem(STORAGE_ACTIVE_FARM_KEY);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const setLastSoilAnalysis = useCallback((analysis: any | null) => {
    setLastSoilAnalysisState(analysis);
    if (typeof window !== 'undefined') {
      try {
        if (analysis) {
          localStorage.setItem(STORAGE_LAST_ANALYSIS_KEY, JSON.stringify(analysis));
        } else {
          localStorage.removeItem(STORAGE_LAST_ANALYSIS_KEY);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const selectedFarm = farms.find(f => f.id === selectedFarmId) || null;

  return (
    <FarmContext.Provider
      value={{
        farms,
        isLoadingFarms,
        selectedFarmId,
        selectedFarm,
        setSelectedFarmId,
        refetchFarms,
        lastSoilAnalysis,
        setLastSoilAnalysis,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useActiveFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useActiveFarm must be used within a FarmProvider');
  }
  return context;
}
