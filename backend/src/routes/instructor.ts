import express from "express";

import instructorController from "../controllers/instructor";
import requestHandler from "../handlers/request-handler";

const router = express.Router({ mergeParams: true });

export default (): express.Router => {
  router.post(
    "/add-student",
    requestHandler.validate,
    instructorController.addStudent
  );
  router.post(
    "/assign-lesson",
    requestHandler.validate,
    instructorController.assignLesson
  );
  router.get(
    "/get-all-students",
    requestHandler.validate,
    instructorController.getAllStudents
  );
  router.get(
    "/get-student-with-lessons/:phone",
    requestHandler.validate,
    instructorController.getStudentWithLessonsByPhone
  );
  router.patch(
    "/edit-student/:phone",
    requestHandler.validate,
    instructorController.editStudentByPhone
  );
  router.delete(
    "/delete-student/:phone",
    requestHandler.validate,
    instructorController.deleteStudentByPhone
  );

  return router;
};
