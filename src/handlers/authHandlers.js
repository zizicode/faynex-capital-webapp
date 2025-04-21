export const handleRegister = ({ userData, setCurrentUser, setIsAuthenticated, setShowRegister }) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
  };
  
  export const handleLogin = ({ userData, setCurrentUser, setIsAuthenticated, setShowRegister }) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
  };
  
  export const handleLogout = ({ setCurrentUser, setIsAuthenticated, navigate, toast }) => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate("/");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };
  
  export const handleAdminLogout = ({ setIsAdmin, navigate, toast }) => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    setIsAdmin(false);
    navigate("/admin/login");
    toast({
      title: "Sesión administrativa cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };
  