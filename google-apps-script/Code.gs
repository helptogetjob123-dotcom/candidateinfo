/**
 * HELP TO GET JOB // GOOGLE APPS SCRIPT WEBHOOK & DRIVE BACKEND
 * 
 * Instructions:
 * 1. Open your Google Sheet (where responses should go):
 *    https://docs.google.com/spreadsheets/d/1UDzaOSSB02uK3JT59VMg85oiQORxRUNt0_vMh7vCeWE/edit
 * 2. Click Extensions > Apps Script.
 * 3. Replace all existing code with this file and save (Cmd+S / Ctrl+S).
 * 4. To deploy updates: Click Deploy > Manage deployments > Click Edit (pencil icon) > Version: New version > Deploy.
 * 5. (Bonus) To automatically fix past rows where resume links were missing:
 *    In the Apps Script editor, select "fixMissingResumeLinks" from the function dropdown and click "Run".
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
        
        var cleanCandidateName = (formData.fullName || "Candidate").replace(/[^a-zA-Z0-9_-]/g, "_");
        var destinationFileName = "[" + transmissionId + "] " + cleanCandidateName + "_" + formData.resumeFileName;
        
        var blob = Utilities.newBlob(decodedBytes, mimeType, destinationFileName);
        var driveFile = folder.createFile(blob);
        
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
    
    // Default headers if spreadsheet is completely empty
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

    // Read existing headers from row 1
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // Check if Education column exists in the sheet; if not, safely append Education at the end
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

    // Robust, Priority-based Column Mapping:
    // Guarantees zero collisions between "Updated Resume" (which contains "date") and "Timestamp",
    // and zero collisions between "insta ID" (which contains "id") and "Transmission ID".
    var contextData = {
      transmissionId: transmissionId,
      timestamp: timestamp,
      formData: formData,
      resumeDriveLink: resumeDriveLink,
      coverLetterInfo: coverLetterInfo
    };

    var rowData = new Array(currentHeaders.length);
    for (var i = 0; i < currentHeaders.length; i++) {
      rowData[i] = resolveColumnValue(currentHeaders[i], contextData);
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

/**
 * Priority-based Column Resolver
 * Prevents substring bugs like "updated" matching "date" or "insta id" matching "id".
 */
function resolveColumnValue(headerText, data) {
  var h = String(headerText || "").trim().toLowerCase();

  // 1. Resume (Check FIRST so "updated" in "Updated Resume" never matches "date"!)
  if (h.indexOf("resume") > -1 || h.indexOf("drive link") > -1 || h.indexOf("cv") > -1) {
    return data.resumeDriveLink;
  }

  // 2. Cover Letter
  if (h.indexOf("cover") > -1) {
    return data.coverLetterInfo;
  }

  // 3. Instagram ID (Check before Transmission ID so "insta id" matches Instagram!)
  if (h.indexOf("insta") > -1 || h.indexOf("instagram") > -1) {
    return data.formData.instagramId || "";
  }

  // 4. Transmission / Reference ID
  if (h.indexOf("transmission") > -1 || h.indexOf("reference") > -1 || h === "id" || h === "app id") {
    return data.transmissionId;
  }

  // 5. Years of experience (Check before general "experience")
  if (h.indexOf("years") > -1 || h.indexOf("if experienced") > -1) {
    return data.formData.yearsOfExperience || "";
  }

  // 6. Experience Level
  if (h.indexOf("experience") > -1) {
    return data.formData.experience || "";
  }

  // 7. Preferred Job Role (Check before general "job")
  if (h.indexOf("role") > -1 || h.indexOf("job") > -1) {
    return data.formData.preferredJobRole || "";
  }

  // 8. Preferred Location (Check before general "state")
  if (h.indexOf("location") > -1 || h.indexOf("preferred") > -1 || h.indexOf("preffered") > -1 || h.indexOf("city") > -1) {
    return data.formData.preferredLocation || "";
  }

  // 9. State
  if (h.indexOf("state") > -1) {
    return data.formData.state || "";
  }

  // 10. Education / Qualification
  if (h.indexOf("education") > -1 || h.indexOf("qualification") > -1 || h.indexOf("degree") > -1) {
    return data.formData.education || "";
  }

  // 11. Sector / Industry
  if (h.indexOf("sector") > -1 || h.indexOf("industry") > -1) {
    return data.formData.sector || "";
  }

  // 12. Email
  if (h.indexOf("mail") > -1) {
    return data.formData.email || "";
  }

  // 13. Full Name
  if (h.indexOf("name") > -1) {
    return data.formData.fullName || "";
  }

  // 14. Timestamp / Submission Date (Must exclude "update" to never match "updated resume")
  if (h.indexOf("update") === -1 && (h.indexOf("time") > -1 || h.indexOf("date") > -1 || h.indexOf("submitted") > -1)) {
    return data.timestamp;
  }

  return "";
}

