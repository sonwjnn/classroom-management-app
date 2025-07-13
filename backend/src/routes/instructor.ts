import express from "express";

import instructorController from "../controllers/instructor";
import requestHandler from "../handlers/request-handler";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

export default (): express.Router => {
  router.post(
    "/add-student",
    isAuthenticated,
    requestHandler.validate,
    instructorController.addStudent
  );
  router.post(
    "/assign-lesson",
    isAuthenticated,
    requestHandler.validate,
    instructorController.assignLesson
  );
  router.patch(
    "/edit-lesson/:id",
    isAuthenticated,
    requestHandler.validate,
    instructorController.editLesson
  );
  router.delete(
    "/delete-lesson/:id",
    isAuthenticated,
    requestHandler.validate,
    instructorController.deleteLesson
  );
  router.get(
    "/get-all-students",
    isAuthenticated,
    requestHandler.validate,
    instructorController.getAllStudents
  );
  router.get(
    "/my-lessons",
    isAuthenticated,
    requestHandler.validate,
    instructorController.getLessons
  );
  router.patch(
    "/edit-student/:phone",
    isAuthenticated,
    requestHandler.validate,
    instructorController.editStudentByPhone
  );
  router.delete(
    "/delete-student/:phone",
    isAuthenticated,
    requestHandler.validate,
    instructorController.deleteStudentByPhone
  );

  return router;
};
