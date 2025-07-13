import express from "express";

import authController from "../controllers/auth";
import requestHandler from "../handlers/request-handler";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

export default (): express.Router => {
  router.post("/sms-login", requestHandler.validate, authController.loginSMS);
  router.post(
    "/email-login",
    requestHandler.validate,
    authController.loginEmail
  );
  router.get(
    "/get-role",
    isAuthenticated,
    requestHandler.validate,
    authController.getRole
  );
  router.get(
    "/current",
    isAuthenticated,
    requestHandler.validate,
    authController.getCurrentUser
  );

  return router;
};
