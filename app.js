import express from "express";
import dotenv from "dotenv";
import googleConnect from "./GoogleConnection/GoogleSheetConnection.js";
import userRouter from "./Router/UserRouter.js";
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 1122;

let sheets;

// 🔹 Connect to Google Sheets when the server starts
(async () => {
  try {
    sheets = await googleConnect();
    console.log("✅ Connected to Google Sheets!");
  } catch (error) {
    console.error(error,"error");
  }
})();

app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});

export { sheets };
