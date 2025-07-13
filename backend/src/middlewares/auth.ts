import express from "express";
import responseHandler from "../handlers/response-handler";
import { User } from "../types";
import { query, where, getDocs } from "firebase/firestore";
import jwt from "jsonwebtoken";
import merge from "lodash.merge";
import { userCollection } from "../lib/firebase";
interface JWTPayload {
  id: string;
  email?: string;
  phone?: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responseHandler.unauthorized(res);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "") as JWTPayload;
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    let userSnapshot;
    if (decoded.id) {
      userSnapshot = await getDocs(
        query(userCollection, where("id", "==", decoded.id))
      );
    }

    if (!userSnapshot || userSnapshot.empty) {
      if (decoded.email) {
        userSnapshot = await getDocs(
          query(userCollection, where("email", "==", decoded.email))
        );
      } else if (decoded.phone) {
        userSnapshot = await getDocs(
          query(userCollection, where("phone", "==", decoded.phone))
        );
      }
    }

    if (!userSnapshot || userSnapshot.empty) {
      return responseHandler.notfound(res, "User not found");
    }

    const existingUser = userSnapshot.docs[0]?.data() as User;

    if (!existingUser) {
      return responseHandler.notfound(res, "User not found");
    }

    if (existingUser.status === "inactive") {
      return responseHandler.badrequest(res, "Account is disabled");
    }

    merge(req, { user: existingUser });

    return next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return responseHandler.error(res);
  }
};
