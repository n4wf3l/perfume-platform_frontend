import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const EditProducts: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // État du formulaire modifié - retiré les champs non nécessaires et ajouté size
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "0",
    size: "", // Ajout de la taille en ML
    featured: false,
  });

  // État pour les images
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Données des catégories factices
  const categories = [
    { id: "1", name: "Eau de Parfum" },
    { id: "2", name: "Eau de Toilette" },
    { id: "3", name: "Parfum" },
    { id: "4", name: "Cologne" },
  ];

  // Simuler le chargement des données du produit
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Dans un cas réel, ce serait un appel d'API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Données factices pour la démonstration - avec les vraies images
        const mockData = {
          id: id,
          name: "Aurore Mystique",
          description:
            "Aurore Mystique capture l'essence magique de l'aube, cet instant éphémère où la nuit cède sa place au jour. Des notes de tête fraîches d'agrumes s'entremêlent avec un cœur floral de jasmin et de pivoine. Le fond chaleureux de bois de cèdre et de vanille crée une empreinte olfactive durable et sophistiquée.",
          price: "120",
          category: "1", // Eau de Parfum
          stock: "24",
          size: "50", // Taille en ML
          featured: true,
          images: [
            "/perfum1.jpg", // Chemins vers les vraies images
            "/perfum2.jpg",
            "/perfum3.jpg",
          ],
        };

        // Mettre à jour l'état du formulaire avec les données du produit
        setFormData({
          name: mockData.name,
          description: mockData.description,
          price: mockData.price,
          category: mockData.category,
          stock: mockData.stock,
          size: mockData.size,
          featured: mockData.featured,
        });

        // Mettre à jour les images existantes
        setExistingImages(mockData.images);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données du produit:",
          error
        );
        alert(
          "Impossible de charger les données du produit. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(
        0,
        5 - existingImages.length + imagesToDelete.length
      ); // Limite à 5 images au total

      // Mettre à jour les fichiers
      setImages([...images, ...filesArray]);

      // Créer des URLs pour les aperçus
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagesPreviews([...imagesPreviews, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagesPreviews];

    // Libérer l'URL de l'objet
    URL.revokeObjectURL(newPreviews[index]);

    // Supprimer l'image et son aperçu
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagesPreviews(newPreviews);
  };

  const toggleExistingImageDelete = (path: string) => {
    if (imagesToDelete.includes(path)) {
      setImagesToDelete(imagesToDelete.filter((img) => img !== path));
    } else {
      setImagesToDelete([...imagesToDelete, path]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulation d'envoi à l'API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Produit modifié:", formData);
      console.log("Nouvelles images:", images);
      console.log("Images à supprimer:", imagesToDelete);

      navigate("/dashboard/products", { state: { showToast: "edit" } });
    } catch (error) {
      console.error("Erreur lors de la modification du produit:", error);
      alert("Une erreur est survenue lors de la modification du produit.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5 p-8 flex justify-center">
        <div className="text-[#d4af37] flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
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
          Chargement des données...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5"
    >
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-serif text-[#d4af37]">
            Modifier le Produit
          </h2>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="inline-flex items-center px-3 py-1 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-black hover:bg-gray-800"
          >
            <svg
              className="w-4 h-4 mr-2"
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
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne de gauche - Informations de base */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Nom du Parfum <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
                  placeholder="Ex: Aurore Mystique"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
                  placeholder="Description détaillée du parfum..."
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Prix (€) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 sm:text-sm">€</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="block w-full pr-10 rounded-md bg-gray-800 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
                    placeholder="Quantité en stock"
                  />
                </div>

                {/* Nouveau champ pour la taille en ML */}
                <div>
                  <label
                    htmlFor="size"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Taille (mL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="size"
                    name="size"
                    min="1"
                    required
                    value={formData.size}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-300"
                >
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center h-5">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded text-[#d4af37] border-gray-700 bg-gray-900 focus:ring-[#d4af37]/30"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 text-sm text-gray-300"
                >
                  Produit à la une
                </label>
              </div>
            </div>

            {/* Colonne de droite - Images */}
            <div className="space-y-6">
              <div>
                <span className="block text-sm font-medium text-gray-300 mb-2">
                  Images actuelles
                </span>
                <div className="grid grid-cols-3 gap-4">
                  {existingImages
                    .filter((img) => !imagesToDelete.includes(img))
                    .map((img, index) => (
                      <div
                        key={index}
                        className="relative group h-32 bg-gray-800 border border-gray-700 rounded-md overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`Product ${index}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Utilisez une image existante comme fallback
                            (e.target as HTMLImageElement).src = "/perfums.jpg"; // ou "/perfum1.jpg"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => toggleExistingImageDelete(img)}
                          className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
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
                  {imagesToDelete.length > 0 && (
                    <div className="col-span-3">
                      <button
                        type="button"
                        onClick={() => setImagesToDelete([])}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Annuler les suppressions ({imagesToDelete.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="newImages"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Ajouter de nouvelles images
                </label>
                <input
                  type="file"
                  id="newImages"
                  name="newImages"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="newImages"
                  className="cursor-pointer flex justify-center items-center border-2 border-dashed border-gray-600 rounded-md h-32 hover:border-[#d4af37]/50 transition-colors"
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-1 text-sm text-gray-400">
                      Cliquez pour sélectionner des images
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF jusqu'à 5 MB
                    </p>
                  </div>
                </label>

                {imagesPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {imagesPreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group h-32 bg-gray-800 border border-gray-700 rounded-md overflow-hidden"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
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
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/products")}
              className="px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-[#d4af37]/50 text-sm font-medium rounded-md text-[#d4af37] bg-black hover:bg-gray-800 flex items-center"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#d4af37]"
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
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default EditProducts;
