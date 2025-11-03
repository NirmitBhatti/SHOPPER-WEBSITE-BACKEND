import express from "express";
import { deleteUser, loginUser, signupUser } from "../Controller/UserController.js";

const userRouter = express.Router();

userRouter.post("/signup",signupUser);
userRouter.post("/login", loginUser)
userRouter.delete("/delete", deleteUser);

export default userRouter;
