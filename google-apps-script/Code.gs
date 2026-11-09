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
    
    // Ensure header row exists with all columns if empty
    var defaultHeaders = [
      "Transmission ID",
      "Timestamp",
      "Name:",
      "E-mail",
      "insta ID",
      "Education",
      "State",
      "Experience",
      "If Experienced Mention the Years of experience",
      "Preffered Location",
      "Sector",
      "Preffered Job Role",
      "Updated Resume (Drive Link)",
      "Cover letter"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(defaultHeaders);
      sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight("bold").setBackground("#1F293D").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Read existing headers from row 1 to prevent breaking existing entries/columns
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // Check if Education column exists in the sheet; if not, safely append Education at the end
    // so no existing column alignments or previous candidate entries are shifted or displaced
    var hasEducation = false;
    for (var c = 0; c < currentHeaders.length; c++) {
      var hText = String(currentHeaders[c] || "").trim().toLowerCase();
      if (hText.indexOf("education") > -1 || hText.indexOf("qualification") > -1 || hText.indexOf("degree") > -1) {
        hasEducation = true;
        break;
      }
    }

    if (!hasEducation) {
      var newColIdx = currentHeaders.length + 1;
      sheet.getRange(1, newColIdx).setValue("Education")
        .setFontWeight("bold")
        .setBackground("#1F293D")
        .setFontColor("#FFFFFF");
      currentHeaders.push("Education");
    }

    // Dynamic header-matching row builder:
    // This guarantees that regardless of column order or presence of older entries,
    // every value is written into its matching column header without shifting existing data!
    var rowData = new Array(currentHeaders.length);
    for (var i = 0; i < currentHeaders.length; i++) {
      var h = String(currentHeaders[i] || "").trim().toLowerCase();
      
      if (matchesHeader(h, ["transmission id", "transmissionid", "id"])) {
        rowData[i] = transmissionId;
      } else if (matchesHeader(h, ["timestamp", "date", "time"])) {
        rowData[i] = timestamp;
      } else if (matchesHeader(h, ["name:", "name", "full name", "candidate name"])) {
        rowData[i] = formData.fullName || "";
      } else if (matchesHeader(h, ["e-mail", "email", "email address"])) {
        rowData[i] = formData.email || "";
      } else if (matchesHeader(h, ["insta id", "instagram id", "instagram handle", "instagram"])) {
        rowData[i] = formData.instagramId || "";
      } else if (matchesHeader(h, ["education", "qualification", "degree"])) {
        rowData[i] = formData.education || "";
      } else if (matchesHeader(h, ["state", "current state", "location (state)"])) {
        rowData[i] = formData.state || "";
      } else if (matchesHeader(h, ["if experienced mention the years of experience", "years of experience"])) {
        rowData[i] = formData.yearsOfExperience || "";
      } else if (matchesHeader(h, ["experience"])) {
        rowData[i] = formData.experience || "";
      } else if (matchesHeader(h, ["preffered location", "preferred location", "location"])) {
        rowData[i] = formData.preferredLocation || "";
      } else if (matchesHeader(h, ["sector", "industry"])) {
        rowData[i] = formData.sector || "";
      } else if (matchesHeader(h, ["preffered job role", "preferred job role", "job role", "role"])) {
        rowData[i] = formData.preferredJobRole || "";
      } else if (matchesHeader(h, ["updated resume", "resume", "drive link"])) {
        rowData[i] = resumeDriveLink;
      } else if (matchesHeader(h, ["cover letter", "coverletter"])) {
        rowData[i] = coverLetterInfo;
      } else {
        rowData[i] = "";
      }
    }

    sheet.appendRow(rowData);

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

// Utility: Match header helper against string variants
function matchesHeader(headerText, variants) {
  var clean = String(headerText || "").trim().toLowerCase();
  for (var i = 0; i < variants.length; i++) {
    if (clean === variants[i] || clean.indexOf(variants[i]) > -1) {
      return true;
    }
  }
  return false;
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
