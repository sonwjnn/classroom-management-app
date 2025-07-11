import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { User } from "../types";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const userCollection = collection(db, "users");
export const messageCollection = collection(db, "messages");
export const lessonCollection = collection(db, "lessons");
export const smsOtpCodesCollection = collection(db, "sms_otp_codes");
export const emailOtpCodesCollection = collection(db, "email_otp_codes");

// User Operations
export const createUser = async (userData: Partial<Omit<User, "id">>) => {
  try {
    const userRef = doc(db, "users", userData.phone || "");
    await setDoc(userRef, {
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "student",
      phone: userData.phone || "",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUserByPhone = async (phone: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", phone));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }

    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const updateUser = async (phone: string, updates: Partial<User>) => {
  try {
    const userRef = doc(db, "users", phone);
    await updateDoc(userRef, {
      ...updates,
      updated_at: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (phone: string) => {
  try {
    await deleteDoc(doc(db, "users", phone));
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "student"));

    const studentsSnapshot = await getDocs(q);
    const students: any[] = [];

    studentsSnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });

    return students;
  } catch (error) {
    console.error("Error getting students:", error);
    throw error;
  }
};

// Access code operations
export const saveSmsOTPCode = async (phone: string, code: string) => {
  try {
    if (!phone) {
      return false;
    }

    const otpRef = doc(db, "sms_otp_codes", phone);

    if ((await getDoc(otpRef)).exists()) {
      await deleteSmsOTPCode(phone);
    }

    await setDoc(otpRef, {
      code,
      phone,
      expires_at: Timestamp.fromMillis(Date.now() + 60 * 10 * 1000), // 10 minutes from now
    });
    return true;
  } catch (error) {
    console.error("Error saving access code:", error);
    return false;
  }
};

export const saveEmailOTPCode = async (email: string, code: string) => {
  try {
    if (!email) {
      return false;
    }

    const otpRef = doc(db, "email_otp_codes", email);

    if ((await getDoc(otpRef)).exists()) {
      await deleteEmailOTPCode(email);
    }

    await setDoc(otpRef, {
      code,
      email,
      expires_at: Timestamp.fromMillis(Date.now() + 60 * 10 * 1000), // 10 minutes from now
    });
    return true;
  } catch (error) {
    console.error("Error saving access code:", error);
    return false;
  }
};

export const validateSmsOTPCode = async (phone: string, code: string) => {
  try {
    const otpDoc = await getDoc(doc(db, "sms_otp_codes", phone));
    if (!otpDoc.exists()) {
      return { success: false, error: "Invalid access code" };
    }

    const otpData = otpDoc.data();
    if (otpData.code !== code) {
      return { success: false, error: "Invalid access code" };
    }

    if (otpData.expires_at.toMillis() < Date.now()) {
      return { success: false, error: "Access code expired" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error validating access code:", error);
    return { success: false, error: "Unknown error" };
  }
};

export const validateEmailOTPCode = async (email: string, code: string) => {
  try {
    const otpDoc = await getDoc(doc(db, "email_otp_codes", email));
    if (!otpDoc.exists()) {
      return { success: false, error: "Invalid access code" };
    }

    const otpData = otpDoc.data();
    if (otpData.code !== code) {
      return { success: false, error: "Invalid access code" };
    }

    if (otpData.expires_at.toMillis() < Date.now()) {
      return { success: false, error: "Access code expired" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error validating access code:", error);
    return { success: false, error: "Unknown error" };
  }
};

export const deleteSmsOTPCode = async (phone: string) => {
  try {
    await deleteDoc(doc(db, "sms_otp_codes", phone));
    return { success: true };
  } catch (error) {
    console.error("Error deleting access code:", error);
    return { success: false };
  }
};

export const deleteEmailOTPCode = async (email: string) => {
  try {
    await deleteDoc(doc(db, "email_otp_codes", email));
    return { success: true };
  } catch (error) {
    console.error("Error deleting access code:", error);
    return { success: false };
  }
};

// Lesson operations
export const createLesson = async (lessonData: any) => {
  try {
    const lessonRef = doc(collection(db, "lessons"));
    await setDoc(lessonRef, {
      ...lessonData,
      id: lessonRef.id,
      status: "assigned",
      created_at: serverTimestamp(),
    });
    return { success: true, id: lessonRef.id };
  } catch (error) {
    console.error("Error creating lesson:", error);
    throw error;
  }
};

export const getLessonsByStudent = async (studentPhone: string) => {
  try {
    const q = query(
      collection(db, "lessons"),
      where("student_phone", "==", studentPhone),
      orderBy("created_at", "desc")
    );

    const lessonsSnapshot = await getDocs(q);
    const lessons: any[] = [];

    lessonsSnapshot.forEach((doc) => {
      lessons.push({ id: doc.id, ...doc.data() });
    });

    return lessons;
  } catch (error) {
    console.error("Error getting lessons:", error);
    throw error;
  }
};

export const updateLessonStatus = async (lessonId: string, status: string) => {
  try {
    const lessonRef = doc(db, "lessons", lessonId);
    const updates: any = { status };

    if (status === "completed") {
      updates.completedAt = serverTimestamp();
    }

    await updateDoc(lessonRef, updates);
    return { success: true };
  } catch (error) {
    console.error("Error updating lesson status:", error);
    throw error;
  }
};

export const saveMessage = async (messageData: any) => {
  try {
    const messageRef = doc(collection(db, "messages"));
    await setDoc(messageRef, {
      ...messageData,
      id: messageRef.id,
      created_at: serverTimestamp(),
    });
    return { success: true, id: messageRef.id };
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

export const getMessagesBetweenUsers = async (
  user1Phone: string,
  user2Phone: string
) => {
  try {
    const q = query(
      collection(db, "messages"),
      where("from_phone", "in", [user1Phone, user2Phone]),
      where("to_phone", "in", [user1Phone, user2Phone]),
      orderBy("created_at", "asc")
    );

    const messagesSnapshot = await getDocs(q);
    const messages: any[] = [];

    messagesSnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return messages;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    await updateDoc(doc(db, "messages", messageId), {
      read: true,
      read_at: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};
