
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const News = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Noticias y Calendario Económico</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Calendario Económico</CardTitle>
          </CardHeader>
          <CardContent className="h-[800px]">
            <iframe
              src="https://es.investing.com/economic-calendar/"
              width="100%"
              height="100%"
              frameBorder="0"
              allowTransparency="true"
              className="bg-white w-full h-full"
            ></iframe>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default News;
