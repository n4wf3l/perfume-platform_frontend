import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Comment choisir le parfum qui me correspond ?",
    answer:
      "Un parfum, c’est personnel. Il évoque des souvenirs, des émotions, une identité. Nous proposons des inspirations variées : boisés, floraux, orientaux, gourmands... Décrivez-nous ce que vous aimez (ou ce que vous portez déjà), et nous vous aiderons avec plaisir à trouver celui qui vous correspond le mieux.",
  },
  {
    question: "Vos parfums sont-ils authentiques et de qualité ?",
    answer:
      "Oui. Nos parfums sont inspirés de fragrances de niche reconnues, sélectionnées pour leur élégance et leur caractère. Nous travaillons avec des laboratoires sérieux et des essences de qualité, afin de vous proposer des parfums durables, fidèles et accessibles, sans compromis sur l’émotion.",
  },
  {
    question: "Puis-je commander un échantillon avant d’acheter ?",
    answer:
      "Oui, c’est possible. Nous savons qu’un parfum se découvre sur la peau, pas à travers un écran. Vous pouvez commander un échantillon pour tester tranquillement chez vous et trouver celui qui vous parle vraiment.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer:
      "En moyenne, entre 2 et 5 jours ouvrables. Nous préparons chaque commande avec soin et faisons tout pour que votre parfum arrive rapidement et en parfait état.",
  },
  {
    question: "Comment suivre ma commande ?",
    answer:
      "Dès l’envoi, vous recevez un mail avec un lien de suivi. Vous pourrez voir en temps réel où se trouve votre colis.",
  },
  {
    question: "Puis-je retourner un parfum si je change d’avis ?",
    answer:
      "Oui, tant que le flacon est neuf, non ouvert et dans son emballage d’origine. Vous disposez de 14 jours pour changer d’avis, car nous souhaitons que votre achat soit un plaisir, jamais une pression.",
  },
  {
    question: "Comment sont emballés les parfums ?",
    answer:
      "Avec beaucoup de soin. Chaque parfum est protégé et présenté dans un emballage sobre mais élégant. L’ouverture du colis doit déjà être une petite émotion.",
  },
  {
    question: "Proposez-vous des cartes cadeaux ?",
    answer:
      "Oui ! Si vous souhaitez faire plaisir sans vous tromper, la carte cadeau est parfaite. Nous pouvons également y glisser un petit mot personnalisé si vous le souhaitez.",
  },
  {
    question: "Puis-je offrir un parfum et faire livrer à une autre adresse ?",
    answer:
      "Bien sûr. Il suffit d’indiquer l’adresse du destinataire lors de votre commande. Et si c’est un cadeau, vous pouvez aussi nous demander d’ajouter un message personnalisé.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Carte bancaire, PayPal, et d’autres options selon votre pays. Le paiement est 100 % sécurisé.",
  },
  {
    question: "Puis-je modifier ou annuler ma commande après validation ?",
    answer:
      "Si votre commande n’est pas encore envoyée, oui. Contactez-nous rapidement et nous ferons notre maximum pour vous aider.",
  },
  {
    question: "Livrez-vous à l’international ?",
    answer:
      "Oui, nous livrons dans plusieurs pays. Les délais et frais varient selon la destination, mais nous vous donnerons toutes les informations dès votre commande.",
  },
  {
    question: "Comment entretenir et conserver mon parfum ?",
    answer:
      "Gardez votre parfum à l’abri de la chaleur, de l’humidité et de la lumière directe. Un endroit sec, à température ambiante, est idéal pour qu’il garde toute son intensité.",
  },
  {
    question: "Les parfums sont-ils testés sur les animaux ?",
    answer:
      "Non. Aucun de nos parfums n’est testé sur les animaux. C’est une valeur à laquelle nous tenons.",
  },
  {
    question: "Proposez-vous des parfums vegan ou naturels ?",
    answer:
      "Non, il ne s'agit pas de parfums naturels, mais d’inspirations de parfums de niche. Ils sont créés avec des compositions de synthèse sûres et réglementées, sans ingrédients d’origine animale.",
  },
  {
    question: "Comment recevoir des conseils personnalisés ?",
    answer:
      "Vous pouvez nous contacter directement (par mail ou réseaux sociaux), nous prenons le temps de répondre à chacun. Parler parfum est toujours un plaisir pour nous.",
  },
  {
    question: "Que faire si mon colis est endommagé ou perdu ?",
    answer:
      "Contactez-nous rapidement, avec une photo si possible. Nous trouverons une solution rapide : votre parfum doit vous parvenir comme il se doit.",
  },
  {
    question: "Comment être informé(e) des nouveautés et offres ?",
    answer:
      "Vous pouvez vous abonner à notre newsletter ou nous suivre sur les réseaux sociaux. Nous partageons nos nouveautés, des conseils et aussi un peu de notre univers parfumé.",
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
