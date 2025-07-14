import express from "express";
import responseHandler from "../handlers/response-handler";
import {
  db,
  deleteAccountSetupToken,
  getLessonsByStudent,
  getMessagesBetweenUsers,
  getUserByEmail,
  getUserByPhone,
  lessonsCollection,
  studentLessonsCollection,
  updateLessonStatus,
  updateUser,
  validateAccountSetupTokenFireBase,
} from "../lib/firebase";
import { validateEmail } from "../lib/mail";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";

const getMyLessons = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user) {
      return responseHandler.unauthorized(res);
    }

    const user = req.user;

    if (user.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const q = query(
      studentLessonsCollection,
      where("student_id", "==", user.id)
    );

    const lessonsSnapshot = await getDocs(q);

    if (lessonsSnapshot.empty) {
      return responseHandler.notfound(res, "No lessons found");
    }

    const studentLessons = lessonsSnapshot.docs.map((doc) => doc.data());

    const lessons = await Promise.all(
      studentLessons.map(async (lesson) => {
        const q = query(lessonsCollection, where("id", "==", lesson.lesson_id));

        const lessonDoc = await getDocs(q);
        return {
          ...lesson,
          ...lessonDoc.docs[0].data(),
        };
      })
    );

    responseHandler.ok(res, lessons);
  } catch (error) {
    console.error("Error adding student:", error);
    responseHandler.error(res);
  }
};

const markLessonDone = async (req: express.Request, res: express.Response) => {
  try {
    const { lessonId } = req.params;

    if (!lessonId) {
      return responseHandler.badrequest(res, "Lesson ID is required");
    }

    if (!req.user) {
      return responseHandler.unauthorized(res);
    }

    const user = req.user;

    if (user.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const q = query(
      studentLessonsCollection,
      where("lesson_id", "==", lessonId),
      where("student_id", "==", user.id)
    );

    const lessonsSnapshot = await getDocs(q);

    if (lessonsSnapshot.empty) {
      return responseHandler.notfound(res, "No lessons found");
    }

    const lesson = lessonsSnapshot.docs[0].data();

    if (lesson.status === "completed") {
      return responseHandler.badrequest(
        res,
        "Lesson is already marked as completed"
      );
    }

    await updateDoc(doc(studentLessonsCollection, lessonsSnapshot.docs[0].id), {
      status: "completed",
    });

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

    const student = await getUserByPhone(phone);

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

const setupAccount = async (req: express.Request, res: express.Response) => {
  try {
    const { token, email, name, phone, password } = req.body;

    if (!token || !email || !name || !phone || !password) {
      return responseHandler.badrequest(
        res,
        "Token, email, name, phone, and password are required"
      );
    }

    const result = await validateAccountSetupTokenFireBase(email, token);

    if (!result.success) {
      return responseHandler.badrequest(res, result.error || "Invalid token");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const resultUpdateUser = await updateUser(phone as string, {
      name,
      email,
      phone,
      password: hashedPassword,
      updated_at: new Date(),
    });

    if (!resultUpdateUser.success) {
      return responseHandler.badrequest(
        res,
        resultUpdateUser.error || "Failed to update user"
      );
    }

    await deleteAccountSetupToken(email);

    responseHandler.ok(res, {
      msg: "Account setup successfully",
    });
  } catch (error) {
    console.error("Error setting up account:", error);
    responseHandler.error(res);
  }
};

const getProfileByEmail = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.query;

    if (!email) {
      return responseHandler.badrequest(res, "Email is required");
    }

    const user = await getUserByEmail(email as string);
    if (!user) {
      return responseHandler.notfound(res);
    }

    responseHandler.ok(res, user);
  } catch (error) {
    console.error("Error getting student profile:", error);
    responseHandler.error(res);
  }
};

const getMyInstructor = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user) {
      return responseHandler.unauthorized(res);
    }

    const user = req.user;

    if (user.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const instructor = await getUserByPhone(user.instructor_phone);
    if (!instructor) {
      return responseHandler.notfound(res);
    }

    responseHandler.ok(res, instructor);
  } catch (error) {
    console.error("Error getting student profile:", error);
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
  setupAccount,
  getProfileByEmail,
  getMyInstructor,
};
