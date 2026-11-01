/**
 * HELP TO GET JOB // CONFIGURATION & DISPATCH ENDPOINT MAPPING
 * 
 * This file configures the headless Google Form submission and optional Google Apps Script Webhook.
 * You can customize the entry.* IDs below to match your exact Google Form questions.
 */

export const FORM_CONFIG = {
  // Brand Metadata
  brand: {
    name: 'HELP TO GET JOB',
    tagline: 'CAREER DISPATCH // CANDIDATE INTAKE TERMINAL',
    instagramUrl: 'https://instagram.com/helptogetjob',
    instagramHandle: '@helptogetjob',
    communityOrigin: 'Instagram Career Network',
    version: 'V2.6-ARCHITECT',
  },

  // Google Form Response URL (Provided by User)
  googleForm: {
    viewUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform',
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/formResponse',
    
    /**
     * Exact entry IDs from your Google Form.
     * If your Google Form has file upload enabled, Google requires user sign-in.
     * To bypass Google login entirely, use the Apps Script Webhook below!
     */
    entryIds: {
      fullName: 'entry.2005620554',
      email: 'entry.1045781291',
      phone: 'entry.1166974658',
      location: 'entry.1065046570',
      linkedinUrl: 'entry.839337160',
      portfolioUrl: 'entry.12335028',
      targetRole: 'entry.184347209',
      experienceLevel: 'entry.1706692224',
      skills: 'entry.1051512403',
      employmentStatus: 'entry.1387611802',
      noticePeriod: 'entry.1448074906',
      expectedCompensation: 'entry.128456428',
      resumeLink: 'entry.198273618',
      additionalNotes: 'entry.839337162',
    },
  },

  /**
   * GOOGLE APPS SCRIPT WEBHOOK (RECOMMENDED FOR ZERO GOOGLE SIGN-IN & RESUME UPLOADS):
   * Deploy the included `google-apps-script/Code.gs` script as a Web App (Anyone can access).
   * Paste the deployed Web App URL here. The intake terminal will POST the candidate data
   * and resume file directly without any Google Sign-in wall!
   */
  appsScriptWebhookUrl: '', // e.g. 'https://script.google.com/macros/s/AKfycb.../exec'
  
  // Submission timeout in milliseconds
  submissionTimeoutMs: 8000,
};
