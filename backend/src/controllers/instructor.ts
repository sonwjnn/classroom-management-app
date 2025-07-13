import express from "express";
import responseHandler from "../handlers/response-handler";
import {
  createLesson,
  createUser,
  deleteUser,
  getLessonsByStudent,
  getUserByEmail,
  getUserByPhone,
  updateUser,
  saveAccountSetupToken,
  lessonsCollection,
  studentLessonsCollection,
  getAllStudentsByInstructor,
} from "../lib/firebase";
import {
  sendLessonAssignedEmail,
  sendWelcomeEmail,
  validateEmail,
} from "../lib/mail";
import { validatePhoneNumber } from "../lib/twilio";
import { StudentLesson, User } from "../types";
import { v4 as uuidv4 } from "uuid";
import {
  doc,
  getDocs,
  orderBy,
  query,
  where,
  serverTimestamp,
  setDoc,
  deleteDoc,
  updateDoc,
  DocumentReference,
  DocumentSnapshot,
  addDoc,
} from "firebase/firestore";

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

    const existingEmailUser = await getUserByEmail(email);
    if (existingEmailUser) {
      return responseHandler.badrequest(
        res,
        "Student with this email already exists"
      );
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
      instructor_phone: req.user?.phone || "",
      created_at: new Date(),
      updated_at: new Date(),
      status: "active",
    };

    await createUser(studentData);

    try {
      const token = uuidv4();
      await saveAccountSetupToken(token, email);
      await sendWelcomeEmail(email, token, name, phone);
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
    const { assignedStudents, title, description } = req.body;

    if (
      !assignedStudents ||
      assignedStudents.length === 0 ||
      !title ||
      !description
    ) {
      return responseHandler.badrequest(
        res,
        "Assigned students, title, and description are required"
      );
    }

    const lessonData = {
      title,
      description,
      created_by: req.user?.phone || "",
    };

    const id = uuidv4();
    await setDoc(doc(lessonsCollection), {
      ...lessonData,
      id,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const studentLessonsData: StudentLesson[] = assignedStudents.map(
      (student: {
        id: string;
        name: string;
        email: string;
        phone: string;
      }) => ({
        id: uuidv4(),
        lesson_id: id,
        student_id: student.id,
        student_name: student.name,
        student_email: student.email,
        student_phone: student.phone,
        status: "assigned",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })
    );

    await Promise.all(
      studentLessonsData.map((studentLesson) =>
        setDoc(doc(studentLessonsCollection), {
          ...studentLesson,
        })
      )
    );

    try {
      await Promise.all(
        studentLessonsData.map(({ student_email, student_name }) =>
          sendLessonAssignedEmail(student_email, student_name, title)
        )
      );
    } catch (emailError) {
      console.error("Error sending lesson notification email:", emailError);
    }

    responseHandler.ok(res, {
      msg: "Lesson assigned successfully",
    });
  } catch (error) {
    console.error("Error assigning lesson:", error);
    responseHandler.error(res);
  }
};

const editLesson = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { assignedStudents, title, description } = req.body;

    if (!id) {
      return responseHandler.badrequest(res, "Lesson ID is required");
    }

    const lessonQuery = query(lessonsCollection, where("id", "==", id));
    const lessonSnapshot = await getDocs(lessonQuery);

    if (lessonSnapshot.empty) {
      return responseHandler.notfound(res, "Lesson not found");
    }

    const lessonDocRef = doc(lessonsCollection, lessonSnapshot.docs[0].id);

    await updateDoc(lessonDocRef, {
      title,
      description,
      updated_at: serverTimestamp(),
    });

    if (assignedStudents && assignedStudents.length > 0) {
      const currentStudentsQuery = query(
        studentLessonsCollection,
        where("lesson_id", "==", id)
      );
      const currentStudentsSnapshot = await getDocs(currentStudentsQuery);

      type Student = {
        phone: string;
        email: string;
        name: string;
        id: string;
      };

      const newStudentsMap = new Map<string, Student>();
      assignedStudents.forEach((student: Student) =>
        newStudentsMap.set(student.phone, student)
      );

      const currentStudentsMap = new Map<string, DocumentSnapshot>();
      currentStudentsSnapshot.forEach((doc) => {
        currentStudentsMap.set(doc.data().student_phone, doc);
      });

      const operations: Promise<any>[] = [];

      newStudentsMap.forEach((student, phone) => {
        if (!currentStudentsMap.has(phone)) {
          const newStudentLesson = {
            lesson_id: id,
            student_id: student.id,
            student_email: student.email,
            student_phone: student.phone,
            student_name: student.name,
            status: "assigned",
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          };
          operations.push(addDoc(studentLessonsCollection, newStudentLesson));
        }
      });

      currentStudentsMap.forEach((doc, phone) => {
        if (!newStudentsMap.has(phone)) {
          operations.push(deleteDoc(doc.ref));
        }
      });

      await Promise.all(operations);
    }

    responseHandler.ok(res, {
      message: "Lesson updated successfully",
    });
  } catch (error) {
    console.error("Error updating lesson:", error);
    responseHandler.error(res);
  }
};

