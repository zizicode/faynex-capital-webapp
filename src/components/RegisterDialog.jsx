import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { registerUser, loginUser } from "@/services/api/auth.user";
import { searchUser } from "@/services/api/post.user";

const RegisterDialog = ({ isOpen, onClose, onRegister, onLogin, handleToast }) => {
  const [searchParams] = useSearchParams();
  const [referralCode, setreferralCode] = useState(null)
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const handleSearchUser = async () => {
      const data = await searchUser({username:searchParams.get("ref")});
      if(!data.success && data.data === null){
        setreferralCode(null)
      }else{
        setreferralCode(data.data.name)
      }
    }

    if(searchParams.get("ref") != null){
      handleSearchUser()
      setIsLogin(false);
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let response;
      const payload = isLogin 
      ? { email: formData.email, password: formData.password, referralCode: referralCode } 
      : {...formData, referralCode: referralCode || null} ;
  
      if (isLogin) {
        response = await loginUser(payload);
        handleToast(response);
      } else {
        response = await registerUser(payload);
      }
  
      if (response?.error) {
        throw new Error(response.error);
      }

      if(!response && response.message !== undefined){
        handleToast(response)
      }
  
      if (isLogin && response) {
        onLogin?.(response);
      } else {
        onRegister?.(response);
      }
  
      // onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95%] mx-auto">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Iniciar Sesión" : "Crear cuenta"}</DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Accede a tu cuenta de Faynex Capital"
              : `Únete a la comunidad líder en trading`}
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            onSubmit={handleSubmit}
            className="space-y-4 mt-4"
          >
            {!isLogin && (
              <>
                <Input
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Nombre de usuario"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </>
            )}
            <Input
              type="text"
              placeholder={isLogin ? "Email o nombre de usuario" : "Email"}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            {!isLogin && (
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            )}
            {referralCode && !isLogin && (
              <div className="p-3 bg-blue-900/50 rounded-lg">
                <p className="text-sm text-blue-200">
                  Tu patrocinador es: <strong>{referralCode}</strong>
                </p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {isLogin ? "Iniciar Sesión" : "Registrarse"}
            </Button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={toggleForm}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isLogin
                  ? "¿No tienes una cuenta? Regístrate"
                  : "¿Ya tienes una cuenta? Inicia sesión"}
              </button>
            </div>
          </motion.form>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
