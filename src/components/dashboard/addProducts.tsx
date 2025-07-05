import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Toast from "../common/Toast";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import type { Category } from "../../types/api";

// Gender options with their backend values
const genderOptions = [
  { display: "Homme", value: "male" },
  { display: "Femme", value: "female" },
  { display: "Unisexe", value: "unisex" },
];

const AddProducts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Données du formulaire modifiées - notes remplacées par size (ml)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    ingredientsDescription: "", // <-- Ajouté pour la description ingrédients
    size_ml: "", // Nouveau champ pour la taille en ML
    is_flagship: false, // Using is_flagship instead of featured to match API
    gender: "", // <-- AJOUT
    category_id: "", // Will be populated based on category selection
  });

  // Fetch categories from API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const fetchedCategories = await categoryService.getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Impossible de récupérer les catégories. Veuillez réessayer plus tard.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
    
    // For numeric fields, ensure we're storing valid numbers
    if (name === 'price' || name === 'stock' || name === 'size_ml') {
      // Remove any non-numeric characters (except decimal point for price)
      const sanitizedValue = name === 'price' 
        ? value.replace(/[^\d.]/g, '')  // Allow decimals for price
        : value.replace(/\D/g, '');     // Only digits for stock and size_ml
      
      setFormData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the actual file object
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    // Create preview URL
    const newImagePreview = [...imagePreview];
    newImagePreview[index] = URL.createObjectURL(file);
    setImagePreview(newImagePreview);
  };

  // Supprimer une image
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newImagePreview = [...imagePreview];
    newImagePreview.splice(index, 1);
    setImagePreview(newImagePreview);
  };

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    setFormData((prev) => ({
      ...prev,
      category: category.name,
      category_id: category.id.toString(),
    }));
    setCategoryOpen(false);
  };

  // Handle gender selection
  const handleGenderSelect = (genderOption: { display: string; value: string }) => {
    setFormData((prev) => ({
      ...prev,
      gender: genderOption.value,
    }));
    setGenderOpen(false);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Debug form values to check for missing required fields
      console.log("Submitting form data:", formData);
      console.log("Images count:", images.length);

      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || 
          !formData.stock || !formData.size_ml || !formData.category_id || 
          !formData.gender || images.length === 0) {
        setError('Veuillez remplir tous les champs obligatoires et ajouter au moins une image.');
        setIsSubmitting(false);
        return;
      }

      // Create FormData object
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name.trim());
      formDataObj.append('description', formData.description.trim());
      
      // Ensure numeric values are properly formatted and valid
      const price = parseFloat(formData.price);
      const stock = parseInt(formData.stock);
      const size_ml = parseInt(formData.size_ml);
      
      if (isNaN(price) || price <= 0) {
        setError('Le prix doit être un nombre valide supérieur à 0.');
        setIsSubmitting(false);
        return;
      }
      
      if (isNaN(stock) || stock < 0) {
        setError('Le stock doit être un nombre valide positif ou zéro.');
        setIsSubmitting(false);
        return;
      }
      
      if (isNaN(size_ml) || size_ml <= 0) {
        setError('La taille en mL doit être un nombre valide supérieur à 0.');
        setIsSubmitting(false);
        return;
      }
      
      formDataObj.append('price', price.toString());
      formDataObj.append('stock', stock.toString());
      formDataObj.append('size_ml', size_ml.toString());
      formDataObj.append('is_flagship', formData.is_flagship ? '1' : '0');
      formDataObj.append('gender', formData.gender);
      
      // Handle the ingredients description (olfactive notes)
      if (formData.ingredientsDescription && formData.ingredientsDescription.trim()) {
        formDataObj.append('olfactive_notes', formData.ingredientsDescription.trim());
      }
      
      // Add category ID
      formDataObj.append('category_id', formData.category_id);
      
      // Check if we have images to upload
      if (images.length === 0) {
        setError('Veuillez ajouter au moins une image pour le produit.');
        setIsSubmitting(false);
        return;
      }
      
      // Add images with order values
      images.forEach((image, index) => {
        formDataObj.append(`images[${index}]`, image);
        formDataObj.append(`image_orders[${index}]`, String(index));
      });
      
      // Debug what's being sent to the API
      console.log("FormData content:");
      for (const pair of formDataObj.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      // Send to API
      const newProduct = await productService.createProduct(formDataObj);
      console.log('Product created successfully:', newProduct);
      
      // Show success message and navigate back
      navigate("/dashboard/products", { state: { showToast: true } });
    } catch (err: any) {
      console.error('Error creating product:', err);
      console.log('Error response:', err.response);
      
      // Try to extract more detailed error information if available
      let errorMessage = 'Une erreur est survenue lors de la création du produit. Veuillez réessayer.';
      
      if (err.response && err.response.data) {
        console.log('Error response data:', err.response.data);
        
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        // Handle Laravel validation errors
        if (err.response.data.errors) {
          const validationErrors = Object.entries(err.response.data.errors)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              }
              return `${field}: ${String(messages)}`;
            })
            .join('\n');
          
          errorMessage = `Erreurs de validation:\n${validationErrors}`;
          console.log('Validation errors:', err.response.data.errors);
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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

  // Pour le menu déroulant animé du genre
  const [genderOpen, setGenderOpen] = useState(false);
  const genderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        genderRef.current &&
        !genderRef.current.contains(event.target as Node)
      ) {
        setGenderOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.state?.showToast) {
      setToastVisible(true);
      // Optionnel : nettoyer le state pour éviter de réafficher le toast si on revient sur la page
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
        <h2 className="text-2xl font-serif text-white">Ajouter un Parfum</h2>
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
        className="bg-gray-900 rounded-xl border border-white/10 p-6 shadow-lg"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-800 text-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations générales */}
          <div className="space-y-4 flex flex-col h-full">
            <h3 className="text-lg font-medium text-white mb-4">
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
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
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
                disabled={isLoadingCategories}
                className={`w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition ${isLoadingCategories ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={() => setCategoryOpen((open) => !open)}
              >
                {isLoadingCategories ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement des catégories...
                  </span>
                ) : (
                  formData.category || "Sélectionner une catégorie"
                )}
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
                className="absolute z-10 mt-2 w-full bg-gray-900 border border-white/30 rounded-md shadow-lg overflow-hidden"
              >
                {categories.length === 0 && !isLoadingCategories ? (
                  <li className="px-4 py-2 text-gray-400 italic">Aucune catégorie disponible</li>
                ) : (
                  categories.map((category) => (
                    <li
                      key={category.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-white/10 text-gray-200 ${
                        formData.category_id === category.id.toString()
                          ? "bg-white/20 text-white"
                          : ""
                      }`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.name}
                    </li>
                  ))
                )}
              </motion.ul>
            </div>

            {/* Taille en ML - Nouveau champ */}
            <div>
              <label
                htmlFor="size_ml"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Taille (mL) *
              </label>
              <input
                type="number"
                id="size_ml"
                name="size_ml"
                required
                min="1"
                value={formData.size_ml}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
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
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
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
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
              />
            </div>

            {/* Genre - Menu déroulant animé */}
            <div ref={genderRef} className="relative">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Genre *
              </label>
              <button
                type="button"
                className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition"
                onClick={() => setGenderOpen((open) => !open)}
              >
                {formData.gender ? genderOptions.find(g => g.value === formData.gender)?.display || "Sélectionner un genre" : "Sélectionner un genre"}
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    genderOpen ? "rotate-180" : ""
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
                animate={genderOpen ? "open" : "closed"}
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
                className="absolute z-10 mt-2 w-full bg-gray-900 border border-white/30 rounded-md shadow-lg overflow-hidden"
              >
                {genderOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`px-4 py-2 cursor-pointer hover:bg-white/10 text-gray-200 ${
                      formData.gender === option.value
                        ? "bg-white/20 text-white"
                        : ""
                    }`}
                    onClick={() => handleGenderSelect(option)}
                  >
                    {option.display}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* À la une */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_flagship"
                name="is_flagship"
                checked={formData.is_flagship}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-[#d4af37] rounded bg-gray-800 border-gray-700 focus:ring-[#d4af37] focus:ring-opacity-25"
              />
              <label
                htmlFor="is_flagship"
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
            <h3 className="text-lg font-medium text-white mb-4">Description</h3>
            <div className="flex-1 flex flex-col">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Histoire du produit *
              </label>
              <textarea
                id="description"
                name="description"
                rows={8}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez l'histoire du parfum, son inspiration, etc."
                className="w-full h-full min-h-[100px] py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-white focus:border-white resize-none"
                style={{ minHeight: "100%" }}
              ></textarea>
            </div>
            <div className="flex-1 flex flex-col pt-4">
              {/* Ajout de pt-4 ici pour espacer */}
              <label
                htmlFor="ingredientsDescription"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description ingrédients *
              </label>
              <textarea
                id="ingredientsDescription"
                name="ingredientsDescription"
                rows={8}
                required
                value={formData.ingredientsDescription}
                onChange={handleChange}
                placeholder="Décrivez les ingrédients, notes olfactives, etc."
                className="w-full h-full min-h-[100px] py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-white focus:border-white resize-none"
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
                {imagePreview[idx] ? (
                  <>
                    <img
                      src={imagePreview[idx]}
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
                        onChange={(e) => handleImageChange(e, idx)}
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
            disabled={isSubmitting || isLoadingCategories}
            className={`px-6 py-2 bg-[#d4af37] hover:bg-[#c5a028] text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#d4af37] ${
              isSubmitting || isLoadingCategories ? "opacity-70 cursor-not-allowed" : ""
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
