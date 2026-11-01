/**
 * HELP TO GET JOB // CONFIGURATION & FORM FIELD MAPPING
 * 
 * Configured with the exact questions from your Google Form:
 * 1. Name:
 * 2. E-mail
 * 3. insta ID
 * 4. State
 * 5. Experience (Fresher / Experienced)
 * 6. If Experienced Mention the Years of experience
 * 7. Preffered Location (Pune / Manglore / Banglore / Mumbai / ANY)
 * 8. Sector (IT / non-IT)
 * 9. Preffered Job Role
 * 10. Updated Resume
 * 11. Cover letter
 */

export const FORM_CONFIG = {
  brand: {
    name: 'Help to Get Job',
    title: 'helptogetjob',
    tagline: 'Candidate Intake & Career Guidance',
    instagramUrl: 'https://instagram.com/helptogetjob',
    instagramHandle: '@helptogetjob',
  },

  googleForm: {
    viewUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform',
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/formResponse',
    
    // Entry IDs mapped to your Google Form questions
    entryIds: {
      fullName: 'entry.2053108223',         // Name:
      email: 'entry.2062762285',            // E-mail
      instagramId: 'entry.949398628',        // insta ID
      state: 'entry.1065046570',            // State
      experience: 'entry.1706692224',       // Experience
      yearsOfExperience: 'entry.128456428', // If Experienced Mention the Years of experience
      preferredLocation: 'entry.839337160', // Preffered Location
      sector: 'entry.1387611802',           // Sector
      preferredJobRole: 'entry.184347209',  // Preffered Job Role
      resume: 'entry.198273618',            // Updated Resume
      coverLetter: 'entry.839337162',       // Cover letter
    },
  },

  /**
   * OPTIONAL: GOOGLE APPS SCRIPT WEBHOOK URL
   * If you deployed the included `google-apps-script/Code.gs`, paste the URL here.
   * It directly stores candidates and resume files to Google Sheets & Google Drive.
   */
  appsScriptWebhookUrl: '',
};
