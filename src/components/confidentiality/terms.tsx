import React from "react";

const Terms: React.FC = () => (
  <section className="bg-[#181818] border border-white/10 rounded-xl shadow-lg shadow-white/5 p-8 mb-12">
    <h2 className="text-2xl font-semibold text-white mb-4">Mentions Légales</h2>
    <ul className="mb-4 text-gray-400">
      <li>
        <span className="text-white font-semibold">Éditeur :</span> Sogno D'Oro
      </li>
      <li>
        <span className="text-white font-semibold">Développeur Frontend :</span>{" "}
        Nawfel Ajari
      </li>
      <li>
        <span className="text-white font-semibold">Développeur Backend :</span>{" "}
        Kristian Vasiaj
      </li>
      <li>
        <span className="text-white font-semibold">Plateforme :</span>{" "}
        Application sur mesure avec interface administrateur pour la gestion des
        produits et commandes.
      </li>
      <li>
        <span className="text-white font-semibold">Hébergement :</span>{" "}
        Hostinger VPS, Node.js, France/UE
      </li>
      <li>
        <span className="text-white font-semibold">Contact :</span>{" "}
        contact@sognodoro.com
      </li>
    </ul>
    <p className="text-gray-400 text-sm">
      Toute reproduction, même partielle, du contenu de ce site est interdite
      sans autorisation préalable.
    </p>
  </section>
);

export default Terms;
