import React, { useState, useEffect } from 'react';
import { CrosshairMarker } from './CrosshairMarker';
import { ResumeUploader } from './ResumeUploader';
import { CandidateFormData, FormErrors, FormSubmissionResult } from '../types';
import { FORM_CONFIG } from '../config/formConfig';

interface TerminalFormProps {
  onProgressUpdate: (progress: number) => void;
  onActiveSectionChange: (section: 1 | 2 | 3) => void;
  onSubmitSuccess: (result: FormSubmissionResult) => void;
  activeSection: 1 | 2 | 3;
}

const INITIAL_FORM_DATA: CandidateFormData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedinUrl: '',
  portfolioUrl: '',
  targetRole: 'Full Stack Engineer',
  targetRoleCustom: '',
  experienceLevel: 'Entry Level (0 - 1 Years)',
  skills: '',
  employmentStatus: 'Actively Looking / Immediate Joiner',
  noticePeriod: 'Immediate (< 15 Days)',
  expectedCompensation: '',
  resumeFile: null,
  resumeFileName: '',
  resumeFileSize: 0,
  resumeBase64: '',
  resumeCloudLink: '',
  additionalNotes: '',
  consentAcknowledge: true,
};

const JOB_ROLES = [
  'Full Stack Engineer',
  'Frontend Developer (React / Next.js / Vue)',
  'Backend Developer (Node / Python / Java / Go)',
  'AI / ML & Data Science Engineer',
  'DevOps, SRE & Cloud Architect',
  'Mobile App Developer (Flutter / React Native / iOS / Android)',
  'Product Manager / Associate PM',
  'UI/UX & Product Designer',
  'QA / Automation Test Engineer',
  'Business Analyst / Data Analyst',
  'Other Engineering / Tech Discipline',
];

const EXPERIENCE_LEVELS = [
  'Fresh Graduate / Student (0 Years)',
  'Entry Level (0 - 1 Years)',
  'Junior (1 - 3 Years)',
  'Mid-Level (3 - 5 Years)',
  'Senior (5 - 8 Years)',
  'Lead / Staff Engineer (8+ Years)',
];

const EMPLOYMENT_STATUSES = [
  'Actively Looking / Immediate Joiner',
  'Currently Serving Notice Period',
  'Employed but Open to High-Growth Roles',
  'Recent Graduate / Unemployed',
  'College Student seeking Internship / Entry Role',
];

const NOTICE_PERIODS = [
  'Immediate (< 15 Days)',
  '30 Days Standard',
  '45 Days',
  '60 Days',
  '90 Days',
];

