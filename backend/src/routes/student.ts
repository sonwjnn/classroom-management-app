import express from "express";

import studentController from "../controllers/student";
import requestHandler from "../handlers/request-handler";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

export default (): express.Router => {
  router.get(
    "/get-my-lessons",
    isAuthenticated,
    requestHandler.validate,
    studentController.getMyLessons
  );
  router.patch(
    "/mark-lesson-done/:lessonId",
    isAuthenticated,
    requestHandler.validate,
    studentController.markLessonDone
  );
  router.post(
    "/undo-lesson",
    isAuthenticated,
    requestHandler.validate,
    studentController.undoLesson
  );
  router.get(
    "/get-student-profile",
    isAuthenticated,
    requestHandler.validate,
    studentController.getStudentProfile
  );
  router.get(
    "/get-profile-by-email",
    isAuthenticated,
    requestHandler.validate,
    studentController.getProfileByEmail
  );
  router.patch(
    "/edit-student-profile",
    isAuthenticated,
    requestHandler.validate,
    studentController.editStudentProfile
  );

  router.get(
    "/get-messages",
    isAuthenticated,
    requestHandler.validate,
    studentController.getMessages
  );

  router.post(
    "/setup-account",
    requestHandler.validate,
    studentController.setupAccount
  );

  return router;
};
