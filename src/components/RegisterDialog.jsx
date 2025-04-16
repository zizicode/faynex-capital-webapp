
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";
import { registerUser } from "@/lib/auth";

const RegisterDialog = ({ isOpen, onClose, onRegister }) => {
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

  useEffect(() => {
    if (referralCode) {
      checkReferrer();
    }
  }, [referralCode]);

  const checkReferrer = async () => {
    try {
      const { data: referrer, error } = await supabase
        .from('users')
        .select('name, username')
        .eq('username', referralCode)
        .single();

      if (error) throw error;

      if (referrer) {
        toast({
          title: "Referido detectado",
          description: `Tu patrocinador es: ${referrer.name}`,
        });
      }
    } catch (error) {
      console.error('Error checking referrer:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const { data: user, error } = await supabase
          .rpc('verify_user_credentials', {
            p_email_or_username: formData.email,
            p_password: formData.password
          });

        if (error) throw error;
        if (!user) throw new Error('Credenciales incorrectas');

        toast({
          title: "¡Bienvenido de nuevo!",
          description: "Has iniciado sesión correctamente",
        });

        onRegister(user);
        onClose();
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

      if (!formData.name || !formData.email || !formData.username || !formData.password) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos",
          variant: "destructive",
        });
        return;
      }

      // Check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${formData.email},username.eq.${formData.username}`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        toast({
          title: "Error",
          description: "Este correo o nombre de usuario ya está registrado",
          variant: "destructive",
        });
        return;
      }

      // Get referrer information
      let referrerId = null;
      let secondLevelId = null;
      let thirdLevelId = null;

      if (referralCode) {
        const { data: referrer } = await supabase
          .from('users')
          .select('id, referrer_id, second_level_id')
          .eq('username', referralCode)
          .single();

        if (referrer) {
          referrerId = referrer.id;
          secondLevelId = referrer.referrer_id;
          thirdLevelId = referrer.second_level_id;
        }
      }

      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          referral_code: formData.username,
          referred_by: referralCode || null,
          referrer_id: referrerId,
          second_level_id: secondLevelId,
          third_level_id: thirdLevelId,
          is_active: true,
          join_date: new Date().toISOString(),
          last_active_date: new Date().toISOString(),
          total_earnings: 0,
          available_balance: 0,
          active_referrals: 0,
          active_plan: null,
          restricted_access: true,
          account_status: 'active',
          copy_trading_active: false,
          monthly_earnings: 0,
          next_level_progress: 0,
          level: 'Bronce'
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Create referral relationship
      if (referrerId) {
        const { error: referralError } = await supabase
          .from('referrals')
          .insert([{
            referrer_id: referrerId,
            referred_id: newUser.id,
            join_date: new Date().toISOString()
          }]);

        if (referralError) throw referralError;
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Bienvenido a Faynex Capital",
      });

      onRegister(newUser);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error durante el proceso",
        variant: "destructive",
      });
    }
  };

  const toggleForm = async () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    console.log(await registerUser(formData));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95%] mx-auto">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? "Iniciar Sesión" : "Crear cuenta"}
          </DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Accede a tu cuenta de Faynex Capital"
              : "Únete a la comunidad líder en trading"}
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
                <div className="space-y-2">
                  <Input
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Nombre de usuario"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Input
                type="text"
                placeholder={isLogin ? "Email o nombre de usuario" : "Email"}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
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
