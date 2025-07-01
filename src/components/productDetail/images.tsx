import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImagesProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  productName: string;
}

const Images: React.FC<ImagesProps> = ({
  images,
  currentImageIndex,
  setCurrentImageIndex,
  productName,
}) => {
  // Détection mobile simple
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className={isMobile ? "w-full" : "lg:w-1/2"}>
      <motion.div
        className={`bg-black rounded-lg overflow-hidden mb-4 relative ${
          isMobile ? "w-full h-[340px] sm:h-[400px]" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={
          isMobile
            ? { height: "340px", maxHeight: "60vw", minHeight: "220px" }
            : { height: "500px" }
        }
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={productName}
            className={`w-full h-full object-cover absolute inset-0 ${
              isMobile ? "object-contain bg-black" : ""
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={isMobile ? { objectFit: "contain" } : { objectFit: "cover" }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Sélecteur de miniatures */}
      {images.length > 1 && (
        <motion.div
          className={`flex gap-2 overflow-x-auto py-2 justify-center ${
            isMobile ? "px-2" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {images.map((image: string, index: number) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                currentImageIndex === index
                  ? "border-white"
                  : "border-transparent"
              } ${isMobile ? "w-14 h-14" : ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`${productName} - ${index + 1}`}
                className={`w-full h-full ${
                  isMobile ? "object-contain bg-black" : "object-cover"
                }`}
                style={
                  isMobile ? { objectFit: "contain" } : { objectFit: "cover" }
                }
              />
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Images;
