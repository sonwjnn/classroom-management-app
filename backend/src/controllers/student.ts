import express from "express";
import responseHandler from "../handlers/response-handler";
import {
  db,
  getLessonsByStudent,
  getMessagesBetweenUsers,
  getUserByPhone,
  updateLessonStatus,
  updateUser,
  validateEmailOTPCode,
} from "../lib/firebase";
import { validateEmail } from "../lib/mail";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { formatPhoneNumber } from "../utils";

const getMyLessons = async (req: express.Request, res: express.Response) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return responseHandler.badrequest(res, "Phone number is required");
    }

    const student = await getUserByPhone(phone as string);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const lessons = await getLessonsByStudent(phone as string);

    responseHandler.ok(res, lessons);
  } catch (error) {
    console.error("Error adding student:", error);
    responseHandler.error(res);
  }
};

const markLessonDone = async (req: express.Request, res: express.Response) => {
  try {
    const { phone, lessonId } = req.body;

    if (!phone || !lessonId) {
      return responseHandler.badrequest(
        res,
        "Phone number and lesson ID are required"
      );
    }

    const student = await getUserByPhone(phone as string);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    await updateLessonStatus(lessonId, "completed");

    responseHandler.ok(res, {
      msg: "Lesson marked as completed",
    });
  } catch (error) {
    console.error("Error adding student:", error);
    responseHandler.error(res);
  }
};

const editStudentProfile = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { phone, name, email, password } = req.body;

    if (!phone) {
      return responseHandler.badrequest(res, "Phone number is required");
    }

    if (!name && !email && !password) {
      return responseHandler.badrequest(
        res,
        "At least one field (name, email, or password) is required"
      );
    }

    const student = await getUserByPhone(phone as string);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const updates: { name?: string; email?: string; password?: string } = {};
    if (name) updates.name = name;
    if (email) {
      if (!validateEmail(email)) {
        return responseHandler.badrequest(res, "Invalid email format");
      }
      updates.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updates.password = hashedPassword;
    }

    await updateUser(phone as string, updates);

    responseHandler.ok(res, {
      msg: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error editing student profile:", error);
    responseHandler.error(res);
  }
};

const getStudentProfile = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const phone = req.query.phone as string;

    if (!phone) {
      return responseHandler.badrequest(res, "Phone number is required");
    }

    const student = await getUserByPhone(formatPhoneNumber(phone));

    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const sanitizedStudent = {
      id: student.id,
      name: student.name,
      phone: student.phone,
      email: student.email,
      role: student.role,
      created_at: student.created_at,
      updated_at: student.updated_at,
    };

    responseHandler.ok(res, sanitizedStudent);
  } catch (error) {
    console.error("Error getting student profile:", error);
    responseHandler.error(res);
  }
};

const getMessages = async (req: express.Request, res: express.Response) => {
  try {
    const { studentPhone, instructorPhone } = req.query;

    if (!studentPhone || !instructorPhone) {
      return responseHandler.badrequest(
        res,
        "Student phone and instructor phone are required"
      );
    }

    const student = await getUserByPhone(studentPhone as string);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const messages = await getMessagesBetweenUsers(
      studentPhone as string,
      instructorPhone as string
    );

    responseHandler.ok(res, messages);
  } catch (error) {
    console.error("Error getting student profile:", error);
    responseHandler.error(res);
  }
};

const undoLesson = async (req: express.Request, res: express.Response) => {
  try {
    const { phone, lessonId } = req.body;

    if (!phone || !lessonId) {
      return responseHandler.badrequest(
        res,
        "Phone number and lesson ID are required"
      );
    }

    const student = await getUserByPhone(phone as string);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    await updateLessonStatus(lessonId, "assigned");

    responseHandler.ok(res, {
      msg: "Lesson undone successfully",
    });
  } catch (error) {
    console.error("Error undoing lesson:", error);
    responseHandler.error(res);
  }
};

export default {
  getMyLessons,
  markLessonDone,
  editStudentProfile,
  getStudentProfile,
  getMessages,
  undoLesson,
};
