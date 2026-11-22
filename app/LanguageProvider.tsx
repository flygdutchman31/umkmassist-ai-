"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Language = "id" | "en";
const STORAGE_KEY = "deni-jaya-language";
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void } | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>("id");
  useEffect(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(STORAGE_KEY); } catch { /* Browser storage can be unavailable. */ }
    const preferred = navigator.languages?.[0] || navigator.language || "id";
    updateLanguage(saved === "id" || saved === "en" ? saved : preferred.toLowerCase().startsWith("id") ? "id" : "en");
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  function setLanguage(value: Language) {
    updateLanguage(value);
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch { /* Switching still works without storage. */ }
  }
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider is missing");
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return <label className="language-switcher"><span className="language-label">{language === "id" ? "Bahasa" : "Language"}</span><select aria-label={language === "id" ? "Pilih bahasa" : "Choose language"} value={language} onChange={event => setLanguage(event.target.value as Language)}><option value="id">ID</option><option value="en">EN</option></select></label>;
}
