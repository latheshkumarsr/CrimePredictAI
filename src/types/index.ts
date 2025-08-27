export interface CrimeData {
  id: string;
  type: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
  };
  timestamp: Date;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Under Investigation' | 'Closed' | 'Cold Case';
  description: string;
}

export interface PredictionResult {
  crimeType: string;
  probability: number;
  confidence: number;
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
}

export interface CrimeTrend {
  month: string;
  count: number;
  type: string;
}

export interface LocationHotspot {
  location: string;
  count: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}