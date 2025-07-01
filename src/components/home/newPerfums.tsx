import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProductCard from "./productCard";

// Données pour les nouveaux parfums - avec les mêmes images que les produits phares
const newPerfumesList = [
  {
    id: 5,
    name: "Aurora Orientale",
    description:
      "Une fragrance envoûtante avec des notes de rose, de safran et d'ambre.",
    price: 169.99,
    images: ["/perfum1.jpg"],
  },
  {
    id: 6,
    name: "Mare Nostrum",
    description:
      "Une brise marine fraîche avec des touches d'agrumes et de sel marin.",
    price: 129.99,
    images: ["/perfum2.jpg"],
  },
  {
    id: 7,
    name: "Fiore di Seta",
    description:
      "Délicat et floral avec des notes de jasmin, de pivoine et de musc blanc.",
    price: 145.99,
    images: ["/perfum3.jpg"],
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface NewPerfumsProps {
  title?: string;
  subtitle?: string;
}

const NewPerfums: React.FC<NewPerfumsProps> = ({
  title = "Nouveaux parfums",
  subtitle = "Découvrez nos créations les plus récentes, alliant innovation et tradition.",
}) => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <div ref={sectionRef} className="py-10 mb-16 w-full">
      <motion.div
        className="max-w-7xl mx-auto px-5"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        <motion.h2
          className="font-serif text-4xl text-white text-center mb-3"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>

        <motion.div
          className="w-24 h-0.5 bg-white mx-auto mb-8"
          variants={{
            hidden: { width: 0 },
            visible: { width: "6rem" },
          }}
          transition={{ duration: 0.8, delay: 0.3 }}
        ></motion.div>

        <motion.p
          className="text-center max-w-2xl mx-auto mb-10 leading-relaxed text-lg"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {newPerfumesList.map((product, index) => (
            <motion.div
              key={product.id}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NewPerfums;
