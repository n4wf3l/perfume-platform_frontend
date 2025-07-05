import React from "react";

interface DescriptionProps {
  description?: string;
  ingredientsDescription?: string;
}

const Description: React.FC<DescriptionProps> = ({
  description,
  ingredientsDescription,
}) => {
  if (!description) return null;
  
  const firstLetter = description.charAt(0);
  const rest = description.slice(1);

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
              Histoire
            </span>
            <p className="font-serif text-lg text-white leading-relaxed tracking-wide">
              {rest}
            </p>
          </div>
        </div>
        {/* Bloc Ingrédients */}
        {ingredientsDescription && (
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
                Ingrédients
              </span>
              <p className="font-serif text-base text-white tracking-wide">
                {ingredientsDescription}
              </p>
            </div>
          </div>
        )}
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
