import express from "express";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  createUser,
  deleteEmailOTPCode,
  deleteSmsOTPCode,
  getUserByPhone,
  saveEmailOTPCode,
  saveSmsOTPCode,
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

const loginSMS = async (req: express.Request, res: express.Response) => {
  try {
    const { phone, code } = req.body;

    if (!phone) {
      return responseHandler.notfound(res);
    }

    if (!validatePhoneNumber(phone)) {
      return responseHandler.badrequest(res, "Invalid phone number");
    }

    const userSnapshot = await getDocs(
      query(
        collection(db, "users"),
        where("phone", "==", formatPhoneNumber(phone))
      )
    );

    let user = userSnapshot.docs[0]?.data();
    if (userSnapshot.empty) {
      const userData: Omit<User, "id"> = {
        name: "",
        email: "",
        role: "student",
        phone,
        created_at: new Date(),
        updated_at: new Date(),
        access_code: "",
        code_created_at: new Date(),
      };

      const result = await createUser(userData);

      if (!result.success) {
        return responseHandler.badrequest(res, "Failed to create user");
      }

      user = userData;
    }

    if (code) {
      const result = await validateSmsOTPCode(formatPhoneNumber(phone), code);

      if (!result.success) {
        return responseHandler.badrequest(
          res,
          result.error || "Invalid access code"
        );
      }

      await deleteSmsOTPCode(formatPhoneNumber(phone));
    } else {
      const accessCode = generateAccessCode();

      const success = await saveSmsOTPCode(
        formatPhoneNumber(phone),
        accessCode
      );

      if (!success) {
        return responseHandler.badrequest(res, "Failed to save access code");
      }

      await sendSmsVerificationCode(formatPhoneNumber(phone), accessCode);

      return responseHandler.ok(res, {
        phone: formatPhoneNumber(phone),
        msg: "Verification code sent to your phone",
      });
    }

    responseHandler.ok(res, {
      role: user?.role,
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
      return responseHandler.notfound(res);
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
        email: email,
        msg: "Verification code sent to your email",
      });
    }

    responseHandler.ok(res, {
      role: user?.role,
      msg: "Login successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    responseHandler.error(res);
  }
};

const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return responseHandler.badrequest(res, "All fields are required");
    }

    const existingUser = await getUserByPhone(phone);
    if (existingUser) {
      return responseHandler.badrequest(res, "User already exists");
    }

    const userData: Omit<User, "id"> = {
      name,
      phone,
      email,
      role: "student",
      created_at: new Date(),
      updated_at: new Date(),
      access_code: "",
      code_created_at: new Date(),
    };

    await createUser(userData);

    responseHandler.ok(res, {
      success: true,
      msg: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    responseHandler.error(res);
  }
};

export default {
  loginSMS,
  loginEmail,
  register,
};
