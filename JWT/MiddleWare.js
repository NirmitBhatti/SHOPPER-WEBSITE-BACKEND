// import jwt from "jsonwebtoken";
// import userModel from "../Schema/UserSchema.js";

// const middleWare = async (req, res, next) => {
//   try {
//     const header = req.headers.authorization;
//     if (!header) {
//       return res.status(401).json({
//         message: "Authorization header missing",
//         success: false,
//       });
//     }

//     const token = header.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({
//         message: "Token missing",
//         success: false,
//       });
//     }

//     const decoded = jwt.verify(token, process.env.SecretKey);
//     console.log(decoded, "Decoded token");

//     const user = await userModel.findById(decoded.id);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         success: false,
//       });
//     }

//     // Optional: only if you store tokens in DB
//     // if (user.token !== token) {
//     //   return res.status(403).json({
//     //     message: "Invalid token or expired",
//     //     success: false,
//     //   });
//     // }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error, "Token error");
//     return res.status(403).json({
//       message: "Invalid or expired token",
//       success: false,
//     });
//   }
// };

// export default middleWare;
