import express from "express";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  createUser,
  deleteEmailOTPCode,
  deleteSmsOTPCode,
  getUserByPhone,
  saveEmailOTPCode,
  saveSmsOTPCode,
  validateAccountSetupTokenFireBase,
  validateEmailOTPCode,
  validateSmsOTPCode,
} from "../lib/firebase";
import responseHandler from "../handlers/response-handler";
import { db } from "../lib/firebase";
import { validateEmail } from "../lib/mail";
import { sendEmailVerificationCode } from "../lib/mail";
import { validatePhoneNumber, sendSmsVerificationCode } from "../lib/twilio";
import { User } from "../types";
import { formatPhoneNumber, generateAccessCode } from "../utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginSMS = async (req: express.Request, res: express.Response) => {
  try {
    const { phone, code } = req.body;

    if (!phone) {
      return responseHandler.badrequest(res, "Phone number is required");
    }

    if (!validatePhoneNumber(phone)) {
      return responseHandler.badrequest(res, "Invalid phone number");
    }

    const userSnapshot = await getDocs(
      query(collection(db, "users"), where("phone", "==", phone))
    );

    if (userSnapshot.empty) {
      return responseHandler.notfound(res, "User not found");
    }

    const user = userSnapshot.docs[0]?.data() as User;

    if (code) {
      const result = await validateSmsOTPCode(phone, code);

      if (!result.success) {
        return responseHandler.badrequest(
          res,
          result.error || "Invalid access code"
        );
      }

      await deleteSmsOTPCode(phone);
    } else {
      const accessCode = generateAccessCode();

      const success = await saveSmsOTPCode(phone, accessCode);

      if (!success) {
        return responseHandler.badrequest(res, "Failed to save access code");
      }

      await sendSmsVerificationCode(phone, accessCode);

      return responseHandler.ok(res, {
        msg: "Verification code sent to your phone",
      });
    }

    const token = generateJWT(user);

    responseHandler.ok(res, {
      accessToken: token,
      user,
      msg: "Login successfully",
    });
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

const loginEmail = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, code } = req.body;

    if (!email || !password) {
      return responseHandler.badrequest(res, "Email and password are required");
    }

    if (!validateEmail(email)) {
      return responseHandler.badrequest(res, "Invalid email");
    }

    const userSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );

    let user = userSnapshot.docs[0]?.data() as User;
    if (userSnapshot.empty) {
      return responseHandler.notfound(res, "User not found");
    }

    if (!user.password) {
      return responseHandler.badrequest(
        res,
        "User has no password, please update your profile"
      );
    }

    if (code) {
      const result = await validateEmailOTPCode(email, code);

      if (!result.success) {
        return responseHandler.badrequest(
          res,
          result.error || "Invalid access code"
        );
      }

      await deleteEmailOTPCode(email);
    } else {
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
        return responseHandler.badrequest(res, "Invalid password");
      }

      const accessCode = generateAccessCode();

      const success = await saveEmailOTPCode(email, accessCode);

      if (!success) {
        return responseHandler.badrequest(res, "Failed to save access code");
      }

      await sendEmailVerificationCode(email, accessCode);

      return responseHandler.ok(res, {
        msg: "Verification code sent to your email",
      });
    }

    const token = generateJWT(user);

    responseHandler.ok(res, {
      accessToken: token,
      user,
      msg: "Login successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    responseHandler.error(res);
  }
};

const getRole = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user) {
      return responseHandler.unauthorized(res);
    }

    responseHandler.ok(res, {
      role: req.user.role,
    });
  } catch (error) {
    console.error("Error getting role:", error);
    responseHandler.error(res);
  }
};

const getCurrentUser = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user) {
      return responseHandler.unauthorized(res);
    }

    const { password, ...userInfo } = req.user;

    responseHandler.ok(res, {
      user: userInfo,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return responseHandler.error(res);
  }
};

const generateJWT = (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "24h" });
};

export default {
  loginSMS,
  loginEmail,
  getRole,
  getCurrentUser,
};
