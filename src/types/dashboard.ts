
export interface BranchData {
  branch: string;
  district: string;
  region: string;
}

export interface ServiceType {
  type: string; // Updated to accept new service type format
}

export interface SatisfactionRating {
  care: number; // 1-5
  consultation: number; // 1-5
  speed: number; // 1-5
  accuracy: number; // 1-5
  equipment: number; // 1-5
  environment: number; // 1-5
  overall: number; // 1-5
}

export interface SentimentAnalysis {
  staff: number; // -1, 0, 1
  service: number; // -1, 0, 1
  technology: number; // -1, 0, 1
  products: number; // -1, 0, 1
  environment: number; // -1, 0, 1
  marketConduct: number; // -1, 0, 1
  other: number; // -1, 0, 1
}

export interface DetailedSentiment {
  staffPoliteness: number;
  staffCare: number;
  staffConsultation: number;
  staffAccuracy: number;
  staffSpeed: number;
  staffProfessionalism: number;
  staffImpression: number;
  staffSecurity: number;
  
  serviceReadiness: number;
  serviceProcess: number;
  serviceQueue: number;
  serviceDocuments: number;
  
  techCore: number;
  techQueue: number;
  techATM: number;
  techKYC: number;
  techApp: number;
  techBookUpdate: number;
  techCashCounter: number;
  
  productDetails: number;
  productConditions: number;
  productApprovalTime: number;
  productFlexibility: number;
  productSimplicity: number;
  
  envCleanliness: number;
  envSpace: number;
  envTemperature: number;
  envDesk: number;
  envWaitingArea: number;
  envLighting: number;
  envSound: number;
  envRestroom: number;
  envParking: number;
  envSignage: number;
  envOtherFacilities: number;
  
  conductNoDeception: number;
  conductNoAdvantage: number;
  conductNoForcing: number;
  conductNoDisturbance: number;
  
  otherImpression: number;
}

export interface FeedbackEntry {
  id: string;
  timestamp: string;
  date: string;
  branch: BranchData;
  serviceType: ServiceType['type'];
  satisfaction: SatisfactionRating;
  comment: string;
  sentiment: SentimentAnalysis;
  detailedSentiment: DetailedSentiment;
}

export interface KPIData {
  totalFeedback: number;
  feedbackWithComments: { count: number; percentage: number };
  severeComplaints: { count: number; percentage: number };
  contactProvided: { count: number; percentage: number };
}

export interface TimeFilter {
  value: "1day" | "1week" | "1month" | "3months" | "6months" | "1year";
  label: string;
}

export interface ChartData {
  name: string;
  value: number;
  positive?: number;
  negative?: number;
  neutral?: number;
}

export interface RegionData {
  region: string;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
}
