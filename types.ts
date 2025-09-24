
export enum Page {
  XRay = 'XRay',
  OCR = 'OCR',
  Risk = 'Risk',
}

export interface XRayResult {
  diagnosis: 'Normal' | 'Tuberculosis Suspected' | 'Pneumonia Suspected' | 'Indeterminate';
  confidence: number;
  findings: string[];
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
}

export interface Prescription {
  patientName: string;
  date: string;
  items: PrescriptionItem[];
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface RiskScoreResult {
  score: number;
  level: RiskLevel;
  explanation: string;
  riskFactors: string[];
}
