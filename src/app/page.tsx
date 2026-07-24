"use client";

import Home from "@/pages/home";
import { motion } from "motion/react";

export default function Page() {
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
