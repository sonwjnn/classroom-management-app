import express from "express";
import responseHandler from "../handlers/response-handler";
import {
  createLesson,
  createUser,
  deleteUser,
  getAllStudents as getAllStudentsFirebase,
  getLessonsByStudent,
  getUserByPhone,
  updateUser,
} from "../lib/firebase";
import {
  sendLessonAssignedEmail,
  sendWelcomeEmail,
  validateEmail,
} from "../lib/mail";
import { validatePhoneNumber } from "../lib/twilio";
import { User } from "../types";

const addStudent = async (req: express.Request, res: express.Response) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return responseHandler.badrequest(
        res,
        "Name, phone, and email are required"
      );
    }

    if (!validateEmail(email)) {
      return responseHandler.badrequest(res, "Invalid email format");
    }

    if (!validatePhoneNumber(phone)) {
      return responseHandler.badrequest(res, "Invalid phone number format");
    }

    const existingUser = await getUserByPhone(phone);
    if (existingUser) {
      return responseHandler.badrequest(
        res,
        "Student with this phone number already exists"
      );
    }

    const studentData: Omit<User, "id"> = {
      name,
      phone,
      email,
      role: "student",
      created_at: new Date(),
      updated_at: new Date(),
      access_code: "",
      code_created_at: new Date(),
    };

    await createUser(studentData);

    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }

    responseHandler.created(res, {
      msg: "Student added successfully",
      student: studentData,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    responseHandler.error(res);
  }
};

const assignLesson = async (req: express.Request, res: express.Response) => {
  try {
    const { studentPhone, title, description, instructorPhone } = req.body;

    if (!studentPhone || !title || !description) {
      return responseHandler.badrequest(
        res,
        "Student phone, title, and description are required"
      );
    }

    const student = await getUserByPhone(studentPhone);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    if (!student.email) {
      return responseHandler.badrequest(
        res,
        "Student has no email, please update your profile"
      );
    }

    const lessonData = {
      title,
      description,
      student_phone: studentPhone,
      instructor_phone: instructorPhone || "",
      status: "assigned",
      created_at: new Date(),
    };

    const result = await createLesson(lessonData);

    try {
      await sendLessonAssignedEmail(student.email, student.name, title);
    } catch (emailError) {
      console.error("Error sending lesson notification email:", emailError);
    }

    responseHandler.ok(res, {
      success: true,
      msg: "Lesson assigned successfully",
      lessonId: result.id,
    });
  } catch (error) {
    console.error("Error assigning lesson:", error);
    responseHandler.error(res);
  }
};

const getAllStudents = async (req: express.Request, res: express.Response) => {
  try {
    const students = await getAllStudentsFirebase();

    const sanitizedStudents = students.map((student) => ({
      id: student.id,
      name: student.name,
      phone: student.phone,
      email: student.email,
      role: student.role,
      created_at: student.created_at,
      updated_at: student.updated_at,
    }));

    responseHandler.ok(res, sanitizedStudents);
  } catch (error) {
    console.error("Error getting students:", error);
    responseHandler.error(res);
  }
};

const getStudentWithLessonsByPhone = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { phone } = req.params;

    const student = await getUserByPhone(phone);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const lessons = await getLessonsByStudent(phone);

    const sanitizedStudent = {
      id: student.id,
      name: student.name,
      phone: student.phone,
      email: student.email,
      role: student.role,
      created_at: student.created_at,
      updated_at: student.updated_at,
      lessons: lessons,
    };

    responseHandler.ok(res, sanitizedStudent);
  } catch (error) {
    console.error("Error getting student:", error);
    responseHandler.error(res);
  }
};

const editStudentByPhone = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { phone } = req.params;
    const { name, email } = req.body;

    if (!name && !email) {
      return responseHandler.badrequest(
        res,
        "At least one field (name or email) is required"
      );
    }

    const student = await getUserByPhone(phone);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const updates: { name?: string; email?: string } = {};
    if (name) updates.name = name;
    if (email) {
      if (!validateEmail(email)) {
        return responseHandler.badrequest(res, "Invalid email format");
      }
      updates.email = email;
    }

    await updateUser(phone, updates);

    responseHandler.ok(res, {
      msg: "Student updated successfully",
    });
  } catch (error) {
    console.error("Error editing student:", error);
    responseHandler.error(res);
  }
};

const deleteStudentByPhone = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { phone } = req.params;

    // Verify student exists
    const student = await getUserByPhone(phone);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    // Delete student
    await deleteUser(phone);

    // TODO: Also delete associated lessons and messages

    responseHandler.ok(res, {
      msg: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    responseHandler.error(res);
  }
};

export default {
  addStudent,
  assignLesson,
  getAllStudents,
  getStudentWithLessonsByPhone,
  editStudentByPhone,
  deleteStudentByPhone,
};
