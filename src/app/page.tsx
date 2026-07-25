"use client";

import Home from "@/pages/home";
import { motion } from "motion/react";
import { CompatibilityChecker } from "@/Logic/Compatibility";

export default function Page() {
  CompatibilityChecker();
  return (
    <>
      <motion.div
        className="font-mono h-dvh w-dvw bg-background scrool-smooth"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
       <Home />
      </motion.div>
    </>
  );
}