const deleteLesson = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const q = query(lessonsCollection, where("id", "==", id));
    const lessonSnapshot = await getDocs(q);

    if (lessonSnapshot.empty) {
      return responseHandler.notfound(res);
    }

    const lessonDoc = lessonSnapshot.docs[0];

    await deleteDoc(doc(lessonsCollection, lessonDoc.id));

    const studentLessonsQuery = query(
      studentLessonsCollection,
      where("lesson_id", "==", lessonDoc.data().id)
    );
    const studentLessonsSnapshot = await getDocs(studentLessonsQuery);

    const studentLessons = studentLessonsSnapshot.docs.map((doc) => doc.id);

    await Promise.all(
      studentLessons.map((studentLessonId) =>
        deleteDoc(doc(studentLessonsCollection, studentLessonId))
      )
    );

    responseHandler.ok(res, {
      msg: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    responseHandler.error(res);
  }
};

const getLessons = async (req: express.Request, res: express.Response) => {
  try {
    // 1. Authentication and Authorization
    if (!req.user) {
      return responseHandler.unauthorized(res);
    }

    const user = req.user;
    if (user.role !== "instructor") {
      return responseHandler.badrequest(res, "User is not an instructor");
    }

    if (!user.phone) {
      return responseHandler.badrequest(res, "User phone number is required");
    }

    // 2. Get all lessons for this instructor
    const q = query(lessonsCollection, where("created_by", "==", user.phone));

    const lessonsSnapshot = await getDocs(q);

    // 3. Process lessons in parallel with their assigned students
    const lessonsWithStudents = await Promise.all(
      lessonsSnapshot.docs.map(async (doc) => {
        const lessonData = doc.data();

        // Get assigned students for this lesson
        const studentsQuery = query(
          studentLessonsCollection,
          where("lesson_id", "==", lessonData.id)
        );

        const studentsSnapshot = await getDocs(studentsQuery);

        const assignedStudents = studentsSnapshot.docs.map((studentDoc) => ({
          id: studentDoc.data().id,
          ...studentDoc.data(),
        }));

        return {
          id: lessonData.id,
          title: lessonData.title,
          description: lessonData.description,
          created_by: lessonData.created_by,
          created_at: lessonData.created_at,
          updated_at: lessonData.updated_at,
          assigned_students: assignedStudents,
        };
      })
    );

    responseHandler.ok(res, lessonsWithStudents);
  } catch (error) {
    console.error("Error getting lessons:", error);

    responseHandler.error(res, "Failed to get lessons");
  }
};

const getAllStudents = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user) {
      return responseHandler.unauthorized(res);
    }

    const user = req.user;

    if (user.role !== "instructor") {
      return responseHandler.badrequest(res, "User is not an instructor");
    }

    const students = await getAllStudentsByInstructor(user.phone);

    const sanitizedStudents = students.map((student) => ({
      id: student.id,
      name: student.name,
      phone: student.phone,
      email: student.email,
      role: student.role,
      status: student.status,
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
    const { name, email, newPhone } = req.body;

    if (!name && !email && !newPhone) {
      return responseHandler.badrequest(
        res,
        "At least one field (name or email or newPhone) is required"
      );
    }

    const student = await getUserByPhone(phone);
    if (!student) {
      return responseHandler.notfound(res);
    }

    if (student.role !== "student") {
      return responseHandler.badrequest(res, "User is not a student");
    }

    const updates: { name?: string; email?: string; phone?: string } = {};

    if (name !== student.name) updates.name = name;
    if (email !== student.email) {
      if (!validateEmail(email)) {
        return responseHandler.badrequest(res, "Invalid email format");
      }

      const existingEmailUser = await getUserByEmail(email);
      if (existingEmailUser) {
        return responseHandler.badrequest(
          res,
          "Student with this email already exists"
        );
      }

      updates.email = email;
    }

    if (newPhone !== student.phone) {
      if (!validatePhoneNumber(newPhone)) {
        return responseHandler.badrequest(res, "Invalid phone number format");
      }

      const existingPhoneUser = await getUserByPhone(newPhone);
      if (existingPhoneUser) {
        return responseHandler.badrequest(
          res,
          "Student with this phone number already exists"
        );
      }

      updates.phone = newPhone;
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
    const result = await deleteUser(phone);

    if (!result.success) {
      return responseHandler.error(res, "Failed to delete student");
    }

    const studentLessonsQuery = query(
      studentLessonsCollection,
      where("student_phone", "==", phone)
    );
    const studentLessonsSnapshot = await getDocs(studentLessonsQuery);

    const studentLessons = studentLessonsSnapshot.docs.map((doc) => doc.id);

    await Promise.all(
      studentLessons.map((studentLessonId) =>
        deleteDoc(doc(studentLessonsCollection, studentLessonId))
      )
    );

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
  editLesson,
  deleteLesson,
  getLessons,
  getAllStudents,
  getStudentWithLessonsByPhone,
  editStudentByPhone,
  deleteStudentByPhone,
};
