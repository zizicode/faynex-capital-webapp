
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const PricingCard = ({ plan, price, features, savings, isPopular, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className={`relative h-full ${isPopular ? 'border-blue-500 border-2' : ''}`}>
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
              Más Popular
            </span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{plan}</CardTitle>
          <CardDescription className="text-center mt-2">
            <span className="text-3xl font-bold">${price}</span>
            <span className="text-sm text-gray-500"> USD</span>
          </CardDescription>
          {savings && (
            <div className="mt-2 text-center">
              <span className="text-green-500 text-sm font-semibold">
                Ahorras: ${savings} USD
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => onSelect(plan, price)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Seleccionar Plan
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PricingCard;
