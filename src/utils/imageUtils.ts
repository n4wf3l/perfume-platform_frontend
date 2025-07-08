const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

/**
 * Renvoie le chemin correct pour une image selon sa source
 * @param path Chemin de l'image
 * @param isDbImage Indique si l'image provient de la base de données
 * @returns URL complète de l'image
 */
export const getImageSource = (
  path: string,
  isDbImage: boolean = false
): string => {
  // Si pas de chemin fourni
  if (!path) return "/perfum1.jpg";

  // Si c'est une image de la DB
  if (isDbImage) {
    // Si l'image a déjà une URL complète
    if (path.startsWith("http")) return path;

    // Sinon on construit l'URL avec VITE_IMAGE_URL
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${IMAGE_URL}/${cleanPath}`;
  }

  // Sinon c'est une image statique du dossier public
  // On s'assure que le chemin commence par '/'
  return path.startsWith("/") ? path : `/${path}`;
};
