import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enFileImport from "./locales/en";
import frFileImport from "./locales/fr";
import nlFileImport from "./locales/nl";

const enFile = (enFileImport as any).default || enFileImport;
const frFile = (frFileImport as any).default || frFileImport;
const nlFile = (nlFileImport as any).default || nlFileImport;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: enFile },
      fr: { translation: frFile },
      nl: { translation: nlFile },
    },
    detection: {
      // Priorité : localStorage > querystring > navigator > htmlTag > path > subdomain
      order: [
        "localStorage",
        "querystring",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["localStorage"], // Stocke la langue dans le localStorage
    },
  });

export default i18n;
