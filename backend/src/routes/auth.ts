import express from "express";

import authController from "../controllers/auth";
import requestHandler from "../handlers/request-handler";

const router = express.Router({ mergeParams: true });

export default (): express.Router => {
  router.post("/sms-login", requestHandler.validate, authController.loginSMS);
  router.post(
    "/email-login",
    requestHandler.validate,
    authController.loginEmail
  );
  router.post("/register", requestHandler.validate, authController.register);

  return router;
};
