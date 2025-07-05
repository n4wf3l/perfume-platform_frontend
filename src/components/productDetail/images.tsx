import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductImage } from "../../types/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

interface ImagesProps {
  images?: ProductImage[];
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
  return (
    <div className="lg:w-1/2">
      <motion.div
        className="bg-black rounded-lg overflow-hidden mb-4 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ height: "500px" }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images && images.length > 0 ? `${IMAGE_URL}/${images[currentImageIndex].path}` : '/perfum1.jpg'}
            alt={productName}
            className="w-full h-full object-cover absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Sélecteur de miniatures */}
      {images && images.length > 1 && (
        <motion.div
          className="flex gap-2 overflow-x-auto py-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {images.map((image, index: number) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                currentImageIndex === index
                  ? "border-white"
                  : "border-transparent"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={`${IMAGE_URL}/${image.path}`}
                alt={`${productName} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Images;
