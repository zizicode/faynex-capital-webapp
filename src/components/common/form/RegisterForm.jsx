import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/services/api/auth.user";
import useNayStore from "@/zustand/NayStore";
import useUserDataStore from "@/zustand/isAuthenticate";
import useTokenStore from '@/zustand/isTokenStore';

const RegisterForm = ({ toggleForm }) => {
  const [codeError, setCodeError] = useState("");
  const {setNayData} = useNayStore();
  const {setUserData} = useUserDataStore();
  const {setTokenData} = useTokenStore();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setNayData("Las contraseñas no coinciden", "error", { type: "error", autoClose: 2000 }, 2500);
      setCodeError('AR03')
      return;
    }

    const result = await registerUser(formData);
    if (result.success === false || !result.data) {
      if (result.codeError) {
        setCodeError(result.codeError);
      }
      setNayData(result.message, "error", { type: "error", autoClose: 4000 }, 4500);
      return;
    }

    // Si todo está bien, continuamos
    setTokenData(result.token || null);
    setUserData(result.data || null);
    setNayData(result.message, "success", { type: "success", autoClose: 2000 }, 2500);
  };

  useEffect(() => {
    if(codeError){
        setCodeError('');
    }
  },[formData])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <Input
        placeholder="Nombre completo"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        placeholder="Nombre de usuario"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        className={codeError === "AR01" ? "border-red-500 focus-visible:ring-red-500" : ""}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className={codeError === "AR02" ? "border-red-500 focus-visible:ring-red-500" : ""}
        required
      />
      <Input
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className={codeError === "AR03" ? "border-red-500 focus-visible:ring-red-500" : ""}
        required
      />
      <Input
        type="password"
        placeholder="Confirmar contraseña"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        className={codeError === "AR03" ? "border-red-500 focus-visible:ring-red-500" : ""}
        required
      />
      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
        Registrarse
      </Button>
      <div className="text-center mt-4">
        <button type="button" onClick={toggleForm} className="text-sm text-gray-400 hover:text-white transition-colors">
          ¿Ya tienes una cuenta? Inicia sesión
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
