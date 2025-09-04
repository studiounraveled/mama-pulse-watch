export interface Contraction {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null; // in seconds
}

export interface ContractionSummary {
  totalContractions: number;
  averageDuration: number;
  averageInterval: number;
  lastContraction: Contraction | null;
}