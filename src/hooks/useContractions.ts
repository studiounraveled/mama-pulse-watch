import { useState, useEffect } from 'react';
import { Contraction, ContractionSummary } from '@/types/contraction';
import { useLocalStorage } from './useLocalStorage';

export function useContractions() {
  const [storedContractions, setStoredContractions] = useLocalStorage<Contraction[]>('contractions', []);
  
  // Convert date strings back to Date objects when loading from localStorage
  const contractions = storedContractions.map(contraction => ({
    ...contraction,
    startTime: new Date(contraction.startTime),
    endTime: contraction.endTime ? new Date(contraction.endTime) : null,
  }));

  const setContractions = (value: Contraction[] | ((prev: Contraction[]) => Contraction[])) => {
    setStoredContractions(value);
  };
  const [currentContraction, setCurrentContraction] = useState<Contraction | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const startContraction = () => {
    const newContraction: Contraction = {
      id: crypto.randomUUID(),
      startTime: new Date(),
      endTime: null,
      duration: null,
    };
    setCurrentContraction(newContraction);
    setIsTracking(true);
  };

  const stopContraction = () => {
    if (currentContraction) {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - currentContraction.startTime.getTime()) / 1000);
      
      const completedContraction: Contraction = {
        ...currentContraction,
        endTime,
        duration,
      };

      setContractions(prev => [completedContraction, ...prev]);
      setCurrentContraction(null);
      setIsTracking(false);
    }
  };

  const deleteContraction = (id: string) => {
    setContractions(prev => prev.filter(c => c.id !== id));
  };

  const editContraction = (id: string, updatedData: { startTime: Date; endTime: Date | null }) => {
    setContractions(prev => prev.map(contraction => {
      if (contraction.id === id) {
        const duration = updatedData.endTime 
          ? Math.round((updatedData.endTime.getTime() - updatedData.startTime.getTime()) / 1000)
          : null;
        
        return {
          ...contraction,
          startTime: updatedData.startTime,
          endTime: updatedData.endTime,
          duration,
        };
      }
      return contraction;
    }));
  };

  const addManualContraction = (startTime: Date, endTime: Date | null) => {
    const duration = endTime 
      ? Math.round((endTime.getTime() - startTime.getTime()) / 1000)
      : null;
    
    const newContraction: Contraction = {
      id: crypto.randomUUID(),
      startTime,
      endTime,
      duration,
    };

    setContractions(prev => [newContraction, ...prev].sort((a, b) => 
      b.startTime.getTime() - a.startTime.getTime()
    ));
  };

  const clearAllContractions = () => {
    setContractions([]);
    setCurrentContraction(null);
    setIsTracking(false);
  };

  const getSummary = (): ContractionSummary => {
    const completedContractions = contractions.filter(c => c.duration !== null);
    
    if (completedContractions.length === 0) {
      return {
        totalContractions: 0,
        averageDuration: 0,
        averageInterval: 0,
        lastContraction: null,
      };
    }

    const totalDuration = completedContractions.reduce((sum, c) => sum + (c.duration || 0), 0);
    const averageDuration = totalDuration / completedContractions.length;

    let averageInterval = 0;
    if (completedContractions.length > 1) {
      const intervals: number[] = [];
      for (let i = 0; i < completedContractions.length - 1; i++) {
        const current = completedContractions[i];
        const next = completedContractions[i + 1];
        const interval = (current.startTime.getTime() - next.startTime.getTime()) / 1000;
        intervals.push(interval);
      }
      averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    }

    return {
      totalContractions: completedContractions.length,
      averageDuration,
      averageInterval,
      lastContraction: completedContractions[0] || null,
    };
  };

  return {
    contractions,
    currentContraction,
    isTracking,
    startContraction,
    stopContraction,
    deleteContraction,
    editContraction,
    addManualContraction,
    clearAllContractions,
    getSummary,
  };
}