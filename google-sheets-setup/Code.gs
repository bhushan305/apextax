/**
 * Apex Tax Solutions — Form → Google Sheet webhook
 *
 * SETUP:
 * 1. Create a new Google Sheet (name the first sheet "Leads")
 * 2. Row 1 headers are auto-created on first submission, or add them manually:
 *    Timestamp | First Name | Last Name | Email | Service Interest | Message | Source | Stage | Owner | Next Step | Notes
 * 3. Open Extensions → Apps Script, paste this file, save
 * 4. Deploy → New deployment → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy the Web App URL and paste it into website/src/config.js as GOOGLE_SCRIPT_URL
 * 6. Re-deploy the Astro site (push to GitHub → Netlify auto-deploys)
 */

var SHEET_ID = "1nyy9Z7t8CM2AvV18QMid1AKVYZSWgq3pBtlYV9vCiZg";
var SHEET_NAME = "Leads";
var HEADERS = ["Timestamp","First Name","Last Name","Email","Service Interest","Message","Source","Stage","Owner","Next Step","Notes"];

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.getActiveSheet();
      sheet.setName(SHEET_NAME);
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.first_name        || "",
      data.last_name         || "",
      data.email             || "",
      data.service_interest  || "",
      data.message           || "",
      data.source            || "website",
      "New",                            // default stage
      "",                               // owner (assign manually)
      "Review & respond within 1 day",  // default next step
      ""                                // notes
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* Optional: test GET so you can verify the URL works in a browser */
function doGet() {
  return ContentService
    .createTextOutput("Apex Tax Solutions webhook is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}
