export interface CandidateFormData {
  fullName: string;    // Name: (entry.2053108223)
  email: string;       // E-mail (entry.2062762285)
  instagramId: string; // insta ID (entry.949398628)
}

export type FormErrors = Partial<Record<keyof CandidateFormData, string>>;

export interface FormSubmissionResult {
  transmissionId: string;
  timestamp: string;
  fullName: string;
  email: string;
  instagramId: string;
}
