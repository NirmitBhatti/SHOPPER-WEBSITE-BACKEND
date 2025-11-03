import { google } from "googleapis";

const googleConnect = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();

  const sheets = google.sheets({ version: "v4", auth: client });

  console.log("Connection to  Google Sheets Successful");
  return sheets;
};
export default googleConnect;
