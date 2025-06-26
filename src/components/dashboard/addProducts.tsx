import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const AddProducts: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Données du formulaire
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    notes: {
      top: "",
      middle: "",
      base: "",
    },
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

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

    // Simuler un délai de traitement
    setTimeout(() => {
      console.log("Produit ajouté:", formData);
      console.log("Images:", images);
      setIsSubmitting(false);
      navigate("/dashboard/products");
    }, 1000);
  };

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
          <div className="space-y-4">
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

            {/* Catégorie */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Catégorie *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Eau de Parfum">Eau de Parfum</option>
                <option value="Parfum">Parfum</option>
                <option value="Eau de Toilette">Eau de Toilette</option>
                <option value="Eau de Cologne">Eau de Cologne</option>
              </select>
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

          {/* Description et notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#d4af37] mb-4">
              Description et notes
            </h3>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              ></textarea>
            </div>

            {/* Notes de tête */}
            <div>
              <label
                htmlFor="notes.top"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Notes de tête
              </label>
              <input
                type="text"
                id="notes.top"
                name="notes.top"
                value={formData.notes.top}
                onChange={handleChange}
                placeholder="Ex: Bergamote, Citron, Lavande"
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            {/* Notes de cœur */}
            <div>
              <label
                htmlFor="notes.middle"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Notes de cœur
              </label>
              <input
                type="text"
                id="notes.middle"
                name="notes.middle"
                value={formData.notes.middle}
                onChange={handleChange}
                placeholder="Ex: Jasmin, Rose, Tubéreuse"
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            {/* Notes de fond */}
            <div>
              <label
                htmlFor="notes.base"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Notes de fond
              </label>
              <input
                type="text"
                id="notes.base"
                name="notes.base"
                value={formData.notes.base}
                onChange={handleChange}
                placeholder="Ex: Musc, Bois de Santal, Vanille"
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-[#d4af37] mb-4">
            Images du produit
          </h3>

          <div className="border-2 border-dashed border-gray-700 p-6 rounded-md bg-gray-800/50 flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-500 mb-2"
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
            <p className="text-gray-400 text-sm mb-4">
              Glissez-déposez vos images ou cliquez pour parcourir
            </p>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="images"
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-md transition-colors duration-300 cursor-pointer"
            >
              Ajouter des images
            </label>
          </div>

          {/* Prévisualisation des images */}
          {images.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Preview ${index}`}
                    className="h-32 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                </div>
              ))}
            </div>
          )}
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
    </motion.div>
  );
};

export default AddProducts;
