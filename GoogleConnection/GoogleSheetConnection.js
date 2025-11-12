import { google } from "googleapis";

const googleConnect = async () => {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  console.log("✅ Connection to Google Sheets Successful");
  return sheets;
};

export default googleConnect;
