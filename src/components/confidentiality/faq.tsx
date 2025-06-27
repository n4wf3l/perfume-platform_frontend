import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Comment choisir le parfum qui me correspond ?",
    answer:
      "Chaque fiche produit détaille les notes olfactives et l’univers du parfum. Tu peux aussi filtrer par famille olfactive (floral, boisé, oriental, etc.) ou demander conseil via notre formulaire de contact.",
  },
  {
    question: "Vos parfums sont-ils authentiques et de qualité ?",
    answer:
      "Oui, tous nos parfums sont authentiques, originaux et sélectionnés avec soin auprès de créateurs et maisons reconnues. Nous garantissons la traçabilité et la qualité de chaque produit.",
  },
  {
    question: "Puis-je commander un échantillon avant d’acheter ?",
    answer:
      "Nous proposons régulièrement des coffrets découverte ou des échantillons à l’achat. Consulte la page produit ou contacte-nous pour connaître les disponibilités.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer:
      "Les commandes sont expédiées sous 24 à 48h (hors week-end et jours fériés). La livraison prend généralement 2 à 5 jours ouvrés selon la destination.",
  },
  {
    question: "Comment suivre ma commande ?",
    answer:
      "Dès l’expédition, tu reçois un email avec un lien de suivi. Tu peux aussi retrouver le suivi dans ton espace client.",
  },
  {
    question: "Puis-je retourner un parfum si je change d’avis ?",
    answer:
      "Oui, tu disposes de 14 jours après réception pour nous retourner un parfum non ouvert et non utilisé. Contacte-nous pour la procédure de retour.",
  },
  {
    question: "Comment sont emballés les parfums ?",
    answer:
      "Chaque parfum est soigneusement emballé dans un colis sécurisé, avec protection anti-choc, pour garantir une livraison sans risque.",
  },
  {
    question: "Proposez-vous des cartes cadeaux ?",
    answer:
      "Oui, tu peux offrir une carte cadeau digitale valable sur toute la boutique. Rendez-vous dans la section Cartes Cadeaux.",
  },
  {
    question: "Puis-je offrir un parfum et faire livrer à une autre adresse ?",
    answer:
      "Oui, il suffit de renseigner l’adresse de livraison souhaitée lors de la commande. Aucun prix n’apparaît dans le colis.",
  },
  {
    question: "Comment utiliser un code promo ?",
    answer:
      "Tu peux saisir ton code promo dans le panier ou lors du paiement. La réduction s’appliquera automatiquement si le code est valide.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les paiements par carte bancaire (Visa, Mastercard, etc.) via une plateforme sécurisée. Les paiements sont cryptés et protégés.",
  },
  {
    question: "Puis-je modifier ou annuler ma commande après validation ?",
    answer:
      "Contacte-nous au plus vite via le formulaire ou WhatsApp. Si la commande n’est pas encore expédiée, nous pouvons la modifier ou l’annuler.",
  },
  {
    question: "Livrez-vous à l’international ?",
    answer:
      "Oui, nous livrons dans de nombreux pays. Les frais et délais de livraison sont indiqués lors de la commande selon la destination.",
  },
  {
    question: "Comment entretenir et conserver mon parfum ?",
    answer:
      "Garde ton parfum à l’abri de la lumière, de la chaleur et de l’humidité pour préserver ses qualités olfactives. Referme bien le flacon après usage.",
  },
  {
    question: "Les parfums sont-ils testés sur les animaux ?",
    answer:
      "Non, nos partenaires et créateurs respectent la réglementation européenne interdisant les tests sur animaux.",
  },
  {
    question: "Proposez-vous des parfums vegan ou naturels ?",
    answer:
      "Certains parfums de notre sélection sont vegan ou à base d’ingrédients naturels. Consulte la fiche produit ou contacte-nous pour plus d’informations.",
  },
  {
    question: "Comment recevoir des conseils personnalisés ?",
    answer:
      "Utilise notre formulaire de contact ou écris-nous sur WhatsApp pour bénéficier de recommandations adaptées à tes goûts.",
  },
  {
    question: "Puis-je cumuler plusieurs codes promo ?",
    answer:
      "Non, un seul code promo peut être utilisé par commande, sauf indication contraire lors d’opérations spéciales.",
  },
  {
    question: "Que faire si mon colis est endommagé ou perdu ?",
    answer:
      "Contacte-nous immédiatement avec une photo du colis ou ton numéro de commande. Nous trouverons une solution rapide (remboursement, renvoi, etc.).",
  },
  {
    question: "Comment être informé des nouveautés et offres ?",
    answer:
      "Inscris-toi à notre newsletter ou suis-nous sur les réseaux sociaux pour ne rien manquer des nouveautés, offres et conseils parfum.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div id="faq" className="max-w-2xl mx-auto px-4">
      <motion.h2
        className="text-3xl font-serif text-white mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        FAQ
      </motion.h2>
      <div className="space-y-4">
        {faqData.map((faq, idx) => (
          <motion.div
            key={faq.question}
            className="bg-[#181818] border border-white/10 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-white focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
            >
              {faq.question}
              <motion.span
                animate={{ rotate: openIndex === idx ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-5 h-5 ml-2 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === idx && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-6 pb-4 text-gray-300"
                >
                  <div>{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
