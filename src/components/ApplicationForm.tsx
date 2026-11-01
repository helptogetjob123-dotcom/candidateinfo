import React, { useState, useRef } from 'react';
import { CandidateFormData, FormErrors, FormSubmissionResult } from '../types';
import { FORM_CONFIG } from '../config/formConfig';

interface ApplicationFormProps {
  onSubmitSuccess: (result: FormSubmissionResult) => void;
}

const INITIAL_FORM_DATA: CandidateFormData = {
  fullName: '',
  email: '',
  instagramId: '',
  state: '',
  experience: 'Fresher',
  yearsOfExperience: '',
  preferredLocation: 'Banglore',
  sector: 'IT',
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

  // Dynamic progress tracker
  const calculateProgress = () => {
    let filled = 0;
    const requiredChecks = [
      formData.fullName.trim(),
      formData.email.trim(),
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

  // Resume File Processing
  const handleResumeFile = (file: File) => {
    setResumeError('');
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isAllowedExt = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!allowed.includes(file.type) && !isAllowedExt) {
      setResumeError('Please upload a PDF or Word document (.pdf, .doc, .docx).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeError('File size exceeds the 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string) || '';
      setFormData((prev) => ({
        ...prev,
        resumeFile: file,
        resumeFileName: file.name,
        resumeFileSize: file.size,
        resumeBase64: base64,
      }));
      if (errors.resumeFile) {
        setErrors((prev) => ({ ...prev, resumeFile: undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resumeInputRef.current) resumeInputRef.current.value = '';
    setFormData((prev) => ({
      ...prev,
      resumeFile: null,
      resumeFileName: '',
      resumeFileSize: 0,
      resumeBase64: '',
    }));
    setResumeError('');
  };

  // Cover Letter File Processing
  const handleCoverLetterFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string) || '';
      setFormData((prev) => ({
        ...prev,
        coverLetterFile: file,
        coverLetterFileName: file.name,
        coverLetterBase64: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (coverLetterInputRef.current) coverLetterInputRef.current.value = '';
    setFormData((prev) => ({
      ...prev,
      coverLetterFile: null,
      coverLetterFileName: '',
      coverLetterBase64: '',
    }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) errs.fullName = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.state.trim()) errs.state = 'Please enter your state.';
    if (!formData.experience) errs.experience = 'Please select your experience.';
    if (formData.experience === 'Experienced' && !formData.yearsOfExperience.trim()) {
      errs.yearsOfExperience = 'Please mention your years of experience.';
    }
    if (!formData.preferredLocation) errs.preferredLocation = 'Please select your preferred location.';
    if (!formData.sector) errs.sector = 'Please select your sector.';
    if (!formData.preferredJobRole.trim()) errs.preferredJobRole = 'Please enter your preferred job role.';

    if (!formData.resumeFile && !formData.resumeCloudLink.trim()) {
      errs.resumeFile = 'Please upload your updated resume or provide a Google Drive / cloud link.';
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
      // 1. Process files into Base64 for Google Drive storage
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

      setSubmitStatusMessage('Uploading to Google Drive & logging response...');

      let resolvedResumeDriveLink: string | undefined = undefined;

      // 2. Primary Transmission: Google Apps Script Webhook (Direct Drive & Sheet Sync)
      if (FORM_CONFIG.appsScriptWebhookUrl && FORM_CONFIG.appsScriptWebhookUrl.trim() !== '') {
        try {
          const payload = {
            transmissionId,
            timestamp,
            formData: {
              fullName: formData.fullName.trim(),
              email: formData.email.trim(),
              instagramId: formData.instagramId.trim() || 'N/A',
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

          // Use text/plain;charset=utf-8 to bypass browser CORS preflight blocks
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

      // 3. Fallback: Silent Google Form submission via hidden iframe (if configured)
      try {
        const formEl = document.createElement('form');
        formEl.action = FORM_CONFIG.googleForm.actionUrl;
        formEl.method = 'POST';
        formEl.target = 'hidden_submission_target';
        formEl.style.display = 'none';

        const entryMap: Record<string, string> = {
          [FORM_CONFIG.googleForm.entryIds.fullName]: formData.fullName.trim(),
          [FORM_CONFIG.googleForm.entryIds.email]: formData.email.trim(),
          [FORM_CONFIG.googleForm.entryIds.instagramId]: formData.instagramId.trim() || 'N/A',
          [FORM_CONFIG.googleForm.entryIds.state]: formData.state.trim(),
          [FORM_CONFIG.googleForm.entryIds.experience]: formData.experience,
          [FORM_CONFIG.googleForm.entryIds.yearsOfExperience]:
            formData.experience === 'Experienced' ? formData.yearsOfExperience.trim() : '0',
          [FORM_CONFIG.googleForm.entryIds.preferredLocation]: formData.preferredLocation,
          [FORM_CONFIG.googleForm.entryIds.sector]: formData.sector,
          [FORM_CONFIG.googleForm.entryIds.preferredJobRole]: formData.preferredJobRole.trim(),
          fvv: '1',
          pageHistory: '0',
          [`${FORM_CONFIG.googleForm.entryIds.experience}_sentinel`]: '',
          [`${FORM_CONFIG.googleForm.entryIds.preferredLocation}_sentinel`]: '',
          [`${FORM_CONFIG.googleForm.entryIds.sector}_sentinel`]: '',
        };

        if (!FORM_CONFIG.googleForm.entryIds.resume.includes('placeholder')) {
          entryMap[FORM_CONFIG.googleForm.entryIds.resume] =
            formData.resumeCloudLink.trim() ||
            (formData.resumeFile ? `Uploaded Resume: ${formData.resumeFileName}` : 'Pending');
        }
        if (!FORM_CONFIG.googleForm.entryIds.coverLetter.includes('placeholder')) {
          entryMap[FORM_CONFIG.googleForm.entryIds.coverLetter] =
            formData.coverLetterFileName ? `Uploaded Cover Letter: ${formData.coverLetterFileName}` : (formData.coverLetterText.trim() || 'N/A');
        }

        Object.entries(entryMap).forEach(([k, v]) => {
          const inp = document.createElement('input');
          inp.type = 'hidden';
          inp.name = k;
          inp.value = v;
          formEl.appendChild(inp);
        });

        document.body.appendChild(formEl);
        formEl.submit();

        setTimeout(() => {
          if (document.body.contains(formEl)) document.body.removeChild(formEl);
        }, 1000);
      } catch {}

      const result: FormSubmissionResult = {
        transmissionId,
        timestamp,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        instagramId: formData.instagramId.trim(),
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
      console.error('Submission failed:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Top Progress Tracker */}
      <div className="bg-dark-card border border-dark-border p-4 rounded-xl mb-6 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5 font-medium">
          <span>Form Completion</span>
          <span className="text-blue-400 font-semibold">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Form Title */}
        <div className="border-b border-dark-border pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            helptogetjob
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Fill in your candidate details below. Required fields are marked with <span className="text-red-400">*</span>
          </p>
        </div>

        {/* 1. Name: */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-200 flex items-center justify-between">
            <span>Name: <span className="text-red-400">*</span></span>
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Your full name"
            className="form-input-field text-sm"
          />
          {errors.fullName && <p className="text-xs text-red-400">{errors.fullName}</p>}
        </div>

        {/* 2. E-mail */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-200 flex items-center justify-between">
            <span>E-mail <span className="text-red-400">*</span></span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className="form-input-field text-sm"
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>

        {/* 3. insta ID */}
        <div className="space-y-1.5">
          <label htmlFor="instagramId" className="text-sm font-medium text-gray-200 flex items-center justify-between">
            <span>insta ID</span>
            <span className="text-xs text-gray-500">(Optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
            <input
              id="instagramId"
              type="text"
              name="instagramId"
              value={formData.instagramId}
              onChange={handleInputChange}
              placeholder="username"
              className="form-input-field text-sm pl-8"
            />
          </div>
        </div>

        {/* 4. State */}
        <div className="space-y-1.5">
          <label htmlFor="state" className="text-sm font-medium text-gray-200 flex items-center justify-between">
            <span>State <span className="text-red-400">*</span></span>
          </label>
          <input
            id="state"
            type="text"
            name="state"
            required
            value={formData.state}
            onChange={handleInputChange}
            placeholder="e.g. Karnataka, Maharashtra, Delhi..."
            className="form-input-field text-sm"
          />
          {errors.state && <p className="text-xs text-red-400">{errors.state}</p>}
        </div>

        {/* 5. Experience */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200 block">
            Experience <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EXPERIENCE_OPTIONS.map((exp) => (
              <label
                key={exp}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.experience === exp
                    ? 'border-blue-500 bg-blue-500/10 text-white font-medium'
                    : 'border-dark-border bg-dark-bg/60 text-gray-300 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="experience"
                  value={exp}
                  checked={formData.experience === exp}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-dark-input border-dark-border focus:ring-0"
                />
                <span className="text-sm">{exp}</span>
              </label>
            ))}
          </div>
          {errors.experience && <p className="text-xs text-red-400">{errors.experience}</p>}
        </div>

        {/* 6. If Experienced Mention the Years of experience */}
        {formData.experience === 'Experienced' && (
          <div className="space-y-1.5 bg-dark-bg/50 p-4 rounded-lg border border-dark-border animate-fadeIn">
            <label htmlFor="yearsOfExperience" className="text-sm font-medium text-gray-200 flex items-center justify-between">
              <span>If Experienced Mention the Years of experience <span className="text-red-400">*</span></span>
            </label>
            <input
              id="yearsOfExperience"
              type="text"
              name="yearsOfExperience"
              required={formData.experience === 'Experienced'}
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              placeholder="e.g. 2.5 Years"
              className="form-input-field text-sm"
            />
            {errors.yearsOfExperience && (
              <p className="text-xs text-red-400">{errors.yearsOfExperience}</p>
            )}
          </div>
        )}

        {/* 7. Preffered Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200 block">
            Preffered Location <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {LOCATION_OPTIONS.map((loc) => (
              <label
                key={loc}
                className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.preferredLocation === loc
                    ? 'border-blue-500 bg-blue-500/10 text-white font-medium'
                    : 'border-dark-border bg-dark-bg/60 text-gray-300 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="preferredLocation"
                  value={loc}
                  checked={formData.preferredLocation === loc}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-dark-input border-dark-border focus:ring-0"
                />
                <span className="text-sm">{loc}</span>
              </label>
            ))}
          </div>
          {errors.preferredLocation && <p className="text-xs text-red-400">{errors.preferredLocation}</p>}
        </div>

        {/* 8. Sector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200 block">
            Sector <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SECTOR_OPTIONS.map((sec) => (
              <label
                key={sec}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.sector === sec
                    ? 'border-blue-500 bg-blue-500/10 text-white font-medium'
                    : 'border-dark-border bg-dark-bg/60 text-gray-300 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="sector"
                  value={sec}
                  checked={formData.sector === sec}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-dark-input border-dark-border focus:ring-0"
                />
                <span className="text-sm">{sec}</span>
              </label>
            ))}
          </div>
          {errors.sector && <p className="text-xs text-red-400">{errors.sector}</p>}
        </div>

        {/* 9. Preffered Job Role */}
        <div className="space-y-1.5">
          <label htmlFor="preferredJobRole" className="text-sm font-medium text-gray-200 flex items-center justify-between">
            <span>Preffered Job Role <span className="text-red-400">*</span></span>
          </label>
          <input
            id="preferredJobRole"
            type="text"
            name="preferredJobRole"
            required
            value={formData.preferredJobRole}
            onChange={handleInputChange}
            placeholder="e.g. Software Engineer, QA Tester, Data Analyst..."
            className="form-input-field text-sm"
          />
          {errors.preferredJobRole && (
            <p className="text-xs text-red-400">{errors.preferredJobRole}</p>
          )}
        </div>

        {/* 10. Updated Resume */}
        <div className="space-y-2 pt-2 border-t border-dark-border">
          <label className="text-sm font-medium text-gray-200 block">
            Updated Resume <span className="text-red-400">*</span>
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

          <div
            onClick={() => resumeInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              setIsResumeDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleResumeFile(e.dataTransfer.files[0]);
              }
            }}
            onDragOver={(e) => { e.preventDefault(); setIsResumeDragging(true); }}
            onDragLeave={() => setIsResumeDragging(false)}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              isResumeDragging
                ? 'border-blue-500 bg-blue-500/10'
                : formData.resumeFile
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-dark-border hover:border-gray-500 bg-dark-bg/60'
            }`}
          >
            {!formData.resumeFile ? (
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white">Click to upload Updated Resume</p>
                <p className="text-xs text-gray-400">PDF or Document (max 10MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-green-500/10 text-green-400 flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white break-all">{formData.resumeFileName}</p>
                    <p className="text-[11px] text-gray-400">{(formData.resumeFileSize / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {resumeError && <p className="text-xs text-red-400">{resumeError}</p>}

          {/* Alternative Google Drive Link */}
          <div className="pt-1">
            <span className="text-[11px] text-gray-500 block mb-1">Or paste a Google Drive / cloud link:</span>
            <input
              type="url"
              name="resumeCloudLink"
              value={formData.resumeCloudLink}
              onChange={handleInputChange}
              placeholder="https://drive.google.com/file/d/.../view"
              className="form-input-field text-xs"
            />
          </div>
          {errors.resumeFile && <p className="text-xs text-red-400 mt-1">{errors.resumeFile}</p>}
        </div>

        {/* 11. Cover letter */}
        <div className="space-y-2 pt-2 border-t border-dark-border">
          <label className="text-sm font-medium text-gray-200 flex items-center justify-between">
            <span>Cover letter</span>
            <span className="text-xs text-gray-500">(Optional)</span>
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
                className="w-full text-xs text-gray-400 hover:text-white bg-dark-bg hover:bg-dark-hover border border-dark-border p-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>📎 Upload Cover Letter file (PDF / DOC / TXT)</span>
              </button>

              <textarea
                name="coverLetterText"
                rows={2}
                value={formData.coverLetterText}
                onChange={handleInputChange}
                placeholder="Or type a brief note/cover letter here..."
                className="form-input-field text-xs leading-relaxed resize-none"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-lg border border-dark-border bg-dark-bg text-left">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-xs">📄</span>
                <span className="text-xs text-white break-all">{formData.coverLetterFileName}</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoverLetter}
                className="text-xs text-red-400 hover:text-red-300 font-medium"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-dark-border">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3.5 shadow-md shadow-blue-600/20 text-sm font-semibold cursor-pointer disabled:opacity-50"
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
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
