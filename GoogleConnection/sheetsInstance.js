let sheetsInstance = null;
import googleConnect from "./GoogleSheetConnection.js";
export const getSheets = async () => {
  if (!sheetsInstance) {
    sheetsInstance = await googleConnect();
    console.log("✅ Sheets instance ready");
  }
  return sheetsInstance;
};
