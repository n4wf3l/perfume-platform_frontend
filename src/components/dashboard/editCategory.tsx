import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const EditCategory: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // États pour gérer le chargement et la soumission
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // État du formulaire simplifié - uniquement le nom
  const [name, setName] = useState("");

  // Chargement des données de la catégorie
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Simuler un appel d'API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Données fictives de la catégorie (uniquement le nom)
        const categoryData = {
          id: id,
          name: id === "1" ? "Eau de Parfum" : "Catégorie " + id,
        };

        // Mettre à jour le nom
        setName(categoryData.name);
      } catch (error) {
        console.error("Erreur lors du chargement de la catégorie:", error);
        alert(
          "Impossible de charger les données de la catégorie. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  // Gestion des changements dans le champ de nom
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Rediriger vers la liste des catégories
      navigate("/dashboard/categories", { state: { showToast: "edit" } });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  // Affichage du chargement
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
            Modifier la Catégorie
          </h2>
          <button
            onClick={() => navigate("/dashboard/categories")}
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
        <div className="p-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Nom de la Catégorie <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={handleNameChange}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
              placeholder="Ex: Eau de Parfum"
            />
            <p className="mt-2 text-sm text-gray-500">
              Entrez un nom unique pour cette catégorie de parfum.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={() => navigate("/dashboard/categories")}
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

export default EditCategory;
