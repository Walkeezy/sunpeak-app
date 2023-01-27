import { google } from "googleapis";

export type WebcamData = any[];

export async function getWebcamData(): Promise<WebcamData> {
  try {
    const target = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      target
    );

    const sheets = google.sheets({ version: "v4", auth: jwt });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Webcams",
    });

    const rows = response.data.values;

    if (rows.length) {
      rows.shift(); // remove header row
    }

    return rows;
  } catch (err) {
    console.log(err);
  }
}
