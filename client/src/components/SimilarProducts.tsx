import { type Product } from "../store/useCartStore";
import ProductCard from "./ProductCard";

interface SimilarProductsProps {
  products: Product[];
}

export const SimilarProducts = ({ products }: SimilarProductsProps) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-20 pt-16 border-t border-border animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-8">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
