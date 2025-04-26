import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import LoginForm from "./form/LoginForm";
import RegisterForm from "./form/RegisterForm";

const AuthDialog = ({ isOpen, onClose, isLoging=true }) => {
  const [isLogin, setIsLogin] = useState(isLoging);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95%] mx-auto">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Iniciar Sesión" : "Crear cuenta"}</DialogTitle>
          <DialogDescription>
            {isLogin ? "Accede a tu cuenta de Faynex Capital" : "Únete a la comunidad líder en trading"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          >
            {isLogin ? (
              <LoginForm toggleForm={toggleForm} />
            ) : (
              <RegisterForm toggleForm={toggleForm} />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
