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
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { registerUser, loginUser } from "../services/api/auth.user";

const RegisterDialog = ({ isOpen, onClose, onRegister, onLogin }) => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const referral = params.get("ref");
  useEffect(() => {
    if(referral != null){
      setIsLogin(false);
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (!formData.email || !formData.password) {
        toast({
          title: "Error",
          description: "Por favor completa los campos requeridos",
          variant: "destructive",
        });
        return;
      }
  
      if (!isLogin) {
        if (
          !formData.name ||
          !formData.username ||
          !formData.confirmPassword
        ) {
          toast({
            title: "Error",
            description: "Por favor completa todos los campos",
            variant: "destructive",
          });
          return;
        }
  
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Las contraseñas no coinciden",
            variant: "destructive",
          });
          return;
        }
      }
  
      let response;
      const payload = {
        ...formData,
        referralCode: referralCode || undefined,
      };
  
      if (isLogin) {
        response = await loginUser(payload);
      } else {
        response = await registerUser(payload);
      }
  
      if (response?.error) {
        throw new Error(response.error);
      }
  
      toast({
        title: isLogin ? "Inicio de sesión exitoso" : "¡Registro exitoso!",
        description: `Bienvenido${isLogin ? " de nuevo" : ""} a Faynex Capital`,
      });
  
      if (isLogin) {
        onLogin?.(response);
      } else {
        onRegister?.(response);
      }
  
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error durante la operación",
        variant: "destructive",
      });
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
