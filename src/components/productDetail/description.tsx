import React from "react";
import { useTranslation } from "react-i18next";

interface DescriptionProps {
  description: string;
  ingredientsDescription?: string;
}

const Description: React.FC<DescriptionProps> = ({
  description,
  ingredientsDescription,
}) => {
  const { t } = useTranslation();
  const firstLetter = description.charAt(0);
  const rest = description.slice(1);

  // Détection mobile simple
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <section className="w-full bg-black py-16 px-4 flex justify-center">
      <div className="max-w-4xl w-full flex flex-col gap-16">
        {/* Bloc Histoire */}
        <div className="flex flex-row items-start gap-8">
          <span
            className="font-serif text-[7rem] leading-none text-white select-none"
            style={{ letterSpacing: "0.05em", lineHeight: "1" }}
          >
            {firstLetter}
          </span>
          <div className="flex-1">
            <span className="inline-block text-xs uppercase tracking-widest text-white bg-white/10 px-3 py-1 rounded-full mb-4">
              {t("product.description")}
            </span>
            <p className="font-serif text-lg text-white leading-relaxed tracking-wide">
              {rest}
            </p>
          </div>
        </div>
        {/* Bloc Ingrédients */}
        {ingredientsDescription &&
          (isMobile ? (
            <div className="flex flex-col items-center justify-center mt-10 w-full">
              <span className="inline-block text-xs uppercase tracking-widest text-white bg-white/10 px-3 py-1 rounded-full mb-4 text-center">
                {t("product.ingredients")}
              </span>
              <p className="font-serif text-base text-white tracking-wide text-left max-w-xs w-full">
                {ingredientsDescription}
              </p>
            </div>
          ) : (
            <div className="flex flex-row items-start gap-8">
              {/* Pour garder l'alignement, on met un span vide de même taille */}
              <span
                className="font-serif text-[7rem] leading-none text-white select-none opacity-0"
                style={{ letterSpacing: "0.05em", lineHeight: "1" }}
                aria-hidden
              >
                {firstLetter}
              </span>
              <div className="flex-1">
                <span className="inline-block text-xs uppercase tracking-widest text-white bg-white/10 px-3 py-1 rounded-full mb-4">
                  {t("product.ingredients")}
                </span>
                <p className="font-serif text-base text-white tracking-wide">
                  {ingredientsDescription}
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Description;

const product = {
  // ...
  description: "Votre histoire...",
  ingredientsDescription: "Liste ou description des ingrédients ici.",
};
