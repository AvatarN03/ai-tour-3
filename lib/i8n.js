import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../locales/en/common.json";
import ta from "../locales/ta/common.json";
import fr from "../locales/fr/common.json";
import mr from "../locales/mr/common.json";
import ar from "../locales/ar/common.json";

const resources = {
  en: {
    translation: en,
  },
  ta: {
    translation: ta,
  },
  fr: {
    translation: fr,
  },
  mr: {
    translation: mr,
  },
  ar: {
    translation: ar,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;