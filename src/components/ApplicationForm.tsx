import React, { useState } from 'react';
import { CandidateFormData, FormErrors, FormSubmissionResult } from '../types';
import { FORM_CONFIG } from '../config/formConfig';

interface ApplicationFormProps {
  onSubmitSuccess: (result: FormSubmissionResult) => void;
}

const INITIAL_FORM_DATA: CandidateFormData = {
  fullName: '',
  email: '',
  instagramId: '',
};

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState<CandidateFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof CandidateFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your name.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.instagramId.trim()) {
      errs.instagramId = 'Please enter your Instagram ID / handle.';
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
    if (!validate()) return;

    setIsSubmitting(true);
    const transmissionId = generateTransmissionId();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    try {
      // 1. Silent Google Form submission via hidden iframe
      const formEl = document.createElement('form');
      formEl.action = FORM_CONFIG.googleForm.actionUrl;
      formEl.method = 'POST';
      formEl.target = 'hidden_submission_target';
      formEl.style.display = 'none';

      const entryMap: Record<string, string> = {
        [FORM_CONFIG.googleForm.entryIds.fullName]: formData.fullName.trim(),
        [FORM_CONFIG.googleForm.entryIds.email]: formData.email.trim(),
        [FORM_CONFIG.googleForm.entryIds.instagramId]: formData.instagramId.trim().replace(/^@/, ''),
      };

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

      // Redundant background fetch
      try {
        const params = new URLSearchParams();
        Object.entries(entryMap).forEach(([k, v]) => params.append(k, v));
        fetch(FORM_CONFIG.googleForm.actionUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        }).catch(() => {});
      } catch {}

      const result: FormSubmissionResult = {
        transmissionId,
        timestamp,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        instagramId: formData.instagramId.trim().replace(/^@/, ''),
      };

      setTimeout(() => {
        setIsSubmitting(false);
        onSubmitSuccess(result);
      }, 400);

    } catch (err) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Form Title & Instructions */}
        <div className="border-b border-dark-border pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            helptogetjob
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Fill in your details below to submit your profile.
          </p>
        </div>

        {/* 1. Name: */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-200 flex items-center justify-between">
            <span>Name:</span>
            <span className="text-red-400 text-xs">* Required</span>
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Your name"
            className="form-input-field text-sm"
            autoComplete="name"
          />
          {errors.fullName && (
            <p className="text-xs text-red-400">{errors.fullName}</p>
          )}
        </div>

        {/* 2. E-mail */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-200 flex items-center justify-between">
            <span>E-mail</span>
            <span className="text-red-400 text-xs">* Required</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your email address"
            className="form-input-field text-sm"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* 3. insta ID */}
        <div className="space-y-1.5">
          <label htmlFor="instagramId" className="text-sm font-medium text-gray-200 flex items-center justify-between">
            <span>insta ID</span>
            <span className="text-red-400 text-xs">* Required</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              @
            </span>
            <input
              id="instagramId"
              type="text"
              name="instagramId"
              required
              value={formData.instagramId}
              onChange={handleInputChange}
              placeholder="username"
              className="form-input-field text-sm pl-8"
              autoComplete="username"
            />
          </div>
          {errors.instagramId && (
            <p className="text-xs text-red-400">{errors.instagramId}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
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
                Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
