/**
 * HELP TO GET JOB // GOOGLE APPS SCRIPT WEBHOOK RECEIVER
 * 
 * Matches the exact fields from your Google Form:
 * 1. Name:
 * 2. E-mail
 * 3. insta ID
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
    
    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Transmission ID",
        "Timestamp (UTC)",
        "Name:",
        "E-mail",
        "insta ID"
      ]);
    }

    var formData = payload.formData || payload;
    var transmissionId = payload.transmissionId || ("HTGJ-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));
    var timestamp = payload.timestamp || new Date().toISOString();

    sheet.appendRow([
      transmissionId,
      timestamp,
      formData.fullName || "",
      formData.email || "",
      formData.instagramId || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      transmissionId: transmissionId
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
