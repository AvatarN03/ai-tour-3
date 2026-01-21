import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2 group">
      <Image 
      src="/logo.png"
      alt="logo"
      width={28}
      height={28} 
      />
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        AI Tour
      </h1>
    </Link>
  );
};

export default Logo;
