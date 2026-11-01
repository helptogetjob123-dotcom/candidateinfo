/**
 * HELP TO GET JOB // CONFIGURATION & GOOGLE FORM FIELD MAPPING
 * 
 * 100% Verified Entry IDs extracted directly from the live Google Form:
 * https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform
 */

export const FORM_CONFIG = {
  brand: {
    name: 'Help to Get Job',
    title: 'helptogetjob',
    tagline: 'Candidate Intake & Career Guidance',
    instagramUrl: 'https://www.instagram.com/vaibhav_yogish11748/',
    instagramHandle: '@vaibhav_yogish11748',
  },

  googleForm: {
    viewUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform',
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/formResponse',
    
    // Exact verified entry IDs from the live Google Form
    entryIds: {
      fullName: 'entry.1672635230',         // Name:
      email: 'entry.1328940444',            // E-mail
      instagramId: 'entry.419558734',       // insta ID
      state: 'entry.730549692',             // State
      experience: 'entry.2038274577',       // Experience (Fresher / Experienced)
      yearsOfExperience: 'entry.554012743', // If Experienced Mention the Years of experience
      preferredLocation: 'entry.291625133', // Preffered Location (Pune / Manglore / Banglore / Mumbai / ANY)
      sector: 'entry.482606903',            // Sector (IT / non-IT)
      preferredJobRole: 'entry.777742145',  // Preffered Job Role
      resume: 'entry.resume_placeholder',
      coverLetter: 'entry.cover_placeholder',
    },
  },

  /**
   * GOOGLE APPS SCRIPT WEBHOOK URL:
   * Connected directly to your Google Sheet and Google Drive folder!
   */
  appsScriptWebhookUrl: 'https://script.google.com/macros/s/AKfycby4pcGB2KA5ss-tByzIw1b8twHhwYM91f2bLqmFFf37r5-KkaFvxGA5nDtCoB9k4BUe/exec',
};
