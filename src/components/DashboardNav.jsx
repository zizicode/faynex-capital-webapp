
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  Bell, 
  Copy, 
  Book, 
  Calendar,
  CreditCard,
  MessageSquare,
  LogOut,
  Wallet
} from "lucide-react";
import { logout } from "@/lib/auth";

const DashboardNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 w-64 min-h-screen p-4">
      <div className="text-2xl font-bold text-blue-500 mb-8">Faynex Capital</div>
      <div className="space-y-4">
        <Link to="/dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Home className="h-5 w-5" />
          <span>Inicio</span>
        </Link>
        <Link to="/dashboard/campus" className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <BookOpen className="h-5 w-5" />
          <span>Campus Virtual</span>
        </Link>
        <Link to="/dashboard/signals" className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Bell className="h-5 w-5" />
          <span>Señales</span>
        </Link>
        <Link to="/dashboard/copy-trading" className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Copy className="h-5 w-5" />
          <span>Copy Trading</span>
        </Link>
        <Link to="/dashboard/library" className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Book className="h-5 w-5" />
          <span>Biblioteca</span>
        </Link>
        <Link to="/dashboard/news" className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Calendar className="h-5 w-5" />
          <span>Noticias</span>
        </Link>
        <Link to="/dashboard/plans" className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <CreditCard className="h-5 w-5" />
          <span>Planes</span>
        </Link>
        <Link to="/dashboard/wallet" className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <Wallet className="h-5 w-5" />
          <span>Wallet</span>
        </Link>
        <Link to="/dashboard/support" className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <MessageSquare className="h-5 w-5" />
          <span>Soporte</span>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </nav>
  );
};

export default DashboardNav;
