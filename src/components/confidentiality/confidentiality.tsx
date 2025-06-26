import React from "react";

const Confidentiality: React.FC = () => (
  <section className="bg-[#181818] border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5 p-8 mb-12">
    <h2 className="text-2xl font-semibold text-[#d4af37] mb-4">
      Politique de Confidentialité
    </h2>
    <p className="mb-4 text-gray-300">
      Nous accordons une importance capitale à la protection de vos données
      personnelles et au respect de votre vie privée. Cette politique explique
      quelles informations nous collectons, comment nous les utilisons, et quels
      sont vos droits.
    </p>
    <h3 className="text-xl font-semibold text-[#d4af37] mt-8 mb-2">
      Quelles données collectons-nous&nbsp;?
    </h3>
    <ul className="list-disc ml-6 mb-4 text-gray-400">
      <li>
        <span className="text-[#d4af37] font-semibold">
          Langue de préférence
        </span>
        : enregistrée localement dans votre navigateur (localStorage) pour
        améliorer votre expérience utilisateur.
      </li>
      <li>
        <span className="text-[#d4af37] font-semibold">
          Produits sélectionnés
        </span>
        : nous mémorisons les produits que vous choisissez afin de faciliter
        votre navigation et votre commande.
      </li>
      <li>
        <span className="text-[#d4af37] font-semibold">
          Coordonnées personnelles
        </span>
        : nom, prénom, adresse, email, numéro de téléphone, nécessaires pour la
        gestion de vos commandes et la livraison.
      </li>
      <li>
        <span className="text-[#d4af37] font-semibold">
          Coordonnées bancaires
        </span>
        : collectées uniquement lors du paiement, via une connexion sécurisée.
        Nous ne stockons jamais vos données bancaires sur nos serveurs.
      </li>
      <li>
        <span className="text-[#d4af37] font-semibold">Numéro WhatsApp</span> :
        si vous nous contactez via WhatsApp, votre numéro est conservé dans
        l’historique de nos discussions.
      </li>
      <li>
        <span className="text-[#d4af37] font-semibold">
          Historique de commandes
        </span>
        : vos commandes sont enregistrées dans notre base de données ultra
        sécurisée, hébergée sur un VPS Hostinger (Node.js).
      </li>
    </ul>
    <h3 className="text-xl font-semibold text-[#d4af37] mt-8 mb-2">
      Comment utilisons-nous vos données&nbsp;?
    </h3>
    <ul className="list-disc ml-6 mb-4 text-gray-400">
      <li>Pour traiter vos commandes et assurer la livraison.</li>
      <li>
        Pour vous contacter en cas de besoin (service client, suivi de commande,
        etc.).
      </li>
      <li>
        Pour améliorer votre expérience sur la plateforme (langue, préférences,
        etc.).
      </li>
      <li>Pour répondre à vos demandes via WhatsApp ou email.</li>
      <li>Pour respecter nos obligations légales et fiscales.</li>
    </ul>
    <h3 className="text-xl font-semibold text-[#d4af37] mt-8 mb-2">
      Sécurité et conservation des données
    </h3>
    <ul className="list-disc ml-6 mb-4 text-gray-400">
      <li>
        Toutes les données sont stockées sur des serveurs sécurisés (VPS
        Hostinger, France/UE).
      </li>
      <li>
        Les accès à la base de données sont strictement limités à l’équipe
        technique (Nawfel Ajari, Kristian Vasiaj).
      </li>
      <li>
        Les paiements sont traités via des solutions sécurisées et certifiées
        PCI DSS. Nous ne stockons jamais vos données bancaires.
      </li>
      <li>
        Les historiques de commandes sont conservés aussi longtemps que
        nécessaire pour la gestion commerciale et fiscale, sauf demande de
        suppression de votre part.
      </li>
    </ul>
    <h3 className="text-xl font-semibold text-[#d4af37] mt-8 mb-2">
      Vos droits
    </h3>
    <ul className="list-disc ml-6 mb-4 text-gray-400">
      <li>
        Conformément au RGPD, vous pouvez demander à tout moment l’accès, la
        rectification ou la suppression de vos données personnelles en nous
        contactant à{" "}
        <a
          href="mailto:contact@sognodoro.com"
          className="text-[#d4af37] underline"
        >
          contact@sognodoro.com
        </a>
        .
      </li>
      <li>
        Vous pouvez également demander la suppression de votre historique de
        commandes ou de vos échanges WhatsApp.
      </li>
      <li>
        Nous nous engageons à traiter toute demande dans un délai maximum de 30
        jours.
      </li>
    </ul>
    <h3 className="text-xl font-semibold text-[#d4af37] mt-8 mb-2">
      Transparence et conformité
    </h3>
    <ul className="list-disc ml-6 mb-4 text-gray-400">
      <li>
        Plateforme développée sur mesure, sans utilisation de solutions tierces
        de tracking ou de publicité.
      </li>
      <li>
        Aucun cookie publicitaire ou de suivi n’est utilisé (voir section
        Cookies).
      </li>
      <li>
        Nous respectons strictement la législation européenne sur la protection
        des données (RGPD/GDPR).
      </li>
      <li>
        En cas de faille de sécurité, vous serez informé dans les meilleurs
        délais conformément à la réglementation.
      </li>
    </ul>
    <p className="mt-6 text-gray-400 text-sm italic">
      Pour toute question relative à la confidentialité ou à la gestion de vos
      données, contactez-nous à{" "}
      <a
        href="mailto:contact@sognodoro.com"
        className="text-[#d4af37] underline"
      >
        contact@sognodoro.com
      </a>
      .
    </p>
  </section>
);

export default Confidentiality;
