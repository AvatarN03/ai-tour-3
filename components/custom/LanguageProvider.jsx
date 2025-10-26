"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "hi", label: "हिन्दी", dir: "ltr" },
  { code: "ta", label: "தமிழ்", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

// Translation dictionaries
const translations = {
  en: {
    welcome: "Welcome",
    greeting: "Hello, {name}!",
    button: "Click me",
    // Add more translations here
  },
  hi: {
    welcome: "स्वागत है",
    greeting: "नमस्ते, {name}!",
    button: "मुझे क्लिक करें",
  },
  ta: {
    welcome: "வரவேற்கிறோம்",
    greeting: "வணக்கம், {name}!",
    button: "என்னை கிளிக் செய்யுங்கள்",
  },
  ar: {
    welcome: "مرحباً",
    greeting: "مرحباً، {name}!",
    button: "انقر فوقي",
  },
};

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  languages: SUPPORTED_LANGUAGES,
  t: (key) => key,
});

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved) setLanguage(saved);
  }, []);

  useEffect(() => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0];
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      html.setAttribute("lang", lang.code);
      html.setAttribute("dir", lang.dir);
      html.classList.toggle("rtl", lang.dir === "rtl");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", language);
    }
  }, [language]);

  // Translation function
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
      translation = translation?.[k];
    }
    
    if (!translation) {
      // Fallback to English
      translation = translations.en;
      for (const k of keys) {
        translation = translation?.[k];
      }
    }
    
    if (!translation) return key;
    
    // Replace parameters like {name}
    return Object.keys(params).reduce(
      (str, param) => str.replace(`{${param}}`, params[param]),
      translation
    );
  };

  const value = useMemo(
    () => ({ language, setLanguage, languages: SUPPORTED_LANGUAGES, t }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// Convenience hook for just the translation function
export function useTranslation() {
  const { t } = useContext(LanguageContext);
  return { t };
}