export const TerminalForm: React.FC<TerminalFormProps> = ({
  onProgressUpdate,
  onActiveSectionChange,
  onSubmitSuccess,
  activeSection,
}) => {
  const [formData, setFormData] = useState<CandidateFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>('');

  // Calculate field completion progress dynamically
  useEffect(() => {
    let filled = 0;
    const requiredKeys: (keyof CandidateFormData)[] = [
      'fullName',
      'email',
      'phone',
      'location',
      'linkedinUrl',
      'targetRole',
      'experienceLevel',
      'skills',
      'employmentStatus',
      'noticePeriod',
    ];

    requiredKeys.forEach((key) => {
      if (formData[key] && String(formData[key]).trim().length > 0) {
        filled++;
      }
    });

    // Resume: either file or cloud link counts
    if (formData.resumeFile || formData.resumeCloudLink.trim().length > 0) {
      filled++;
    }

    const totalKeyCount = requiredKeys.length + 1; // 11 key milestone fields
    const calcProgress = Math.min(100, Math.round((filled / totalKeyCount) * 100));
    onProgressUpdate(calcProgress);
  }, [formData, onProgressUpdate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name as keyof CandidateFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'MANDATORY_FIELD: FULL LEGAL NAME REQUIRED.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'MANDATORY_FIELD: VALID EMAIL REQUIRED.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'FORMAT_INVALID: ENTER A VALID RFC-COMPLIANT EMAIL.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'MANDATORY_FIELD: TELEPHONE / WHATSAPP REQUIRED.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'MANDATORY_FIELD: CURRENT CITY / COUNTRY REQUIRED.';
    }

    if (!formData.linkedinUrl.trim()) {
      newErrors.linkedinUrl = 'MANDATORY_FIELD: LINKEDIN PROFILE URL REQUIRED.';
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'MANDATORY_FIELD: SPECIFY PRIMARY TECHNICAL SKILLS.';
    }

    if (!formData.resumeFile && !formData.resumeCloudLink.trim()) {
      newErrors.resumeCloudLink = 'MANDATORY_RECORD: UPLOAD A RESUME FILE OR PROVIDE CLOUD LINK.';
    }

    if (!formData.consentAcknowledge) {
      newErrors.consentAcknowledge = 'AUTHORIZATION_REQUIRED: MUST CONFIRM DISPATCH DIRECTIVE.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Jump to first section with error
      if (newErrors.fullName || newErrors.email || newErrors.phone || newErrors.location || newErrors.linkedinUrl) {
        onActiveSectionChange(1);
      } else if (newErrors.skills) {
        onActiveSectionChange(2);
      } else {
        onActiveSectionChange(3);
      }
      return false;
    }

    return true;
  };

  const generateTransmissionId = (): string => {
    const year = new Date().getFullYear();
    const hex = Math.floor(1000 + Math.random() * 9000);
    return `HTGJ-${year}-${hex}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const transmissionId = generateTransmissionId();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    try {
      // 1. SILENT GOOGLE FORM SUBMISSION via Hidden Iframe Form Submit
      const googleFormEl = document.createElement('form');
      googleFormEl.action = FORM_CONFIG.googleForm.actionUrl;
      googleFormEl.method = 'POST';
      googleFormEl.target = 'hidden_submission_target';
      googleFormEl.style.display = 'none';

      const entryMap: Record<string, string> = {
        [FORM_CONFIG.googleForm.entryIds.fullName]: formData.fullName,
        [FORM_CONFIG.googleForm.entryIds.email]: formData.email,
        [FORM_CONFIG.googleForm.entryIds.phone]: formData.phone,
        [FORM_CONFIG.googleForm.entryIds.location]: formData.location,
        [FORM_CONFIG.googleForm.entryIds.linkedinUrl]: formData.linkedinUrl,
        [FORM_CONFIG.googleForm.entryIds.portfolioUrl]: formData.portfolioUrl || 'N/A',
        [FORM_CONFIG.googleForm.entryIds.targetRole]:
          formData.targetRole === 'Other Engineering / Tech Discipline'
            ? formData.targetRoleCustom || 'Other'
            : formData.targetRole,
        [FORM_CONFIG.googleForm.entryIds.experienceLevel]: formData.experienceLevel,
        [FORM_CONFIG.googleForm.entryIds.skills]: formData.skills,
        [FORM_CONFIG.googleForm.entryIds.employmentStatus]: formData.employmentStatus,
        [FORM_CONFIG.googleForm.entryIds.noticePeriod]: formData.noticePeriod,
        [FORM_CONFIG.googleForm.entryIds.expectedCompensation]: formData.expectedCompensation || 'Flexible / As per market',
        [FORM_CONFIG.googleForm.entryIds.resumeLink]:
          formData.resumeCloudLink ||
          (formData.resumeFile ? `Uploaded: ${formData.resumeFileName} (${(formData.resumeFileSize / 1024).toFixed(1)}KB)` : 'Pending'),
        [FORM_CONFIG.googleForm.entryIds.additionalNotes]:
          `[TID: ${transmissionId}] ${formData.additionalNotes || 'No additional remarks.'}`,
      };

      // Append inputs to form
      Object.entries(entryMap).forEach(([name, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = val;
        googleFormEl.appendChild(input);
      });

      document.body.appendChild(googleFormEl);
      googleFormEl.submit();
      
      // Clean up after slight delay
      setTimeout(() => {
        if (document.body.contains(googleFormEl)) {
          document.body.removeChild(googleFormEl);
        }
      }, 1000);

      // 2. Fetch submission (no-cors mode as secondary redundant dispatch)
      try {
        const params = new URLSearchParams();
        Object.entries(entryMap).forEach(([k, v]) => params.append(k, v));
        fetch(FORM_CONFIG.googleForm.actionUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        }).catch(() => {
          // Cross-origin no-cors silent capture
        });
      } catch {
        // Silent fallback
      }

      // 3. APPS SCRIPT WEBHOOK DISPATCH (If configured, sends JSON payload + base64 resume)
      if (FORM_CONFIG.appsScriptWebhookUrl) {
        try {
          fetch(FORM_CONFIG.appsScriptWebhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transmissionId,
              timestamp,
              formData: {
                ...formData,
                resumeFile: undefined, // omitted from raw json
              },
            }),
          }).catch(() => {});
        } catch {
          // ignore
        }
      }

      // 4. Save to offline local audit ledger
      try {
        const historyItem = {
          transmissionId,
          timestamp,
          name: formData.fullName,
          role: formData.targetRole,
        };
        const existing = JSON.parse(localStorage.getItem('htgj_submissions') || '[]');
        existing.push(historyItem);
        localStorage.setItem('htgj_submissions', JSON.stringify(existing));
      } catch {
        // storage disabled or full
      }

      // 5. Transition to Mission Control Confirmation
      const result: FormSubmissionResult = {
        transmissionId,
        timestamp,
        candidateName: formData.fullName,
        role: formData.targetRole === 'Other Engineering / Tech Discipline' ? formData.targetRoleCustom || 'Other' : formData.targetRole,
        email: formData.email,
        phone: formData.phone,
        experienceLevel: formData.experienceLevel,
        resumeType: formData.resumeFile ? 'file' : 'link',
        resumeName: formData.resumeFileName,
        resumeLink: formData.resumeCloudLink,
      };

      // Slight simulated mechanical delay for tactile industrial feel
      setTimeout(() => {
        setIsSubmitting(false);
        onSubmitSuccess(result);
      }, 700);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setSubmissionError(
        'TRANSMISSION_ANOMALY: FAILED TO DISPATCH PACKET. PLEASE VERIFY CONNECTION.'
      );
      console.error('Submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10 pb-16">
      {/* SECTION [01]: IDENTITY MATRIX */}
      <section
        id="section-1"
        onFocus={() => onActiveSectionChange(1)}
        className={`border transition-colors relative ${
          activeSection === 1 ? 'border-hairline-light bg-carbon-deep' : 'border-hairline bg-carbon-deep/40'
        }`}
      >
        <CrosshairMarker position="top-left" />
        <CrosshairMarker position="top-right" />
        
        {/* Section Header Bar */}
        <div className="px-6 py-4 border-b border-hairline flex flex-wrap items-center justify-between gap-2 bg-carbon-surface">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-signal-orange">
              [01]
            </span>
            <h2 className="font-display font-bold text-sm tracking-tight text-stark uppercase">
              IDENTITY & CONTACT MATRIX
            </h2>
          </div>
          <span className="font-mono text-[10px] text-stark-steel tracking-technical uppercase">
            SEC.01 // REQ.FIELDS: 05
          </span>
        </div>

        <div className="p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                CANDIDATE FULL LEGAL NAME <span className="text-signal-orange">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. MARCUS A. VANCE"
                className={`mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0 ${
                  errors.fullName ? 'border-signal-orange' : ''
                }`}
              />
              {errors.fullName && (
                <div className="font-mono text-[10px] text-signal-orange uppercase tracking-technical">
                  [!] {errors.fullName}
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                COMMUNICATION EMAIL <span className="text-signal-orange">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="candidate@domain.com"
                className={`mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0 ${
                  errors.email ? 'border-signal-orange' : ''
                }`}
              />
              {errors.email && (
                <div className="font-mono text-[10px] text-signal-orange uppercase tracking-technical">
                  [!] {errors.email}
                </div>
              )}
            </div>

            {/* Phone Number / WhatsApp */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                TELEPHONE / WHATSAPP DISPATCH <span className="text-signal-orange">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 019-2834 / +91 98765 43210"
                className={`mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0 ${
                  errors.phone ? 'border-signal-orange' : ''
                }`}
              />
              {errors.phone && (
                <div className="font-mono text-[10px] text-signal-orange uppercase tracking-technical">
                  [!] {errors.phone}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                CURRENT LOCATION (CITY, COUNTRY) <span className="text-signal-orange">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Bengaluru, India or London, UK"
                className={`mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0 ${
                  errors.location ? 'border-signal-orange' : ''
                }`}
              />
              {errors.location && (
                <div className="font-mono text-[10px] text-signal-orange uppercase tracking-technical">
                  [!] {errors.location}
                </div>
              )}
            </div>

            {/* LinkedIn Profile */}
            <div className="space-y-2">
              <label
                htmlFor="linkedinUrl"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                LINKEDIN REPOSITORY URL <span className="text-signal-orange">*</span>
              </label>
              <input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                required
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                className={`mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0 ${
                  errors.linkedinUrl ? 'border-signal-orange' : ''
                }`}
              />
              {errors.linkedinUrl && (
                <div className="font-mono text-[10px] text-signal-orange uppercase tracking-technical">
                  [!] {errors.linkedinUrl}
                </div>
              )}
            </div>

            {/* Portfolio / GitHub / Website */}
            <div className="space-y-2">
              <label
                htmlFor="portfolioUrl"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                PORTFOLIO / GITHUB / CODEBASE (OPTIONAL)
              </label>
              <input
                id="portfolioUrl"
                name="portfolioUrl"
                type="url"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                className="mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION [02]: PROFESSIONAL MATRIX */}
      <section
        id="section-2"
        onFocus={() => onActiveSectionChange(2)}
        className={`border transition-colors relative ${
          activeSection === 2 ? 'border-hairline-light bg-carbon-deep' : 'border-hairline bg-carbon-deep/40'
        }`}
      >
        <CrosshairMarker position="top-left" />
        <CrosshairMarker position="top-right" />

        {/* Section Header Bar */}
        <div className="px-6 py-4 border-b border-hairline flex flex-wrap items-center justify-between gap-2 bg-carbon-surface">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-signal-orange">
              [02]
            </span>
            <h2 className="font-display font-bold text-sm tracking-tight text-stark uppercase">
              PROFESSIONAL SPECIFICATION & MATRIX
            </h2>
          </div>
          <span className="font-mono text-[10px] text-stark-steel tracking-technical uppercase">
            SEC.02 // REQ.FIELDS: 05
          </span>
        </div>

        <div className="p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Job Role */}
            <div className="space-y-2">
              <label
                htmlFor="targetRole"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                PRIMARY TARGET JOB TRACK <span className="text-signal-orange">*</span>
              </label>
              <select
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleInputChange}
                className="mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark focus:ring-0 bg-[#0C0D10]"
              >
                {JOB_ROLES.map((role) => (
                  <option key={role} value={role} className="bg-[#0C0D10] text-[#F4F4F6]">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Role Input if Other */}
            {formData.targetRole === 'Other Engineering / Tech Discipline' && (
              <div className="space-y-2">
                <label
                  htmlFor="targetRoleCustom"
                  className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
                >
                  SPECIFY CUSTOM DISCIPLINE <span className="text-signal-orange">*</span>
                </label>
                <input
                  id="targetRoleCustom"
                  name="targetRoleCustom"
                  type="text"
                  required
                  value={formData.targetRoleCustom}
                  onChange={handleInputChange}
                  placeholder="e.g. Embedded Firmware Engineer"
                  className="mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0"
                />
              </div>
            )}

            {/* Experience Level */}
            <div className="space-y-2">
              <label
                htmlFor="experienceLevel"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                EXPERIENCE SENIORITY BRACKET <span className="text-signal-orange">*</span>
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark focus:ring-0 bg-[#0C0D10]"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-[#0C0D10] text-[#F4F4F6]">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Employment Status */}
            <div className="space-y-2">
              <label
                htmlFor="employmentStatus"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                CURRENT EMPLOYMENT STATUS <span className="text-signal-orange">*</span>
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                className="mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark focus:ring-0 bg-[#0C0D10]"
              >
                {EMPLOYMENT_STATUSES.map((status) => (
                  <option key={status} value={status} className="bg-[#0C0D10] text-[#F4F4F6]">
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Notice Period / Availability */}
            <div className="space-y-2">
              <label
                htmlFor="noticePeriod"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                AVAILABILITY / NOTICE TIMELINE <span className="text-signal-orange">*</span>
              </label>
              <select
                id="noticePeriod"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleInputChange}
                className="mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark focus:ring-0 bg-[#0C0D10]"
              >
                {NOTICE_PERIODS.map((period) => (
                  <option key={period} value={period} className="bg-[#0C0D10] text-[#F4F4F6]">
                    {period}
                  </option>
                ))}
              </select>
            </div>

            {/* Expected Compensation */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="expectedCompensation"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                EXPECTED COMPENSATION / TARGET CTC (OPTIONAL)
              </label>
              <input
                id="expectedCompensation"
                name="expectedCompensation"
                type="text"
                value={formData.expectedCompensation}
                onChange={handleInputChange}
                placeholder="e.g. 18 LPA INR / $120,000 USD / Open to Negotiation"
                className="mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0"
              />
            </div>

            {/* Primary Technical Skills & Stack */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="skills"
                className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
              >
                PRIMARY TECHNICAL STACK & KEY COMPETENCIES <span className="text-signal-orange">*</span>
              </label>
              <textarea
                id="skills"
                name="skills"
                rows={3}
                required
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g. TypeScript, React 19, Node.js, Go, PostgreSQL, Docker, AWS (ECS/Lambda), Tailwind, System Architecture"
                className={`mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0 leading-relaxed ${
                  errors.skills ? 'border-signal-orange' : ''
                }`}
              />
              {errors.skills && (
                <div className="font-mono text-[10px] text-signal-orange uppercase tracking-technical">
                  [!] {errors.skills}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION [03]: RESUME TRANSMISSION & DIRECTIVE */}
      <section
        id="section-3"
        onFocus={() => onActiveSectionChange(3)}
        className={`border transition-colors relative ${
          activeSection === 3 ? 'border-hairline-light bg-carbon-deep' : 'border-hairline bg-carbon-deep/40'
        }`}
      >
        <CrosshairMarker position="top-left" />
        <CrosshairMarker position="top-right" />

        {/* Section Header Bar */}
        <div className="px-6 py-4 border-b border-hairline flex flex-wrap items-center justify-between gap-2 bg-carbon-surface">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-signal-orange">
              [03]
            </span>
            <h2 className="font-display font-bold text-sm tracking-tight text-stark uppercase">
              RESUME TRANSMISSION & DISPATCH DIRECTIVE
            </h2>
          </div>
          <span className="font-mono text-[10px] text-stark-steel tracking-technical uppercase">
            SEC.03 // REQ.FIELDS: 02
          </span>
        </div>

        <div className="p-6 lg:p-8 space-y-6">
          {/* Resume Drag & Drop Uploader */}
          <div className="space-y-2">
            <label className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel">
              RESUME FILE TRANSMISSION (PDF / DOCX) <span className="text-signal-orange">*</span>
            </label>
            <ResumeUploader
              file={formData.resumeFile}
              cloudLink={formData.resumeCloudLink}
              onFileSelect={(file, base64) => {
                setFormData((prev) => ({
                  ...prev,
                  resumeFile: file,
                  resumeFileName: file ? file.name : '',
                  resumeFileSize: file ? file.size : 0,
                  resumeBase64: base64,
                }));
                if (errors.resumeCloudLink) {
                  setErrors((prev) => ({ ...prev, resumeCloudLink: undefined }));
                }
              }}
              onCloudLinkChange={(link) => {
                setFormData((prev) => ({ ...prev, resumeCloudLink: link }));
                if (errors.resumeCloudLink) {
                  setErrors((prev) => ({ ...prev, resumeCloudLink: undefined }));
                }
              }}
              error={errors.resumeCloudLink}
            />
          </div>

          {/* Additional Notes / Target Companies */}
          <div className="space-y-2 pt-2">
            <label
              htmlFor="additionalNotes"
              className="block font-mono text-[11px] uppercase tracking-technical text-stark-steel"
            >
              MISSION STATEMENT // TARGET COMPANIES OR MENTOR DIRECTIVES (OPTIONAL)
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              rows={3}
              value={formData.additionalNotes}
              onChange={handleInputChange}
              placeholder="Specify target company tiers, product stage preferences (seed / growth / enterprise), or specific mentorship guidance needed..."
              className="mechanical-input w-full px-3.5 py-3 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0 leading-relaxed"
            />
          </div>

          {/* Verification & Consent Authorization */}
          <div className="pt-4 border-t border-hairline">
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                name="consentAcknowledge"
                checked={formData.consentAcknowledge}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 bg-carbon-input border border-hairline text-signal-orange focus:ring-0 cursor-pointer"
              />
              <span className="font-mono text-[11px] text-stark-steel group-hover:text-stark transition-colors leading-relaxed uppercase">
                I AUTHORIZE THE HELP TO GET JOB DISPATCH COMMITTEE TO TRANSMIT MY DOSSIER TO VERIFIED MENTORS AND HIRING PARTNERS FOR REVIEW.
              </span>
            </label>
            {errors.consentAcknowledge && (
              <div className="mt-2 font-mono text-[10px] text-signal-orange uppercase tracking-technical">
                [!] {errors.consentAcknowledge}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Submission Status or Global Error Readout */}
      {submissionError && (
        <div className="p-4 border border-signal-orange bg-carbon-surface font-mono text-xs text-signal-orange uppercase tracking-technical">
          [CRITICAL ERROR] {submissionError}
        </div>
      )}

      {/* ACTION COMMAND BAR: High-Contrast Rectangular Brutalist Button */}
      <div className="pt-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-mono text-[11px] text-stark-steel tracking-technical uppercase">
          PROTOCOL: DIRECT_DISPATCH // ZERO_GOOGLE_REDIRECT
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-brutalist-primary w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-3 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="w-2.5 h-2.5 bg-carbon animate-ping" />
              <span>TRANSMITTING DOSSIER TO DISPATCH POOL...</span>
            </>
          ) : (
            <>
              <span>SUBMIT CANDIDATE DOSSIER</span>
              <span className="font-mono">[TRANSMIT -&gt;]</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
