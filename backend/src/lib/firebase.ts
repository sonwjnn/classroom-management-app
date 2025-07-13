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
  limit,
} from "firebase/firestore";
import { User } from "../types";
import { v4 as uuidv4 } from "uuid";

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
export const accountSetupTokensCollection = collection(
  db,
  "account_setup_tokens"
);
export const lessonsCollection = collection(db, "lessons");
export const studentLessonsCollection = collection(db, "student_lessons");

// User Operations
export const createUser = async (userData: Partial<Omit<User, "id">>) => {
  try {
    await setDoc(doc(userCollection), {
      id: uuidv4(),
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "student",
      phone: userData.phone || "",
      instructor_phone: userData.instructor_phone || "",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      status: userData.status || "active",
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUserByPhone = async (phone: string) => {
  try {
    const userSnapshot = await getDocs(
      query(userCollection, where("phone", "==", phone))
    );

    if (userSnapshot.empty) {
      return null;
    }

    const user = userSnapshot.docs[0]?.data() as User;
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const userSnapshot = await getDocs(
      query(userCollection, where("email", "==", email))
    );

    if (userSnapshot.empty) {
      return null;
    }

    const user = userSnapshot.docs[0]?.data() as User;
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const updateUser = async (phone: string, updates: Partial<User>) => {
  try {
    const q = query(userCollection, where("phone", "==", phone), limit(1));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) {
      return { success: false, error: "User not found" };
    }
    const userRef = doc(userCollection, userSnapshot.docs[0].id);
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
    const q = query(userCollection, where("phone", "==", phone), limit(1));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) {
      return { success: false, error: "User not found" };
    }
    const userRef = doc(userCollection, userSnapshot.docs[0].id);
    await deleteDoc(userRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getAllStudentsByInstructor = async (instructorPhone: string) => {
  try {
    const q = query(
      userCollection,
      where("role", "==", "student"),
      where("instructor_phone", "==", instructorPhone)
    );

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
    await setDoc(doc(smsOtpCodesCollection), {
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
    await setDoc(doc(emailOtpCodesCollection), {
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
    const q = query(
      smsOtpCodesCollection,
      where("phone", "==", phone),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: "OTP code not found" };
    }

    const otpData = snapshot.docs[0].data();
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
    const q = query(
      emailOtpCodesCollection,
      where("email", "==", email),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: "OTP code not found" };
    }

    const otpData = snapshot.docs[0].data();
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
    const q = query(
      smsOtpCodesCollection,
      where("phone", "==", phone),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: "OTP code not found" };
    }

    await deleteDoc(snapshot.docs[0].ref);

    return { success: true };
  } catch (error) {
    console.error("Error deleting OTP code:", error);
    return { success: false };
  }
};

export const deleteEmailOTPCode = async (email: string) => {
  try {
    const q = query(
      emailOtpCodesCollection,
      where("email", "==", email),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: "OTP code not found" };
    }

    await deleteDoc(snapshot.docs[0].ref);

    return { success: true };
  } catch (error) {
    console.error("Error deleting OTP code:", error);
    return { success: false };
  }
};

export const saveAccountSetupToken = async (token: string, email: string) => {
  try {
    await setDoc(doc(accountSetupTokensCollection), {
      token,
      email,
      expires_at: Timestamp.fromMillis(Date.now() + 60 * 60 * 24 * 1000), // 24 hours from now
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving account setup token:", error);
    return { success: false };
  }
};

export const validateAccountSetupTokenFireBase = async (
  email: string,
  token: string
) => {
  try {
    const q = query(
      accountSetupTokensCollection,
      where("email", "==", email),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "Invalid token" };
    }

    const tokenData = querySnapshot.docs[0].data();
    if (tokenData.token !== token) {
      return { success: false, error: "Invalid token" };
    }

    if (tokenData.expires_at.toMillis() < Date.now()) {
      return { success: false, error: "Token expired" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error validating account setup token:", error);
    return { success: false, error: "Unknown error" };
  }
};

export const deleteAccountSetupToken = async (email: string) => {
  try {
    const q = query(
      accountSetupTokensCollection,
      where("email", "==", email),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: "Account setup token not found" };
    }

    await deleteDoc(snapshot.docs[0].ref);

    return { success: true };
  } catch (error) {
    console.error("Error deleting account setup token:", error);
    return { success: false };
  }
};

// Lesson operations
export const createLesson = async (lessonData: any) => {
  try {
    const id = uuidv4();
    await setDoc(doc(lessonsCollection), {
      ...lessonData,
      id,
      status: "assigned",
      created_at: serverTimestamp(),
    });
    return { success: true, id };
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
