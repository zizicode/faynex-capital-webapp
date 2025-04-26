import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import LoginForm from "./form/LoginForm";
import RegisterForm from "./form/RegisterForm";

const AuthDialog = ({ isOpen, onClose }) => {
  const [referralBy, setReferralBy] = useState(undefined);
  const [isLogin, setIsLogin] = useState('login');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      setReferralBy(ref);
      setIsLogin('register');
    } else {
      setReferralBy(undefined);
      setIsLogin('login');
    }
  }, []);

  const toggleForm = () => setIsLogin(isLogin === 'login' ? 'register' : 'login');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95%] mx-auto">
        <DialogHeader>
          <DialogTitle>{isLogin === 'login' ? "Iniciar Sesión" : "Crear cuenta"}</DialogTitle>
          <DialogDescription>
            {isLogin === 'login' ? "Accede a tu cuenta de Faynex Capital" : "Únete a la comunidad líder en trading"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin}
            initial={{ opacity: 0, x: isLogin === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin === 'login' ? 20 : -20 }}
          >
            {isLogin === 'login' ? (
              <LoginForm toggleForm={toggleForm} />
            ) : (
              <RegisterForm toggleForm={toggleForm} referral={referralBy} />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
