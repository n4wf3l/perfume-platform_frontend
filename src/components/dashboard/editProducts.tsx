import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import type { Category } from "../../types/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const EditProducts: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredientsDescription: "",
    price: "",
    category: "",
    stock: "0",
    size: "",
    featured: false,
    gender: "",
  });

  // État pour les images
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{id: number, path: string, order: number}[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  // État pour le remplacement sélectif des images
  const [imageReplacements, setImageReplacements] = useState<{[key: number]: File}>({}); 
  
  // État pour les catégories
  const [categories, setCategories] = useState<Category[]>([]);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
        setError("Impossible de charger les catégories. Veuillez réessayer.");
      }
    };
    
    fetchCategories();
  }, []);

  // Charger les données du produit depuis l'API
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productId = parseInt(id);
        const product = await productService.getProduct(productId);
        console.log("Fetched product data:", product);
        
        // Mettre à jour l'état du formulaire avec les données du produit
        setFormData({
          name: product.name,
          description: product.description || "",
          ingredientsDescription: product.olfactive_notes || "",
          price: product.price.toString(),
          category: product.category_id.toString(),
          stock: product.stock.toString(),
          size: product.size_ml || "", // This field must match what's expected in handleSubmit
          featured: product.is_flagship,
          gender: product.gender || "",
        });

        // Mettre à jour les images existantes
        if (product.images && product.images.length > 0) {
          setExistingImages(product.images);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données du produit:",
          error
        );
        setError("Impossible de charger les données du produit. Veuillez réessayer.");
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
  
  // Fonction pour remplacer une image spécifique directement via l'API
  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Trouver l'image à remplacer par son index
      const imageToReplace = existingImages[index];
      if (imageToReplace) {
        try {
          setSubmitting(true);
          setError(null);
          
          // Afficher un message temporaire
          const tempElement = document.createElement('div');
          tempElement.className = 'fixed top-4 right-4 bg-blue-900/90 text-white px-4 py-2 rounded-md z-50 flex items-center';
          tempElement.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Remplacement de l'image en cours...
          `;
          document.body.appendChild(tempElement);
          
          // Mettre à jour l'état temporairement pour l'affichage
          setImageReplacements(prev => ({
            ...prev,
            [index]: file
          }));
          
          if (id) {
            // Appeler l'API pour remplacer l'image spécifique
            const productId = parseInt(id);
            await productService.updateImage(productId, imageToReplace.id, file);
            
            // Actualiser les données du produit pour afficher la nouvelle image
            const updatedProduct = await productService.getProduct(productId);
            setExistingImages(updatedProduct.images || []);
            
            // Nettoyer les remplacements temporaires
            setImageReplacements({});
            
            // Mettre à jour le message pour indiquer le succès
            tempElement.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md z-50 flex items-center';
            tempElement.innerHTML = `
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Image remplacée avec succès
            `;
          }
          
          // Supprimer le message après 3 secondes
          setTimeout(() => {
            if (document.body.contains(tempElement)) {
              document.body.removeChild(tempElement);
            }
          }, 3000);
          
        } catch (error) {
          console.error('Erreur lors du remplacement de l\'image:', error);
          setError('Erreur lors du remplacement de l\'image. Veuillez réessayer.');
        } finally {
          setSubmitting(false);
        }
      }
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

  const toggleExistingImageDelete = (imageId: number) => {
    if (imagesToDelete.includes(imageId)) {
      setImagesToDelete(imagesToDelete.filter((id) => id !== imageId));
    } else {
      setImagesToDelete([...imagesToDelete, imageId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!id) return;
      
      const productId = parseInt(id);
      
      // Create FormData object for sending the product data and images
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('olfactive_notes', formData.ingredientsDescription.trim());
      
      // Ensure numeric values are properly formatted
      const price = parseFloat(formData.price);
      const stock = parseInt(formData.stock);
      const size_ml = parseInt(formData.size);
      
      formDataToSend.append('price', isNaN(price) ? '0' : price.toString());
      formDataToSend.append('category_id', formData.category);
      formDataToSend.append('stock', isNaN(stock) ? '0' : stock.toString());
      formDataToSend.append('size_ml', isNaN(size_ml) ? '0' : size_ml.toString());
      formDataToSend.append('is_flagship', formData.featured ? '1' : '0');
      formDataToSend.append('gender', formData.gender);
      
      // HANDLING IMAGES:
      // Le traitement des images est maintenant simplifié car nous avons des endpoints séparés
      // pour les remplacements d'images spécifiques et la réorganisation
      
      // Case 1: User is uploading new general images - append all new images (backend will delete old ones)
      if (images.length > 0) {
        console.log(`Adding ${images.length} new images to FormData - this will replace ALL existing images`);
        images.forEach((image) => {
          formDataToSend.append('images[]', image);
        });
      } 
      // Case 2: User wants to delete all images but not add new ones
      else if (imagesToDelete.length === existingImages.length && existingImages.length > 0) {
        console.log(`All images marked for deletion - sending empty images array`);
        // Send an empty array to indicate we want to delete all images
        formDataToSend.append('images_to_delete', JSON.stringify(existingImages.map(img => img.id)));
      }
      // Case 3: User wants to delete some but not all images - backend doesn't support this
      else if (imagesToDelete.length > 0) {
        console.log(`Some images marked for deletion - but backend doesn't support selective deletion`);
        // Show a clearer error to the user about this limitation
        setError("Le backend ne permet pas de supprimer sélectivement des images. Vous devez soit supprimer toutes les images, soit les remplacer toutes.");
        setSubmitting(false);
        return;
      }
      
      // Log what's being sent to the API for debugging
      console.log("Updating product with ID:", productId);
      console.log("FormData content:");
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      try {
        // Call API to update the product (service will handle _method=PUT)
        const updatedProduct = await productService.updateProduct(productId, formDataToSend);
        console.log("Product updated successfully:", updatedProduct);
        
        // After updating the product, also save the image ordering if images exist
        if (existingImages.length > 0) {
          try {
            const orders = existingImages.map(img => ({
            id: img.id,
            order: img.order
            }));
            console.log('Also updating image orders during form submission:', orders);

            console.log('Existing images about to reorder:', existingImages);

            
            // Call API to update image order
            await productService.updateImageOrder(productId, orders);
            console.log('Image order updated successfully');
          } catch (orderError) {
            console.error('Error updating image order during form submission:', orderError);
            // We don't want to block navigation if just the ordering fails
          }
        }
        
        navigate("/dashboard/products", { state: { showToast: "edit" } });
      } catch (apiError: any) {
        console.error("API Error details:", apiError.response?.data);
        const errorMessage = apiError.response?.data?.errors 
          ? Object.values(apiError.response.data.errors).join(", ") 
          : "Une erreur est survenue lors de la modification du produit.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Une erreur est survenue lors de la modification du produit.");
    } finally {
      setSubmitting(false);
    }
  };

  // Fonction pour réorganiser les images
  const moveImageUp = (index: number) => {
    if (index === 0) return; // Already first
    const newImages = [...existingImages];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setExistingImages(newImages.map((img, idx) => ({ ...img, order: idx })));
  };

  const moveImageDown = (index: number) => {
    if (index === existingImages.length - 1) return; // Already last
    const newImages = [...existingImages];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setExistingImages(newImages.map((img, idx) => ({ ...img, order: idx })));
  };

  // Fonction pour sauvegarder la nouvelle ordonnance des images en backend
  const saveImageOrdering = async () => {
    if (!id) return;
    const productId = parseInt(id);
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Afficher un message temporaire
      const tempElement = document.createElement('div');
      tempElement.className = 'fixed top-4 right-4 bg-blue-900/90 text-white px-4 py-2 rounded-md z-50 flex items-center';
      tempElement.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Mise à jour de l'ordre des images...
      `;
      document.body.appendChild(tempElement);
      
      // Préparer les données d'ordre à envoyer en utilisant l'index comme order
    const reordered = existingImages.map((img, idx) => ({ ...img, order: idx }));
      setExistingImages(reordered);

      const orders = reordered.map(img => ({
        id: img.id,
        order: img.order
      }));

      
      console.log('Updating image orders:', orders);
      
      // Appeler l'API pour mettre à jour l'ordre des images
      await productService.updateImageOrder(productId, orders);
      
      // Actualiser les données du produit
      const updatedProduct = await productService.getProduct(productId);
      setExistingImages(updatedProduct.images || []);
      
      // Afficher un message de succès
      tempElement.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md z-50 flex items-center';
      tempElement.innerHTML = `
        <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Ordre des images mis à jour avec succès
      `;
      
      // Supprimer le message après 3 secondes
      setTimeout(() => {
        if (document.body.contains(tempElement)) {
          document.body.removeChild(tempElement);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'ordre des images:', error);
      setError('Erreur lors de la mise à jour de l\'ordre des images. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Fonction pour définir une image comme principale (order=0)
  const setMainImage = async (imageId: number) => {
    if (!id) return;
    const productId = parseInt(id);
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Trouver l'index de l'image qu'on veut rendre principale
      const targetImageIndex = existingImages.findIndex(img => img.id === imageId);
      if (targetImageIndex === -1) {
        throw new Error("Image non trouvée");
      }
      
      // Afficher un message temporaire
      const tempElement = document.createElement('div');
      tempElement.className = 'fixed top-4 right-4 bg-green-900/90 text-white px-4 py-2 rounded-md z-50 flex items-center';
      tempElement.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Modification de l'image principale...
      `;
      document.body.appendChild(tempElement);
      
      // Réorganiser les images: mettre l'image sélectionnée en premier
      const newImages = [...existingImages];
      const selectedImage = newImages.splice(targetImageIndex, 1)[0];
      newImages.unshift(selectedImage);
      
      // Mettre à jour l'ordre dans le state local
      setExistingImages(newImages.map((img, idx) => ({ ...img, order: idx })));
      
      // Préparer les données d'ordre à envoyer
      const orders = newImages.map((img, index) => ({
        id: img.id,
        order: index
      }));
      
      // Appeler l'API pour mettre à jour l'ordre des images
      await productService.updateImageOrder(productId, orders);
      
      // Actualiser les données du produit depuis le serveur
      const updatedProduct = await productService.getProduct(productId);
      setExistingImages(updatedProduct.images || []);
      
      // Remplacer le message de chargement par un message de succès
      tempElement.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md z-50 flex items-center';
      tempElement.innerHTML = `
        <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Image principale modifiée avec succès
      `;
      
      // Supprimer le message après 3 secondes
      setTimeout(() => {
        if (document.body.contains(tempElement)) {
          document.body.removeChild(tempElement);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'ordre des images:', error);
      setError('Erreur lors de la mise à jour de l\'ordre des images. Veuillez réessayer.');
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
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5 p-8"
    >
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">
        Modifier un produit
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-800 rounded-md text-red-300 text-sm">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-3 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          {/* Grille à deux colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne de gauche - Infos produit */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Nom du produit <span className="text-red-500">*</span>
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
                  Histoire du produit <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 focus:border-white focus:ring focus:ring-white/20 focus:outline-none text-gray-300"
                  placeholder="Décrivez l'histoire du parfum, son inspiration, etc."
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="ingredientsDescription"
                  className="block text-sm font-medium text-gray-300 pt-4"
                >
                  Description ingrédients{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="ingredientsDescription"
                  name="ingredientsDescription"
                  rows={5}
                  required
                  value={formData.ingredientsDescription}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 focus:border-white focus:ring focus:ring-white/20 focus:outline-none text-gray-300"
                  placeholder="Décrivez les ingrédients, notes olfactives, etc."
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

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-300"
                >
                  Genre <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 focus:border-white focus:ring focus:ring-white/20 focus:outline-none text-gray-300"
                >
                  <option value="">Sélectionner un genre</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="unisex">Unisexe</option>
                </select>
              </div>
            </div>

            {/* Colonne de droite - Images */}
            <div className="space-y-6">
              <div>
                <span className="block text-sm font-medium text-gray-300 mb-2">
                  Images actuelles
                </span>
                <div className="bg-blue-900/20 border border-blue-500/30 p-2 rounded-md mb-4 text-xs text-blue-400">
                  <p className="font-medium">Fonctionnalités pour les images</p>
                  <p className="mt-1">✅ Remplacement individuel: Utilisez le bouton bleu (⬆) sur chaque image pour la remplacer.</p>
                  <p className="mt-1">✅ Image principale: Utilisez le bouton vert (⬆⬆) pour définir une image comme principale (elle apparaîtra en premier).</p>
                  <p className="mt-1">✅ Réorganisation: Utilisez les boutons violets (↑↓) pour réorganiser les images. L'ordre sera sauvegardé quand vous cliquerez sur "Enregistrer les modifications" ou sur "Sauvegarder l'ordre".</p>
                  <p className="mt-1">⚠️ Attention: Si vous ajoutez de nouvelles images via le champ ci-dessous, toutes les images existantes seront remplacées.</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {existingImages
                    .filter((img) => !imagesToDelete.includes(img.id))
                    .map((img, index) => (
                      <div
                        key={img.id}
                        className="relative group h-32 bg-gray-800 border border-gray-700 rounded-md overflow-hidden"
                      >
                        {/* Image courante */}
                        {!imageReplacements[index] ? (
                          <img
                            src={`${IMAGE_URL}/${img.path}`}
                            alt={`Product ${index}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Utilisez une image existante comme fallback
                              (e.target as HTMLImageElement).src = "/perfums.jpg";
                            }}
                          />
                        ) : (
                          <>
                            <img
                              src={URL.createObjectURL(imageReplacements[index])}
                              alt={`Replacement ${index}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-green-800/70 text-white text-xs px-2 py-1 rounded">
                              Image remplacée
                            </div>
                          </>
                        )}
                        
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          Ordre: {index}
                          {index === 0 && <span className="ml-1 text-green-300">(Principal)</span>}
                        </div>
                        
                        {/* Boutons d'action */}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {/* Bouton de remplacement */}
                          <label
                            htmlFor={`replace-image-${index}`}
                            className={`${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 cursor-pointer'} bg-blue-500/80 text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                            title="Remplacer cette image"
                          >
                            <input
                              type="file"
                              id={`replace-image-${index}`}
                              onChange={(e) => handleReplaceImage(e, index)}
                              className="hidden"
                              accept="image/*"
                              disabled={submitting}
                            />
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                              ></path>
                            </svg>
                          </label>
                          
                          {/* Boutons de réorganisation */}
                          <button
                            type="button"
                            onClick={() => moveImageUp(index)}
                            className={`${submitting || index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'} bg-purple-500/80 text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                            title="Déplacer vers le haut"
                            disabled={submitting || index === 0}
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
                                d="M5 15l7-7 7 7"
                              ></path>
                            </svg>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => moveImageDown(index)}
                            className={`${submitting || index === existingImages.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'} bg-purple-500/80 text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                            title="Déplacer vers le bas"
                            disabled={submitting || index === existingImages.length - 1}
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
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </button>
                          
                          {/* Bouton pour définir comme image principale */}
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => setMainImage(img.id)}
                              className={`${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'} bg-green-500/80 text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                              title="Définir comme image principale"
                              disabled={submitting}
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
                                  d="M5 11l7-7 7 7M5 19l7-7 7 7"
                                ></path>
                              </svg>
                            </button>
                          )}
                          
                          {/* Bouton de suppression */}
                          <button
                            type="button"
                            onClick={() => toggleExistingImageDelete(img.id)}
                            className="bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            title="Supprimer cette image"
                            disabled={submitting}
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
                      </div>
                    ))}
                  {imagesToDelete.length > 0 && (
                    <div className="col-span-3">
                      {imagesToDelete.length === existingImages.length ? (
                        <div className="text-red-400 text-sm mb-1">
                          <svg className="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Toutes les images seront supprimées
                        </div>
                      ) : (
                        <div className="text-yellow-500 text-xs mb-1">
                          Note: Impossible de supprimer des images sélectives sans ajouter de nouvelles
                        </div>
                      )}
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
                
                {/* Bouton pour sauvegarder l'ordre des images */}
                {existingImages.length > 1 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={saveImageOrdering}
                      className={`${submitting ? 'opacity-50 cursor-not-allowed' : ''} px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center text-sm`}
                      disabled={submitting}
                    >
                      <svg 
                        className="w-4 h-4 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                      </svg>
                      Sauvegarder l'ordre des images
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="newImages"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Ajouter de nouvelles images
                </label>
                <div className="bg-yellow-800/30 border border-yellow-600/30 p-2 rounded mb-2">
                  <p className="text-yellow-500 text-xs mb-1">
                    <svg className="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Attention: Ajouter de nouvelles images ici remplacera TOUTES les images existantes
                  </p>
                  <p className="text-yellow-500 text-xs">
                    Pour remplacer une image spécifique, utilisez le bouton bleu (⬆) sur l'image concernée
                  </p>
                </div>
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
