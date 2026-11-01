/**
 * HELP TO GET JOB // CONFIGURATION & GOOGLE FORM FIELD MAPPING
 * 
 * Configured with the exact entry IDs extracted directly from:
 * https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform
 */

export const FORM_CONFIG = {
  brand: {
    name: 'Help to Get Job',
    title: 'helptogetjob',
    instagramUrl: 'https://instagram.com/helptogetjob',
    instagramHandle: '@helptogetjob',
  },

  googleForm: {
    viewUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform',
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/formResponse',
    
    // Verified entry IDs from the live form
    entryIds: {
      fullName: 'entry.2053108223',    // Name:
      email: 'entry.2062762285',       // E-mail
      instagramId: 'entry.949398628',   // insta ID
    },
  },

  appsScriptWebhookUrl: '', // Optional Google Apps Script webhook
};
