import { type User } from "@/modules/auth/types";
import { useState, useEffect } from "react";

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const isInstructor = user?.role === "instructor";
  const isStudent = user?.role === "student";

  return {
    user,
    loading,
    isInstructor,
    isStudent,
  };
};
