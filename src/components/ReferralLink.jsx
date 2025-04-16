
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ReferralLink = ({ username }) => {
  const { toast } = useToast();
  const referralLink = `${window.location.origin}/registro?ref=${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "¡Enlace copiado!",
        description: "El enlace de referido ha sido copiado al portapapeles",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900">
        <CardHeader>
          <CardTitle className="text-lg">Tu Enlace de Referido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
            <code className="flex-1 text-sm truncate">{referralLink}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="hover:bg-white/10"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReferralLink;
