import React from "react";

const Cookies: React.FC = () => (
  <section className="bg-[#181818] border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5 p-8 mb-12">
    <h2 className="text-2xl font-semibold text-[#d4af37] mb-4">
      Gestion des Cookies
    </h2>
    <p className="mb-4 text-gray-400">
      Ce site n'utilise{" "}
      <span className="text-[#d4af37] font-semibold">aucun cookie</span> de
      suivi, de publicité ou d'analyse.
    </p>
    <ul className="list-disc ml-6 mb-4 text-gray-400">
      <li>
        Seuls des cookies techniques essentiels peuvent être utilisés pour
        garantir le bon fonctionnement du site (ex : gestion de session,
        panier).
      </li>
      <li>
        Aucun cookie tiers, traceur ou outil d’analyse n’est présent sur la
        plateforme.
      </li>
      <li>Vous n’avez donc aucune bannière de consentement à accepter.</li>
    </ul>
    <p className="text-gray-400 text-sm">
      Plateforme développée sur mesure, respectueuse de votre vie privée et
      conforme au RGPD.
    </p>
  </section>
);

export default Cookies;
