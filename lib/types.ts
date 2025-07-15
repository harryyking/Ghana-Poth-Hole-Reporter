// types/index.ts

// Define the GeoJSON Point structure for MongoDB
export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// Define the properties of a Report document
export interface IReport {
  [x: string]: any;
  category: 'Pothole' | 'Rubbish' | 'Streetlight' | 'Water Leak' | 'Safety' | 'Other';
  description: string;
  location: ILocation;
  photo_url?: string; // Optional
  status: 'Submitted' | 'Verified' | 'In Progress' | 'Resolved' | 'Rejected';
  submitted_by?: string; // Optional
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  verification_score: number;
  moderated_by?: string; // Optional
  moderation_notes?: string; // Optional
  resolved_date?: Date; // Optional
  createdAt: Date; // Added by Mongoose timestamps
  updatedAt: Date; // Added by Mongoose timestamps
}

// Type for the data received when creating a report (frontend to backend)
export interface CreateReportDTO {
  category: IReport['category'];
  description: string;
  latitude: number; // For frontend input, converted to GeoJSON on backend
  longitude: number; // For frontend input
  photo_url?: string;
  submitted_by?: string;
}

// Type for the data returned when fetching reports from backend
export interface FetchReportsResponse {
  success: boolean;
  data: IReport[];
  message?: string;
}

// Type for the data returned when creating a report from backend
export interface CreateReportResponse {
  success: boolean;
  data: IReport;
  message?: string;
}

// Type for the data sent when voting
export interface VoteRequestDTO {
  voteType: 'up' | 'down';
}

// Type for the data returned after voting
export interface VoteResponse {
  success: boolean;
  data: IReport;
  message?: string;
}

// Type for map coordinates
export interface LngLat {
  lng: number;
  lat: number;
}