/**
 * REPAIR UTILITY: Automatically restores Google Drive resume links into your Google Sheet!
 * 
 * Run this function once from the Apps Script editor toolbar:
 * Select "fixMissingResumeLinks" in the dropdown -> Click "Run".
 * It will find all uploaded resume files in your Google Drive folder and match them
 * to the candidate rows in your Google Sheet by Transmission ID!
 */
function fixMissingResumeLinks() {
  var spreadsheet = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheets()[0];
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2) {
    Logger.log("No data rows found to repair.");
    return "No data rows found to repair.";
  }

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var resumeColIdx = -1;
  var transColIdx = -1;

  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c] || "").trim().toLowerCase();
    if (h.indexOf("resume") > -1 || h.indexOf("drive link") > -1) {
      resumeColIdx = c + 1; // 1-indexed for getRange
    }
    if (h.indexOf("transmission") > -1) {
      transColIdx = c + 1;
    }
  }

  if (resumeColIdx === -1) {
    Logger.log("Could not find Resume column.");
    return "Could not find Resume column.";
  }

  // Index all uploaded files in Google Drive by Transmission ID
  var folder = DriveApp.getFolderById(TARGET_FOLDER_ID);
  var files = folder.getFiles();
  var fileMap = {};

  while (files.hasNext()) {
    var file = files.next();
    var name = file.getName();
    // File format: [HTGJ-2026-XXXX] ...
    var match = name.match(/\[(HTGJ-[^\]]+)\]/);
    if (match && match[1]) {
      fileMap[match[1]] = file.getUrl();
    }
  }

  var fixedCount = 0;
  var rowValues = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  for (var r = 0; r < rowValues.length; r++) {
    var currentRow = rowValues[r];
    var currentResumeVal = String(currentRow[resumeColIdx - 1] || "").trim();

    // If the cell does not have a valid http link (e.g. has a timestamp or "Not Provided")
    if (!currentResumeVal.startsWith("http")) {
      // Find the HTGJ- transmission ID in this row
      var rowTransId = "";
      if (transColIdx > -1 && String(currentRow[transColIdx - 1] || "").startsWith("HTGJ-")) {
        rowTransId = String(currentRow[transColIdx - 1]).trim();
      }

      if (!rowTransId) {
        for (var k = 0; k < currentRow.length; k++) {
          var cellText = String(currentRow[k] || "").trim();
          if (cellText.indexOf("HTGJ-") > -1) {
            var m = cellText.match(/HTGJ-\d{4}-\d+/);
            if (m) {
              rowTransId = m[0];
              break;
            }
          }
        }
      }

      if (rowTransId && fileMap[rowTransId]) {
        sheet.getRange(r + 2, resumeColIdx).setValue(fileMap[rowTransId]);
        fixedCount++;
        Logger.log("Row " + (r + 2) + " (" + rowTransId + ") -> Restored Drive link: " + fileMap[rowTransId]);
      }
    }
  }

  var msg = "SUCCESS: Repaired " + fixedCount + " candidate rows with their Google Drive resume links!";
  Logger.log(msg);
  return msg;
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

function getOrCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

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

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
