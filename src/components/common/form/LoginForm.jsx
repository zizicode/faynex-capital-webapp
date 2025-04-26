import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/services/api/auth.user";
import useNayStore from "@/zustand/NayStore";
import useUserDataStore from "@/zustand/isAuthenticate";
import useTokenStore from '@/zustand/isTokenStore';

const LoginForm = ({ toggleForm }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [codeError, setCodeError] = useState("");
  const {setNayData} = useNayStore();
  const {setUserData} = useUserDataStore();
  const {setTokenData} = useTokenStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(formData);
  
    if (result.success === false || !result.data) {
      if (result.codeError) {
        setCodeError(result.codeError);
      }
      setNayData(result.message, "error", { type: "error", autoClose: 2000 }, 2500);
      return; // Salimos si hubo error
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
        type="text"
        placeholder="Email o nombre de usuario"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className={codeError === "AL01" ? "border-red-500 focus-visible:ring-red-500" : ""}
        required
      />
      <Input
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className={codeError === "AL02" ? "border-red-500 focus-visible:ring-red-500" : ""}
        required
      />
      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
        Iniciar Sesión
      </Button>
      <div className="text-center mt-4">
        <button type="button" onClick={toggleForm} className="text-sm text-gray-400 hover:text-white transition-colors">
          ¿No tienes una cuenta? Regístrate
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
