import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();

  // Assurer qu'une image est toujours disponible
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/perfum1.jpg";

  return (
    <div className="bg-black rounded-lg overflow-hidden border border-white/20 hover:border-white/50 transition-all duration-300 group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-72 object-cover rounded-t-lg" // h-72 = 18rem, adapte si besoin
          />
        </div>

        <div className="p-5">
          <h3 className="font-serif text-xl text-white mb-2">{product.name}</h3>
          <p className="text-gray-300 mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xl text-white">
              {product.price.toFixed(2)} €
            </span>
            <button className="px-4 py-2 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors duration-300">
              {t("home.seeButton", "Voir")}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
