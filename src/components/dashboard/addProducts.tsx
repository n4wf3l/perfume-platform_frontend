import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Toast from "../common/Toast";

const categoryOptions = [
  "Eau de Parfum",
  "Parfum",
  "Eau de Toilette",
  "Eau de Cologne",
];

const AddProducts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);

  // Données du formulaire modifiées - notes remplacées par size (ml)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    size: "", // Nouveau champ pour la taille en ML
    featured: false,
  });

  // Animation variants
  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  // Gérer le changement dans les inputs du formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gérer le changement pour les checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Gestion de l'ajout d'images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newImages.push(URL.createObjectURL(files[i]));
    }

    setImages([...images, ...newImages]);
  };

  // Supprimer une image
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard/products", { state: { showToast: true } });
    }, 1000);
  };

  // Pour le menu déroulant animé
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.state?.showToast) {
      setToastVisible(true);
      // Optionnel : nettoyer le state pour éviter de réafficher le toast si on revient sur la page
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-[#d4af37]">
          Ajouter un Parfum
        </h2>
        <button
          onClick={() => navigate("/dashboard/products")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Retour
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-xl border border-[#d4af37]/10 p-6 shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations générales */}
          <div className="space-y-4 flex flex-col h-full">
            <h3 className="text-lg font-medium text-[#d4af37] mb-4">
              Informations générales
            </h3>

            {/* Nom */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Nom du parfum *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            {/* Catégorie - Menu déroulant animé */}
            <div ref={categoryRef} className="relative">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Catégorie *
              </label>
              <button
                type="button"
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition"
                onClick={() => setCategoryOpen((open) => !open)}
              >
                {formData.category || "Sélectionner une catégorie"}
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <motion.ul
                initial={false}
                animate={categoryOpen ? "open" : "closed"}
                variants={{
                  open: {
                    opacity: 1,
                    y: 0,
                    pointerEvents: "auto",
                    transition: { duration: 0.35, ease: "easeInOut" },
                  },
                  closed: {
                    opacity: 0,
                    y: -10,
                    pointerEvents: "none",
                    transition: { duration: 0.35, ease: "easeInOut" },
                  },
                }}
                className="absolute z-10 mt-2 w-full bg-gray-900 border border-[#d4af37]/30 rounded-md shadow-lg overflow-hidden"
              >
                {categoryOptions.map((option) => (
                  <li
                    key={option}
                    className={`px-4 py-2 cursor-pointer hover:bg-[#d4af37]/10 text-gray-200 ${
                      formData.category === option
                        ? "bg-[#d4af37]/20 text-[#d4af37]"
                        : ""
                    }`}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        category: option,
                      }));
                      setCategoryOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Taille en ML - Nouveau champ */}
            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Taille (mL) *
              </label>
              <input
                type="number"
                id="size"
                name="size"
                required
                min="1"
                value={formData.size}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            {/* Prix */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Prix (€) *
              </label>
              <input
                type="text"
                id="price"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            {/* À la une */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-[#d4af37] rounded bg-gray-800 border-gray-700 focus:ring-[#d4af37] focus:ring-opacity-25"
              />
              <label
                htmlFor="featured"
                className="ml-2 block text-sm font-medium text-gray-300"
              >
                Mettre ce produit en avant sur la page d'accueil
              </label>
            </div>
          </div>

          {/* Description - colonne droite animée et hauteur synchronisée */}
          <motion.div
            className="space-y-4 flex flex-col h-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium text-[#d4af37] mb-4">
              Description
            </h3>
            <div className="flex-1 flex flex-col">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={16}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le parfum, ses caractéristiques et son profil olfactif..."
                className="w-full h-full min-h-[220px] py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] resize-none"
                style={{ minHeight: "100%" }}
              ></textarea>
            </div>
          </motion.div>
        </div>

        {/* Images */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-[#d4af37] mb-4">
            Images du produit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-md bg-gray-800/50 h-40 group"
              >
                {images[idx] ? (
                  <>
                    <img
                      src={images[idx]}
                      alt={`Preview ${idx}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                      title="Supprimer cette image"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <label
                      htmlFor={`image-upload-${idx}`}
                      className="flex flex-col items-center justify-center cursor-pointer h-full w-full"
                    >
                      <svg
                        className="w-10 h-10 text-gray-500 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <span className="text-gray-400 text-xs text-center">
                        Ajouter une image
                      </span>
                      <input
                        type="file"
                        id={`image-upload-${idx}`}
                        name="images"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const newImages = [...images];
                            newImages[idx] = URL.createObjectURL(file);
                            setImages(newImages.slice(0, 3));
                          }
                        }}
                      />
                    </label>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Boutons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
            className="px-6 py-2 border border-gray-700 text-gray-300 rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-[#d4af37] hover:bg-[#c5a028] text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#d4af37] ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enregistrement...
              </span>
            ) : (
              "Enregistrer"
            )}
          </button>
        </div>
      </form>

      {/* Toast de confirmation */}
      {toastVisible && (
        <Toast
          message="Produit ajouté avec succès !"
          isVisible={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      )}
    </motion.div>
  );
};

export default AddProducts;
