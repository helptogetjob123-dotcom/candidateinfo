/**
 * HELP TO GET JOB // GOOGLE APPS SCRIPT WEBHOOK RECEIVER
 * 
 * INSTRUCTIONS FOR ZERO GOOGLE SIGN-IN RESUME DISPATCH:
 * 1. Open your Google Sheet (the one linked to your Google Form or create a new one).
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Delete any default code in Code.gs and paste this entire script.
 * 4. Click 'Save' (floppy disk icon).
 * 5. Click 'Deploy' > 'New deployment'.
 * 6. Select type: 'Web app'.
 * 7. Set:
 *    - Description: "Help to Get Job Candidate Intake Webhook"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (CRITICAL: this allows candidates to submit without Google sign-in!)
 * 8. Click 'Deploy' and copy the 'Web app URL' (ends in /exec).
 * 9. Paste the URL into `src/config/formConfig.ts` in `appsScriptWebhookUrl`.
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var payload;
    
    // Check if JSON or Form Encoded
    if (e.postData.type === "application/json") {
      payload = JSON.parse(rawData);
    } else {
      payload = e.parameter;
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Transmission ID",
        "Timestamp (UTC)",
        "Candidate Name",
        "Email Address",
        "Phone / WhatsApp",
        "Location",
        "Target Job Track",
        "Experience Seniority",
        "Technical Skills",
        "Current Status",
        "Notice Period",
        "Expected Compensation",
        "LinkedIn URL",
        "Portfolio URL",
        "Resume Drive Link / Type",
        "Resume Cloud Link",
        "Mission Notes"
      ]);
    }

    var formData = payload.formData || payload;
    var transmissionId = payload.transmissionId || ("HTGJ-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));
    var timestamp = payload.timestamp || new Date().toISOString();

    var resumeDriveLink = "Not Provided";

    // Handle File Upload to Google Drive without requiring candidate sign-in
    if (formData.resumeBase64 && formData.resumeFileName) {
      try {
        var base64Data = formData.resumeBase64.split(",")[1] || formData.resumeBase64;
        var decodedBytes = Utilities.base64Decode(base64Data);
        var mimeType = "application/octet-stream";
        if (formData.resumeFileName.toLowerCase().endsWith(".pdf")) {
          mimeType = "application/pdf";
        } else if (formData.resumeFileName.toLowerCase().endsWith(".docx")) {
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (formData.resumeFileName.toLowerCase().endsWith(".doc")) {
          mimeType = "application/msword";
        }
        
        var blob = Utilities.newBlob(decodedBytes, mimeType, "[" + transmissionId + "] " + formData.resumeFileName);

        // Get or create "Help to Get Job - Candidate Resumes" folder
        var folders = DriveApp.getFoldersByName("Help to Get Job - Resumes");
        var folder;
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder("Help to Get Job - Resumes");
        }

        var driveFile = folder.createFile(blob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        resumeDriveLink = driveFile.getUrl();
      } catch (fileErr) {
        resumeDriveLink = "Upload Error: " + fileErr.toString();
      }
    } else if (formData.resumeCloudLink) {
      resumeDriveLink = formData.resumeCloudLink;
    }

    // Append candidate dossier row to Google Sheet
    sheet.appendRow([
      transmissionId,
      timestamp,
      formData.fullName || "",
      formData.email || "",
      formData.phone || "",
      formData.location || "",
      formData.targetRole === "Other Engineering / Tech Discipline" ? (formData.targetRoleCustom || "Other") : (formData.targetRole || ""),
      formData.experienceLevel || "",
      formData.skills || "",
      formData.employmentStatus || "",
      formData.noticePeriod || "",
      formData.expectedCompensation || "",
      formData.linkedinUrl || "",
      formData.portfolioUrl || "",
      resumeDriveLink,
      formData.resumeCloudLink || "",
      formData.additionalNotes || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      transmissionId: transmissionId,
      resumeDriveLink: resumeDriveLink
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    system: "HELP TO GET JOB DISPATCH WEBHOOK",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
