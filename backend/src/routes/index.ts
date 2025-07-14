import express from "express";

import auth from "./auth";
import student from "./student";
import instructor from "./instructor";
import message from "./message";

const router = express.Router();

export default (): express.Router => {
  router.use("/api/auth", auth());
  router.use("/api/students", student());
  router.use("/api/instructors", instructor());
  router.use("/api/chat", message());

  return router;
};
