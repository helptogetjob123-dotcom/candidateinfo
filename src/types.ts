export interface CandidateFormData {
  fullName: string;           // Name:
  email: string;              // E-mail
  instagramId: string;        // insta ID
  state: string;              // State
  experience: string;         // Experience ('Fresher' | 'Experienced')
  yearsOfExperience: string;  // If Experienced Mention the Years of experience
  preferredLocation: string;  // Preffered Location ('Pune' | 'Manglore' | 'Banglore' | 'Mumbai' | 'ANY')
  sector: string;             // Sector ('IT' | 'non-IT')
  preferredJobRole: string;   // Preffered Job Role
  
  // Updated Resume
  resumeFile: File | null;
  resumeFileName: string;
  resumeFileSize: number;
  resumeBase64: string;
  resumeCloudLink: string;

  // Cover letter
  coverLetterFile: File | null;
  coverLetterFileName: string;
  coverLetterBase64: string;
  coverLetterText: string;
}

export type FormErrors = Partial<Record<keyof CandidateFormData, string>>;

export interface FormSubmissionResult {
  transmissionId: string;
  timestamp: string;
  fullName: string;
  email: string;
  instagramId: string;
  state: string;
  experience: string;
  yearsOfExperience?: string;
  preferredLocation: string;
  sector: string;
  preferredJobRole: string;
  resumeName: string;
  coverLetterName?: string;
}
