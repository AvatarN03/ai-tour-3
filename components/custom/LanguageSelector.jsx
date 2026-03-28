"use client";

import React, { useState } from "react";
import { Languages } from "lucide-react";
import GoogleTranslate from "./GoogleTranslation";

const LanguageSelector = () => {
  const [isTranslateShow, setTranslateShow] = useState(false);

  return (
    <div role="button" onClick={() => setTranslateShow(prev => !prev)} className="p-1 w-8 h-8  flex items-center  justify-center cursor-pointer">
      <div className={isTranslateShow ? "block" : "hidden"}>
        <GoogleTranslate />
      </div>
      <div className={!isTranslateShow ? "block" : "hidden"}>
        <Languages className="w-5 h-5" />
      </div>
    </div>
  );
};

export default LanguageSelector;