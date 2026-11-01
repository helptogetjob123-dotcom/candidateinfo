/**
 * HELP TO GET JOB // GOOGLE APPS SCRIPT WEBHOOK & DRIVE BACKEND
 * 
 * Instructions:
 * 1. Open your Google Sheet (where responses should go).
 * 2. Click Extensions > Apps Script.
 * 3. Replace all existing code with this file.
 * 4. (Optional) Paste your Google Drive Folder ID in TARGET_FOLDER_ID below.
 *    If left blank, it will automatically create a folder named "Help to Get Job - Resumes" in your Drive.
 * 5. Click Deploy > New deployment > Web app:
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone
 * 6. Copy the Web app URL and paste it into src/config/formConfig.ts.
 */

// Google Sheet ID for candidate data rows:
// https://docs.google.com/spreadsheets/d/1UDzaOSSB02uK3JT59VMg85oiQORxRUNt0_vMh7vCeWE
var SPREADSHEET_ID = "1UDzaOSSB02uK3JT59VMg85oiQORxRUNt0_vMh7vCeWE";

// Google Drive Folder ID for candidate resume uploads:
// https://drive.google.com/drive/folders/1CLChOttzhBMScvJbRbx2fO6vVsYQZuRj
var TARGET_FOLDER_ID = "1CLChOttzhBMScvJbRbx2fO6vVsYQZuRj";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ status: "error", message: "No post data received" });
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      payload = e.parameter || {};
    }

    var formData = payload.formData || payload;
    var transmissionId = payload.transmissionId || ("HTGJ-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));
    var timestamp = payload.timestamp || new Date().toISOString();

    // 1. Resolve Target Google Drive Folder
    var folder;
    if (TARGET_FOLDER_ID && TARGET_FOLDER_ID.trim() !== "") {
      try {
        folder = DriveApp.getFolderById(TARGET_FOLDER_ID.trim());
      } catch (fErr) {
        // Fallback to name search or auto-create if ID is invalid
        folder = getOrCreateFolder("Help to Get Job - Resumes");
      }
    } else {
      folder = getOrCreateFolder("Help to Get Job - Resumes");
    }

    // 2. Process Resume File & Save to Google Drive
    var resumeDriveLink = "Not Provided";
    if (formData.resumeBase64 && formData.resumeFileName) {
      try {
        var base64Data = formData.resumeBase64;
        if (base64Data.indexOf(",") > -1) {
          base64Data = base64Data.split(",")[1];
        }
        var decodedBytes = Utilities.base64Decode(base64Data);
        var mimeType = getMimeType(formData.resumeFileName);
        
        // Clean professional file naming: [HTGJ-2025-XXXX] CandidateName_Resume.pdf
        var cleanCandidateName = (formData.fullName || "Candidate").replace(/[^a-zA-Z0-9_-]/g, "_");
        var destinationFileName = "[" + transmissionId + "] " + cleanCandidateName + "_" + formData.resumeFileName;
        
        var blob = Utilities.newBlob(decodedBytes, mimeType, destinationFileName);
        var driveFile = folder.createFile(blob);
        
        // Ensure the file is viewable by recruiters & mentors who have the link
        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (permErr) {}

        resumeDriveLink = driveFile.getUrl();
      } catch (fileErr) {
        resumeDriveLink = "Upload Error: " + fileErr.toString();
      }
    } else if (formData.resumeCloudLink) {
      resumeDriveLink = formData.resumeCloudLink;
    }

    // 3. Process Optional Cover Letter File or Text
    var coverLetterInfo = "Not Provided";
    if (formData.coverLetterBase64 && formData.coverLetterFileName) {
      try {
        var clBase64 = formData.coverLetterBase64;
        if (clBase64.indexOf(",") > -1) {
          clBase64 = clBase64.split(",")[1];
        }
        var clBytes = Utilities.base64Decode(clBase64);
        var clMime = getMimeType(formData.coverLetterFileName);
        var clFileName = "[" + transmissionId + "] CoverLetter_" + formData.coverLetterFileName;
        var clBlob = Utilities.newBlob(clBytes, clMime, clFileName);
        var clFile = folder.createFile(clBlob);
        try {
          clFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (clPermErr) {}
        coverLetterInfo = clFile.getUrl();
      } catch (clErr) {
        coverLetterInfo = "Upload Error: " + clErr.toString();
      }
    } else if (formData.coverLetterText && formData.coverLetterText.trim() !== "") {
      coverLetterInfo = formData.coverLetterText.trim();
    }

    // 4. Resolve Target Google Sheet
    var spreadsheet;
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      try {
        spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
      } catch (ssErr) {
        spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      }
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    var sheet = spreadsheet.getSheets()[0];
    
    // Ensure header row exists with the exact form questions if empty
    if (sheet.getLastRow() === 0) {
      var headerRow = [
        "Transmission ID",
        "Timestamp",
        "Name:",
        "E-mail",
        "insta ID",
        "State",
        "Experience",
        "If Experienced Mention the Years of experience",
        "Preffered Location",
        "Sector",
        "Preffered Job Role",
        "Updated Resume (Drive Link)",
        "Cover letter"
      ];
      sheet.appendRow(headerRow);
      sheet.getRange(1, 1, 1, headerRow.length).setFontWeight("bold").setBackground("#1F293D").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      transmissionId,
      timestamp,
      formData.fullName || "",
      formData.email || "",
      formData.instagramId || "",
      formData.state || "",
      formData.experience || "",
      formData.yearsOfExperience || "",
      formData.preferredLocation || "",
      formData.sector || "",
      formData.preferredJobRole || "",
      resumeDriveLink,
      coverLetterInfo
    ]);

    return createJsonResponse({
      status: "success",
      transmissionId: transmissionId,
      resumeDriveLink: resumeDriveLink,
      message: "Application recorded successfully in Google Sheet and Google Drive"
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

function doGet(e) {
  return createJsonResponse({
    status: "online",
    system: "Help to Get Job - Candidate Intake Webhook",
    spreadsheetConfigured: SPREADSHEET_ID ? "Connected (1UDzaOSSB02uK3JT59VMg85oiQORxRUNt0_vMh7vCeWE)" : "Active Spreadsheet",
    folderIdConfigured: TARGET_FOLDER_ID ? "Connected (1CLChOttzhBMScvJbRbx2fO6vVsYQZuRj)" : "Auto-create Mode",
    timestamp: new Date().toISOString()
  });
}

// Utility: Helper to get or create folder by name
function getOrCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

// Utility: MIME Type resolver
function getMimeType(fileName) {
  if (!fileName) return "application/octet-stream";
  var lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (lower.endsWith(".doc")) return "application/msword";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

// Utility: JSON response formatter with permissive headers
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
