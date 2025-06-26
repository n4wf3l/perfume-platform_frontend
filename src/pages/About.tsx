import React from "react";
import Hero from "../components/about/hero";
import Header from "../components/about/header";
import History from "../components/about/history";
import Parcours from "../components/about/parcours";
import Values from "../components/about/values";
import CTA from "../components/about/cta";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Section Hero avec Vidéo en arrière-plan */}
      <Hero />

      {/* Section Header avec Biographie */}
      <Header />

      {/* Section Notre Histoire */}
      <History />

      {/* Section Notre Parcours */}
      <Parcours />

      {/* Section Nos Valeurs */}
      <Values />

      {/* Section CTA */}
      <CTA />
    </div>
  );
};

export default About;
