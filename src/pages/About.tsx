import React from "react";
import Hero from "../components/about/hero";
import Header from "../components/about/header";
import History from "../components/about/history";
import Parcours from "../components/about/parcours";
import Values from "../components/about/values";
import TwoGifs from "../components/about/twoGifs";
import CTA from "../components/about/cta";
import { Helmet } from "react-helmet"; // Ajout de Helmet pour les meta tags

const About: React.FC = () => {
  return (
    <>
      {/* Meta tags SEO pour la page À propos */}
      <Helmet>
        <title>Notre Histoire | SOGNO D'ORO® | Belgian Luxury Perfums</title>
        <meta
          name="description"
          content="Découvrez l'histoire et les valeurs de SOGNO D'ORO, marque belge de parfumerie de luxe. Notre passion pour les fragrances d'exception et notre engagement pour la qualité définissent chacune de nos créations."
        />

        {/* Liens canoniques */}
        <link rel="canonical" href="https://www.sognodoro.be/about" />

        {/* Open Graph Tags pour Facebook/Instagram */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Notre Histoire | SOGNO D'ORO" />
        <meta
          property="og:description"
          content="Découvrez l'histoire et les valeurs qui font de SOGNO D'ORO une marque de parfumerie belge unique et passionnée."
        />
        <meta property="og:url" content="https://www.sognodoro.be/about" />
        <meta
          property="og:image"
          content="https://www.sognodoro.be/about-brand.jpg"
        />
        <meta property="og:site_name" content="SOGNO D'ORO" />

        {/* Structured Data pour la page À propos */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "name": "À Propos de SOGNO D'ORO",
              "description": "L'histoire et les valeurs derrière la marque belge de parfums de luxe SOGNO D'ORO",
              "url": "https://www.sognodoro.be/about",
              "mainEntity": {
                "@type": "Organization",
                "name": "SOGNO D'ORO",
                "url": "https://www.sognodoro.be",
                "logo": "https://www.sognodoro.be/logo.png",
                "foundingDate": "2023",
                "foundingLocation": "Belgique",
                "description": "Marque belge de parfumerie de luxe, alliant tradition et innovation dans des fragrances d'exception.",
                "sameAs": [
                  "https://www.instagram.com/sogno.doro_profumo",
                  "https://snapchat.com/add/sogno-doro"
                ]
              }
            }
          `}
        </script>
      </Helmet>

      <div className="min-h-screen bg-black text-gray-200">
        {/* Section Hero avec Vidéo en arrière-plan */}
        <Hero />

        {/* Section Header avec Biographie */}
        <Header />

        {/* Section avec deux GIFs */}
        <TwoGifs />

        {/* Section Notre Histoire */}
        <History />

        {/* Section Notre Parcours */}
        <Parcours />

        {/* Section Nos Valeurs */}
        <Values />

        {/* Section CTA */}
        <CTA />
      </div>
    </>
  );
};

export default About;
