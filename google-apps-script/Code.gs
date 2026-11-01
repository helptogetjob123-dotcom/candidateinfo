/**
 * HELP TO GET JOB // GOOGLE APPS SCRIPT WEBHOOK RECEIVER
 * 
 * Configured with the exact 11 fields from your Google Form:
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

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var payload;
    
    if (e.postData.type === "application/json") {
      payload = JSON.parse(rawData);
    } else {
      payload = e.parameter;
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure header row exists with the exact form questions
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Transmission ID",
        "Timestamp (UTC)",
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
      ]);
    }

    var formData = payload.formData || payload;
    var transmissionId = payload.transmissionId || ("HTGJ-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));
    var timestamp = payload.timestamp || new Date().toISOString();

    var resumeDriveLink = "Not Provided";
    if (formData.resumeBase64 && formData.resumeFileName) {
      try {
        var base64Data = formData.resumeBase64.split(",")[1] || formData.resumeBase64;
        var decodedBytes = Utilities.base64Decode(base64Data);
        var mimeType = "application/pdf";
        if (formData.resumeFileName.toLowerCase().endsWith(".docx")) {
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (formData.resumeFileName.toLowerCase().endsWith(".doc")) {
          mimeType = "application/msword";
        }
        var blob = Utilities.newBlob(decodedBytes, mimeType, "[" + transmissionId + "] " + formData.resumeFileName);

        var folders = DriveApp.getFoldersByName("Help to Get Job - Resumes");
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder("Help to Get Job - Resumes");
        var driveFile = folder.createFile(blob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        resumeDriveLink = driveFile.getUrl();
      } catch (fileErr) {
        resumeDriveLink = "Upload Error: " + fileErr.toString();
      }
    } else if (formData.resumeCloudLink) {
      resumeDriveLink = formData.resumeCloudLink;
    }

    var coverLetterInfo = formData.coverLetterFileName ? ("File: " + formData.coverLetterFileName) : (formData.coverLetterText || "N/A");

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
    system: "helptogetjob webhook",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
