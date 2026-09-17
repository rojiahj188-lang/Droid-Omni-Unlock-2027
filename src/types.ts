export type UnlockCategory = 
  | 'carrier_sim' 
  | 'imei_beacukai' 
  | 'ios_recovery_dfu' 
  | 'android_frp_screen' 
  | 'ai_assistant';

export interface DeviceInfo {
  id: string;
  brand: 'Apple' | 'Samsung' | 'Google' | 'Xiaomi' | 'Other';
  model: string;
  osType: 'iOS' | 'Android';
  osVersion: string;
  regionCode: string;
  regionCountry: string;
  imei1: string;
  imei2?: string;
  serialNumber: string;
  carrierLock: boolean;
  carrierName: string;
  imeiStatus: 'Clean' | 'Blocked_Kemenperin' | 'Blacklist' | 'Unregistered';
  activationLock: boolean;
  screenLocked: boolean;
  batteryHealth?: number;
}

export interface CarrierInfo {
  id: string;
  name: string;
  country: string;
  regionCode: string;
  officialPortal: string;
  freePolicy: string;
  turnaroundTime: string;
  requirements: string[];
  contactEmail?: string;
}

export interface TaxCalculationResult {
  priceUsd: number;
  exemptionUsd: number;
  taxableUsd: number;
  exchangeRate: number;
  taxableIdr: number;
  beaMasuk: number;
  ppn: number;
  pphRatePercent: number;
  pph: number;
  totalTax: number;
  formattedTotal: string;
  isExempt: boolean;
}

export interface DiagnosticResult {
  problemTitle: string;
  riskLevel: string;
  summary: string;
  carrierAnalysis?: string;
  imeiAnalysis?: string;
  actionSteps: Array<{
    step: number;
    title: string;
    desc: string;
  }>;
  technicalCommands?: string[];
  securityNotes: string[];
}
