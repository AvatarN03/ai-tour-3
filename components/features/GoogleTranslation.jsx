"use client";
import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById("google-translate-script")) {
      // Script already exists, just init if google is ready
      if (window.google?.translate) {
        window.googleTranslateElementInit?.();
      }
      return;
    }

    window.googleTranslateElementInit = () => {
      // Prevent duplicate widget init
      const el = document.getElementById("google_translate_element");
      if (!el || el.innerHTML !== "") return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,mr,ta,te,kn,ml,gu,pa,bn,fr,ar,ja",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element" />;
}