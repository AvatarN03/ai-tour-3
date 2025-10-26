import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2 group">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
      >
        <Sparkles className="w-5 h-5 text-white" />
      </motion.div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        AI Tour
      </h1>
    </Link>
  );
};

export default Logo;
