import { useEffect, useState } from "react";

export default function useAuthState() {
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const adminAuth = localStorage.getItem("adminAuthenticated");
    const adminUser = localStorage.getItem("adminUser");
    if (adminAuth === "true" && adminUser) {
      setIsAdmin(true);
    }
  }, []);

  return {
    showRegister,
    setShowRegister,
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    isAdmin,
    setIsAdmin,
  };
}
