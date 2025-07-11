import express from "express";

import studentController from "../controllers/student";
import requestHandler from "../handlers/request-handler";

const router = express.Router({ mergeParams: true });

export default (): express.Router => {
  router.get(
    "/get-my-lessons",
    requestHandler.validate,
    studentController.getMyLessons
  );
  router.get(
    "/mark-lesson-done",
    requestHandler.validate,
    studentController.markLessonDone
  );
  router.post(
    "/undo-lesson",
    requestHandler.validate,
    studentController.undoLesson
  );
  router.get(
    "/get-student-profile",
    requestHandler.validate,
    studentController.getStudentProfile
  );
  router.patch(
    "/edit-student-profile",
    requestHandler.validate,
    studentController.editStudentProfile
  );

  router.get(
    "/get-messages",
    requestHandler.validate,
    studentController.getMessages
  );

  return router;
};
