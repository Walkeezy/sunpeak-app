import { google } from "googleapis";

export type WebcamData = Webcam[];

export type Webcam = {
  name: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  url: string;
  link: string;
  panorama: boolean;
};

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
    const data = [];

    if (rows.length) {
      rows.shift(); // remove header row
      rows.forEach((row) => {
        const latitude = parseFloat(row[3]);
        const longitude = parseFloat(row[4]);
        const url = row[5];
        if (latitude && longitude && url) {
          data.push({
            name: row[0],
            city: row[1],
            region: row[2],
            latitude,
            longitude,
            url,
            link: row[6] === "" ? url : row[6],
            panorama: row[7] === "TRUE",
          });
        }
      });
    }

    return data;
  } catch (err) {
    console.log(err);
  }
}
