import { sheets } from "../app.js";
import { getSheets } from "../GoogleConnection/sheetsInstance.js";
import tokenUser from "../JWT/token.js";
import jwt from "jsonwebtoken"; // keep if tokenUser.js uses jwt


export const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone, image } = req.body;

    // ✅ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
        success: false,
        status: 400,
        body: {},
      });
    }

    const sheets = await getSheets();

    // ✅ Fetch existing users
    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A2:F",
    });

    const rows = getRows.data.values || [];
    const emailExists = rows.find((row) => row[1] === email);

    if (emailExists) {
      console.log("⚠️ Email already exists:", email);
      return res.status(400).json({
        message: "Email Already Exists",
        success: false,
        status: 400,
        body: {},
      });
    }

    // ✅ Create JWT Token using your helper
    const { token } = await tokenUser(email); // using email as id for Google Sheets case

    // ✅ Append new user to Google Sheets
    const timestamp = new Date().toLocaleString();
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A:G", // added G for token column
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [name, email, password, phone || "", image || "", timestamp, token],
        ],
      },
    });

    console.log("✅ User created:", email);

    // ✅ Masked response
    const maskedName = name.slice(0, 3) + "xx xxxx";
    const maskedEmail = email.slice(0, 3) + "xxxxxxx";
    const maskedPhone = phone ? phone.slice(0, 4) + "xxxx" : "N/A";

    return res.status(201).json({
      message: "User Created Successfully",
      status: 201,
      success: true,
      body: {
        name: maskedName,
        email: maskedEmail,
        phone: maskedPhone,
        token, // ✅ send token to frontend
      },
    });
  } catch (error) {
    console.log(error, "❌ Signup error");
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
      body: {},
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
        status: 400,
        body: {},
      });
    }

    const Sheets = await getSheets();

    // ✅ Fetch all users from Google Sheets
    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A2:F", // same range used for signup
    });

    const rows = getRows.data.values || [];

    // ✅ Find the user by email
    const user = rows.find((row) => row[1] === email);

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please sign up first.",
        success: false,
        status: 404,
        body: {},
      });
    }

    // user = [name, email, password, phone, image, timestamp]
    const storedPassword = user[2];

    // ✅ Compare passwords
    if (storedPassword !== password) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
        status: 401,
        body: {},
      });
    }

    // ✅ Successful login
    const timestamp = new Date().toLocaleString();

    console.log(`✅ User logged in: ${email} at ${timestamp}`);

    // ✅ Optional: you could log this in another sheet or same sheet (new column)

    return res.status(200).json({
      message: "Login successful",
      success: true,
      status: 200,
      body: {
        name: user[0],
        email: user[1],
        phone: user[3] || "N/A",
        image: user[4] || "",
        lastLogin: timestamp,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
      body: {},
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required to delete user",
        success: false,
        status: 400,
        body: {},
      });
    }

    const sheets = await getSheets();

    // ✅ Fetch all rows
    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A2:G", // include all columns (G = token)
    });

    let rows = getRows.data.values || [];

    // ✅ Find user by email
    const userIndex = rows.findIndex((row) => row[1] === email);

    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        status: 404,
        body: {},
      });
    }

    // ✅ Remove user
    rows.splice(userIndex, 1);

    // ✅ Clear old data from A2:G
    await sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A2:G",
    });

    // ✅ Rewrite remaining users back
    if (rows.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "Sheet1!A2",
        valueInputOption: "USER_ENTERED",
        resource: { values: rows },
      });
    }

    console.log(`✅ User deleted successfully: ${email}`);

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
      status: 200,
      body: { email },
    });
  } catch (error) {
    console.error("❌ Delete User Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
      body: {},
    });
  }
};

