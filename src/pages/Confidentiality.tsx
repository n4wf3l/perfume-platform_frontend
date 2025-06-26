import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Confidentiality from "../components/confidentiality/confidentiality";
import Terms from "../components/confidentiality/terms";
import Cookies from "../components/confidentiality/cookies";
import FAQ from "../components/confidentiality/faq";

const ConfidentialityPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    "confidentiality" | "terms" | "cookies"
  >("confidentiality");

  // Titre dynamique selon la section
  const sectionTitles: Record<typeof activeSection, string> = {
    confidentiality: "Politique de Confidentialité",
    terms: "Mentions Légales",
    cookies: "Gestion des Cookies",
  };

  const scrollToHash = () => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    scrollToHash();
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col">
      {/* Navigation haute */}
      <nav className="w-full bg-black border-b border-[#d4af37]/20 flex justify-center gap-8 py-8">
        <button
          onClick={() => setActiveSection("confidentiality")}
          className={`font-serif text-xl transition ${
            activeSection === "confidentiality"
              ? "text-[#d4af37] underline underline-offset-4"
              : "text-gray-300 hover:text-[#d4af37]"
          }`}
        >
          Confidentialité
        </button>
        <button
          onClick={() => setActiveSection("terms")}
          className={`font-serif text-xl transition ${
            activeSection === "terms"
              ? "text-[#d4af37] underline underline-offset-4"
              : "text-gray-300 hover:text-[#d4af37]"
          }`}
        >
          Mentions légales
        </button>
        <button
          onClick={() => setActiveSection("cookies")}
          className={`font-serif text-xl transition ${
            activeSection === "cookies"
              ? "text-[#d4af37] underline underline-offset-4"
              : "text-gray-300 hover:text-[#d4af37]"
          }`}
        >
          Cookies
        </button>
      </nav>

      {/* Contenu principal */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-serif text-[#d4af37] mb-8 text-center drop-shadow">
          {sectionTitles[activeSection]}
        </h1>
        {activeSection === "confidentiality" && <Confidentiality />}
        {activeSection === "terms" && <Terms />}
        {activeSection === "cookies" && <Cookies />}
      </main>

      {/* FAQ en bas de page */}
      <footer className="w-full bg-gradient-to-t from-black via-[#181818] to-transparent pt-12 pb-8 border-t border-[#d4af37]/10">
        <FAQ />
      </footer>
    </div>
  );
};

export default ConfidentialityPage;
