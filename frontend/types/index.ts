export interface Application {
  id: number;
  full_name: string;
  grade_level: string;
  gender: string;
  activities: string[];
  photo: string;
  document: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StatusSummary {
  Processing: number;
  Accepted: number;
  Rejected: number;
  Total: number;
}
