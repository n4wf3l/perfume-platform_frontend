import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Les questions/réponses sont traduites via i18n
  const faqData = [
    {
      question: t("contact.faq.q1"),
      answer: t("contact.faq.a1"),
    },
    {
      question: t("contact.faq.q2"),
      answer: t("contact.faq.a2"),
    },
    {
      question: t("contact.faq.q3"),
      answer: t("contact.faq.a3"),
    },
    {
      question: t("contact.faq.q4"),
      answer: t("contact.faq.a4"),
    },
    {
      question: t("contact.faq.q5"),
      answer: t("contact.faq.a5"),
    },
    {
      question: t("contact.faq.q6"),
      answer: t("contact.faq.a6"),
    },
    {
      question: t("contact.faq.q7"),
      answer: t("contact.faq.a7"),
    },
    {
      question: t("contact.faq.q8"),
      answer: t("contact.faq.a8"),
    },
    {
      question: t("contact.faq.q9"),
      answer: t("contact.faq.a9"),
    },
    {
      question: t("contact.faq.q10"),
      answer: t("contact.faq.a10"),
    },
    {
      question: t("contact.faq.q11"),
      answer: t("contact.faq.a11"),
    },
    {
      question: t("contact.faq.q12"),
      answer: t("contact.faq.a12"),
    },
    {
      question: t("contact.faq.q13"),
      answer: t("contact.faq.a13"),
    },
    {
      question: t("contact.faq.q14"),
      answer: t("contact.faq.a14"),
    },
    {
      question: t("contact.faq.q15"),
      answer: t("contact.faq.a15"),
    },
    {
      question: t("contact.faq.q16"),
      answer: t("contact.faq.a16"),
    },
    {
      question: t("contact.faq.q17"),
      answer: t("contact.faq.a17"),
    },
    {
      question: t("contact.faq.q18"),
      answer: t("contact.faq.a18"),
    },
    {
      question: t("contact.faq.q19"),
      answer: t("contact.faq.a19"),
    },
  ];

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
