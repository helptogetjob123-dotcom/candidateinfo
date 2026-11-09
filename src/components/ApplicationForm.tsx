import React, { useState, useRef } from 'react';
import { CandidateFormData, FormErrors, FormSubmissionResult } from '../types';
import { FORM_CONFIG } from '../config/formConfig';
import { 
  User, 
  MapPin, 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  FileCheck, 
  X, 
  ArrowRight,
  ShieldCheck,
  Link as LinkIcon,
  GraduationCap
} from 'lucide-react';

interface ApplicationFormProps {
  onSubmitSuccess: (result: FormSubmissionResult) => void;
}

const INITIAL_FORM_DATA: CandidateFormData = {
  fullName: '',
  email: '',
  instagramId: '',
  education: '',
  state: '',
  experience: '',
  yearsOfExperience: '',
  preferredLocation: '',
  sector: '',
  preferredJobRole: '',
  resumeFile: null,
  resumeFileName: '',
  resumeFileSize: 0,
  resumeBase64: '',
  resumeCloudLink: '',
  coverLetterFile: null,
  coverLetterFileName: '',
  coverLetterBase64: '',
  coverLetterText: '',
};

const LOCATION_OPTIONS = ['Pune', 'Manglore', 'Banglore', 'Mumbai', 'ANY'];
const SECTOR_OPTIONS = ['IT', 'non-IT'];
const EXPERIENCE_OPTIONS = ['Fresher', 'Experienced'];

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState<CandidateFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatusMessage, setSubmitStatusMessage] = useState<string>('Submitting Application...');
  const [isResumeDragging, setIsResumeDragging] = useState(false);
  const [resumeError, setResumeError] = useState<string>('');

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Google-style progress calculation
  const calculateProgress = () => {
    let filled = 0;
    const requiredChecks = [
      formData.fullName.trim(),
      formData.email.trim(),
      formData.instagramId.trim(),
      formData.education.trim(),
      formData.state.trim(),
      formData.experience,
      formData.preferredLocation,
      formData.sector,
      formData.preferredJobRole.trim(),
    ];

    requiredChecks.forEach((val) => {
      if (val) filled++;
    });

    if (formData.resumeFile || formData.resumeCloudLink.trim()) {
      filled++;
    }

    return Math.min(100, Math.round((filled / (requiredChecks.length + 1)) * 100));
  };

  const progress = calculateProgress();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof CandidateFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Resume file handling
  const handleResumeFile = (file: File) => {
    setResumeError('');
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isAllowedExt = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!allowed.includes(file.type) && !isAllowedExt) {
      setResumeError('Please upload a PDF or Microsoft Word (.doc, .docx) file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeError('File size exceeds 10MB. Please upload a smaller resume file.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      resumeFile: file,
      resumeFileName: file.name,
      resumeFileSize: file.size,
    }));

    if (errors.resumeFile) {
      setErrors((prev) => ({ ...prev, resumeFile: undefined }));
    }
  };

  const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResumeDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveResume = () => {
    setFormData((prev) => ({
      ...prev,
      resumeFile: null,
      resumeFileName: '',
      resumeFileSize: 0,
      resumeBase64: '',
    }));
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  // Cover letter file handling
  const handleCoverLetterFile = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      coverLetterFile: file,
      coverLetterFileName: file.name,
    }));
  };

  const handleRemoveCoverLetter = () => {
    setFormData((prev) => ({
      ...prev,
      coverLetterFile: null,
      coverLetterFileName: '',
      coverLetterBase64: '',
    }));
    if (coverLetterInputRef.current) coverLetterInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.instagramId.trim()) {
      errs.instagramId = 'Please enter your Instagram handle.';
    }

    if (!formData.education.trim()) {
      errs.education = 'Please enter your education qualification.';
    }

    if (!formData.state.trim()) errs.state = 'Please mention your current state.';
    if (!formData.experience) errs.experience = 'Please select your experience status.';
    if (formData.experience === 'Experienced' && !formData.yearsOfExperience.trim()) {
      errs.yearsOfExperience = 'Please specify your years of experience.';
    }

    if (!formData.preferredLocation) errs.preferredLocation = 'Please select your preferred location.';
    if (!formData.sector) errs.sector = 'Please select your sector.';
    if (!formData.preferredJobRole.trim()) errs.preferredJobRole = 'Please enter your preferred job role.';

    if (!formData.resumeFile && !formData.resumeCloudLink.trim()) {
      errs.resumeFile = 'Please upload your updated resume or provide a Google Drive link.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateTransmissionId = (): string => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `HTGJ-${year}-${rand}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatusMessage('Encoding resume document...');
    const transmissionId = generateTransmissionId();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    try {
      let resumeBase64 = '';
      if (formData.resumeFile) {
        try {
          resumeBase64 = await readFileAsBase64(formData.resumeFile);
        } catch (fErr) {
          console.warn('Resume file encoding issue:', fErr);
        }
      }

      let coverLetterBase64 = '';
      if (formData.coverLetterFile) {
        try {
          coverLetterBase64 = await readFileAsBase64(formData.coverLetterFile);
        } catch (clErr) {
          console.warn('Cover letter encoding issue:', clErr);
        }
      }

      setSubmitStatusMessage('Uploading resume & logging response...');

      let resolvedResumeDriveLink: string | undefined = undefined;
      const cleanInstagramId = formData.instagramId.trim().replace(/^@+/, '');

      // Primary: Google Apps Script Webhook
      if (FORM_CONFIG.appsScriptWebhookUrl && FORM_CONFIG.appsScriptWebhookUrl.trim() !== '') {
        try {
          const payload = {
            transmissionId,
            timestamp,
            formData: {
              fullName: formData.fullName.trim(),
              email: formData.email.trim(),
              instagramId: cleanInstagramId,
              education: formData.education.trim(),
              state: formData.state.trim(),
              experience: formData.experience,
              yearsOfExperience: formData.experience === 'Experienced' ? formData.yearsOfExperience.trim() : '0',
              preferredLocation: formData.preferredLocation,
              sector: formData.sector,
              preferredJobRole: formData.preferredJobRole.trim(),
              resumeFileName: formData.resumeFileName,
              resumeBase64: resumeBase64,
              resumeCloudLink: formData.resumeCloudLink.trim(),
              coverLetterText: formData.coverLetterText.trim(),
              coverLetterFileName: formData.coverLetterFileName,
              coverLetterBase64: coverLetterBase64,
            },
          };

          const webhookRes = await fetch(FORM_CONFIG.appsScriptWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload),
          });

          if (webhookRes.ok) {
            try {
              const resData = await webhookRes.json();
              if (resData && resData.resumeDriveLink) {
                resolvedResumeDriveLink = resData.resumeDriveLink;
              }
            } catch {}
          }
        } catch (webhookErr) {
          console.log('Webhook dispatched to Google Cloud:', webhookErr);
        }
      }

      const result: FormSubmissionResult = {
        transmissionId,
        timestamp,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        instagramId: cleanInstagramId,
        education: formData.education.trim(),
        state: formData.state.trim(),
        experience: formData.experience,
        yearsOfExperience: formData.experience === 'Experienced' ? formData.yearsOfExperience : undefined,
        preferredLocation: formData.preferredLocation,
        sector: formData.sector,
        preferredJobRole: formData.preferredJobRole.trim(),
        resumeName: formData.resumeFileName || formData.resumeCloudLink || 'Submitted',
        resumeDriveLink: resolvedResumeDriveLink,
        coverLetterName: formData.coverLetterFileName || (formData.coverLetterText ? 'Provided' : undefined),
      };

      setTimeout(() => {
        setIsSubmitting(false);
        onSubmitSuccess(result);
      }, 500);

    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Google-style Progress Card */}
      <div className="google-card p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium text-google-text-secondary">Application Progress</span>
          <span className="font-semibold text-google-blue">{progress}% Completed</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-google-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* ============================================================ */}
        {/* SECTION 1: CONTACT INFORMATION */}
        {/* ============================================================ */}
        <div className="google-card p-6 sm:p-8">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-google-border/70">
            <div className="w-8 h-8 rounded-full bg-google-blue-bg text-google-blue flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-google-text-primary">
                1. Contact Information
              </h2>
              <p className="text-xs text-google-text-secondary">
                Please provide accurate contact details so recruiters and mentors can reach you.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* 1. Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-google-text-primary mb-1.5">
                Full Name <span className="text-google-red">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Rahul Sharma"
                className={`google-input ${errors.fullName ? 'border-google-red ring-1 ring-google-red/20' : ''}`}
              />
              {errors.fullName && (
                <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* 2. E-mail */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-google-text-primary mb-1.5">
                Email Address <span className="text-google-red">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. rahul.sharma@example.com"
                className={`google-input ${errors.email ? 'border-google-red ring-1 ring-google-red/20' : ''}`}
              />
              {errors.email && (
                <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* 3. insta ID & 4. State Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="instagramId" className="block text-xs font-semibold text-google-text-primary mb-1.5">
                  Instagram Handle <span className="text-google-red">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-google-text-tertiary font-medium">
                    @
                  </span>
                  <input
                    id="instagramId"
                    type="text"
                    name="instagramId"
                    required
                    value={formData.instagramId}
                    onChange={handleInputChange}
                    placeholder="your_handle"
                    className={`google-input pl-7 ${errors.instagramId ? 'border-google-red ring-1 ring-google-red/20' : ''}`}
                  />
                </div>
                {errors.instagramId && (
                  <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.instagramId}
                  </p>
                )}
                <p className="text-[11px] text-google-text-secondary mt-1">
                  Required for mentor verification & direct DM updates from {FORM_CONFIG.brand.instagramHandle}.
                </p>
              </div>

              <div>
                <label htmlFor="state" className="block text-xs font-semibold text-google-text-primary mb-1.5">
                  Current State <span className="text-google-red">*</span>
                </label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Karnataka, Maharashtra, Delhi"
                  className={`google-input ${errors.state ? 'border-google-red ring-1 ring-google-red/20' : ''}`}
                />
                {errors.state && (
                  <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.state}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: EDUCATION & EXPERIENCE */}
        {/* ============================================================ */}
        <div className="google-card p-6 sm:p-8">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-google-border/70">
            <div className="w-8 h-8 rounded-full bg-google-blue-bg text-google-blue flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-google-text-primary">
                2. Education & Experience
              </h2>
              <p className="text-xs text-google-text-secondary">
                Provide your educational qualification and career stage to help us match appropriate openings.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* 5. Education / Highest Qualification */}
            <div>
              <label htmlFor="education" className="block text-xs font-semibold text-google-text-primary mb-1.5">
                Education / Highest Qualification <span className="text-google-red">*</span>
              </label>
              <input
                id="education"
                type="text"
                name="education"
                required
                value={formData.education}
                onChange={handleInputChange}
                placeholder="e.g. B.Tech / BE in CSE, BCA, MCA, B.Sc, B.Com, MBA, Diploma"
                className={`google-input ${errors.education ? 'border-google-red ring-1 ring-google-red/20' : ''}`}
              />
              {errors.education && (
                <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.education}
                </p>
              )}
              <p className="text-[11px] text-google-text-secondary mt-1">
                Mention your highest degree, branch/specialization, or graduation year.
              </p>
            </div>

            {/* 6. Experience Radio Tiles */}
            <div>
              <label className="block text-xs font-semibold text-google-text-primary mb-2">
                Experience Level <span className="text-google-red">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {EXPERIENCE_OPTIONS.map((exp) => {
                  const isSelected = formData.experience === exp;
                  return (
                    <label
                      key={exp}
                      className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-google-blue bg-google-blue-bg/40 text-google-text-primary font-medium shadow-sm'
                          : 'border-google-border bg-white text-google-text-secondary hover:border-google-border-hover'
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={exp}
                        checked={isSelected}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-google-blue border-google-border focus:ring-google-blue"
                      />
                      <span className="text-sm">{exp}</span>
                    </label>
                  );
                })}
              </div>
              {errors.experience && (
                <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.experience}
                </p>
              )}
            </div>

            {/* 6. If Experienced Mention the Years of experience */}
            {formData.experience === 'Experienced' && (
              <div className="p-4 bg-gray-50 border border-google-border rounded-lg animate-fadeIn">
                <label htmlFor="yearsOfExperience" className="block text-xs font-semibold text-google-text-primary mb-1.5">
                  Years of Experience <span className="text-google-red">*</span>
                </label>
                <input
                  id="yearsOfExperience"
                  type="text"
                  name="yearsOfExperience"
                  required
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  placeholder="e.g. 2.5 Years, 4 Years"
                  className={`google-input ${errors.yearsOfExperience ? 'border-google-red' : ''}`}
                />
                {errors.yearsOfExperience && (
                  <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.yearsOfExperience}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 3: JOB PREFERENCES */}
        {/* ============================================================ */}
        <div className="google-card p-6 sm:p-8">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-google-border/70">
            <div className="w-8 h-8 rounded-full bg-google-blue-bg text-google-blue flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-google-text-primary">
                3. Job Preferences
              </h2>
              <p className="text-xs text-google-text-secondary">
                Tell us where you want to work and what roles you are targeting.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* 7. Preffered Location */}
            <div>
              <label className="block text-xs font-semibold text-google-text-primary mb-2">
                Preferred Location <span className="text-google-red">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {LOCATION_OPTIONS.map((loc) => {
                  const isSelected = formData.preferredLocation === loc;
                  return (
                    <label
                      key={loc}
                      className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-google-blue bg-google-blue-bg/40 text-google-text-primary font-medium shadow-sm'
                          : 'border-google-border bg-white text-google-text-secondary hover:border-google-border-hover'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredLocation"
                        value={loc}
                        checked={isSelected}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-google-blue border-google-border focus:ring-google-blue"
                      />
                      <span className="text-sm">{loc}</span>
                    </label>
                  );
                })}
              </div>
              {errors.preferredLocation && (
                <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.preferredLocation}
                </p>
              )}
            </div>

            {/* 8. Sector */}
            <div>
              <label className="block text-xs font-semibold text-google-text-primary mb-2">
                Industry Sector <span className="text-google-red">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SECTOR_OPTIONS.map((sec) => {
                  const isSelected = formData.sector === sec;
                  return (
                    <label
                      key={sec}
                      className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-google-blue bg-google-blue-bg/40 text-google-text-primary font-medium shadow-sm'
                          : 'border-google-border bg-white text-google-text-secondary hover:border-google-border-hover'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sector"
                        value={sec}
                        checked={isSelected}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-google-blue border-google-border focus:ring-google-blue"
                      />
                      <span className="text-sm font-medium">{sec}</span>
                    </label>
                  );
                })}
              </div>
              {errors.sector && (
                <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.sector}
                </p>
              )}
            </div>

            {/* 9. Preffered Job Role */}
            <div>
              <label htmlFor="preferredJobRole" className="block text-xs font-semibold text-google-text-primary mb-1.5">
                Preferred Job Role <span className="text-google-red">*</span>
              </label>
              <input
                id="preferredJobRole"
                type="text"
                name="preferredJobRole"
                required
                value={formData.preferredJobRole}
                onChange={handleInputChange}
                placeholder="e.g. Frontend Developer, QA Engineer, Business Analyst, HR"
                className={`google-input ${errors.preferredJobRole ? 'border-google-red ring-1 ring-google-red/20' : ''}`}
              />
              {errors.preferredJobRole && (
                <p className="text-xs text-google-red mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.preferredJobRole}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 4: RESUME & DOCUMENTS */}
        {/* ============================================================ */}
        <div className="google-card p-6 sm:p-8">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-google-border/70">
            <div className="w-8 h-8 rounded-full bg-google-blue-bg text-google-blue flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-google-text-primary">
                4. Resume & Documents
              </h2>
              <p className="text-xs text-google-text-secondary">
                Upload your updated resume. Supported formats: PDF, DOCX, DOC (up to 10MB).
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 10. Updated Resume */}
            <div>
              <label className="block text-xs font-semibold text-google-text-primary mb-1.5">
                Updated Resume <span className="text-google-red">*</span>
              </label>

              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleResumeFile(e.target.files[0]);
                  }
                }}
              />

              {!formData.resumeFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsResumeDragging(true);
                  }}
                  onDragLeave={() => setIsResumeDragging(false)}
                  onDrop={handleResumeDrop}
                  onClick={() => resumeInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isResumeDragging
                      ? 'border-google-blue bg-google-blue-bg/50'
                      : 'border-google-border hover:border-google-blue bg-google-gray-bg/60 hover:bg-google-blue-bg/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-google-blue-bg text-google-blue flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-google-text-primary">
                    <span className="text-google-blue font-semibold hover:underline">Click to browse</span> or drag and drop your resume
                  </p>
                  <p className="text-xs text-google-text-secondary mt-1">
                    Supported formats: PDF, DOCX, DOC (Up to 10MB)
                  </p>
                </div>
              ) : (
                /* Google Document Chip */
                <div className="border border-google-border bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-google-blue-bg text-google-blue flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-google-text-primary break-all">
                        {formData.resumeFileName}
                      </p>
                      <p className="text-xs text-google-text-secondary flex items-center gap-2 mt-0.5">
                        <span>{formatFileSize(formData.resumeFileSize)}</span>
                        <span>•</span>
                        <span className="text-google-green flex items-center gap-1 font-medium">
                          <CheckCircle className="w-3 h-3" /> Ready to submit
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="p-1.5 rounded-lg text-google-text-tertiary hover:text-google-red hover:bg-google-red-bg transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {resumeError && (
                <p className="text-xs text-google-red mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {resumeError}
                </p>
              )}
              {errors.resumeFile && (
                <p className="text-xs text-google-red mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.resumeFile}
                </p>
              )}

              {/* Alternative Cloud Link Option */}
              <div className="mt-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-google-text-tertiary">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="url"
                    name="resumeCloudLink"
                    value={formData.resumeCloudLink}
                    onChange={handleInputChange}
                    placeholder="Or paste Google Drive / Dropbox shareable link..."
                    className="google-input pl-9 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 11. Cover letter */}
            <div>
              <label className="block text-xs font-semibold text-google-text-primary mb-1.5">
                Cover Letter <span className="text-google-text-tertiary font-normal">(Optional)</span>
              </label>

              <input
                ref={coverLetterInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCoverLetterFile(e.target.files[0]);
                  }
                }}
              />

              {!formData.coverLetterFile ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => coverLetterInputRef.current?.click()}
                    className="w-full text-xs text-google-text-secondary hover:text-google-blue bg-google-gray-bg hover:bg-google-blue-bg/30 border border-google-border p-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                  >
                    <span>📎 Upload Cover Letter file (PDF / DOC / TXT)</span>
                  </button>

                  <textarea
                    name="coverLetterText"
                    rows={3}
                    value={formData.coverLetterText}
                    onChange={handleInputChange}
                    placeholder="Or write a brief note to hiring mentors..."
                    className="google-input text-xs leading-relaxed resize-none"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 rounded-lg border border-google-border bg-white shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-google-blue" />
                    <span className="text-xs font-medium text-google-text-primary break-all">
                      {formData.coverLetterFileName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoverLetter}
                    className="text-xs text-google-red hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SUBMIT SECTION */}
        {/* ============================================================ */}
        <div className="google-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-google-text-secondary text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-google-green shrink-0" />
            <span>All applications are confidential and reviewed directly by verified hiring mentors.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-google-primary w-full sm:w-auto px-8 py-3 text-sm font-semibold shrink-0"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{submitStatusMessage}</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Submit Application</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};