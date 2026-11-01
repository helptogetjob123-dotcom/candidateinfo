export interface CandidateFormData {
  // [01] Identity Matrix
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;

  // [02] Professional Matrix
  targetRole: string;
  targetRoleCustom: string;
  experienceLevel: string;
  skills: string;
  employmentStatus: string;
  noticePeriod: string;
  expectedCompensation: string;

  // [03] Resume Transmission & Directive
  resumeFile: File | null;
  resumeFileName: string;
  resumeFileSize: number;
  resumeBase64: string;
  resumeCloudLink: string;
  additionalNotes: string;
  consentAcknowledge: boolean;
}

export type FormErrors = Partial<Record<keyof CandidateFormData, string>>;

export interface FormSubmissionResult {
  transmissionId: string;
  timestamp: string;
  candidateName: string;
  role: string;
  email: string;
  phone: string;
  experienceLevel: string;
  resumeType: 'file' | 'link' | 'both';
  resumeName?: string;
  resumeLink?: string;
}

export type IntakeSectionId = 1 | 2 | 3;

export interface SectionMeta {
  id: IntakeSectionId;
  code: string;
  title: string;
  description: string;
  fieldCount: number;
}
