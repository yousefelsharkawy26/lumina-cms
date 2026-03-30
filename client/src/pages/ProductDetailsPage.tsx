import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, ArrowLeft, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { type Product, useCartStore } from "../store/useCartStore";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductReviews } from "../components/ProductReviews";
import { SimilarProducts } from "../components/SimilarProducts";

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem, setIsCartOpen } = useCartStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 flex flex-col items-center gap-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-foreground">
          Product not found
        </h2>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="w-fit flex gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in zoom-in-95 duration-500">
      <Button
        variant="ghost"
        className="mb-8 flex items-center gap-2 group text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Products
      </Button>

      <div className="bg-card rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 p-1 gap-8 lg:gap-16 border border-border">
        <div className="aspect-square bg-muted rounded-[2rem] overflow-hidden flex items-center justify-center p-8">
          <img
            src={
              product.imageUrl ||
              "https://via.placeholder.com/600?text=No+Image"
            }
            alt={product.name}
            className="w-full h-full object-cover rounded-xl shadow-lg border border-border"
          />
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-12 md:pl-0">
          <div className="flex items-center space-x-4 mb-4">
            <Badge
              variant="default"
              className="text-sm px-3 py-1 font-bold uppercase tracking-wider"
            >
              In Stock
            </Badge>
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>

          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground mb-6">
            {product.name}
          </h1>

          <div className="text-3xl font-bold text-foreground mb-6">
            ${Number(product.price).toFixed(2)}
          </div>

          <div 
            className="text-lg text-muted-foreground leading-7 border-b border-border pb-10 mb-10 prose prose-slate dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <Button
            size="lg"
            onClick={() => {
              addItem(product);
              toast.success(`${product.name} added to cart!`, {
                description: "Item saved to local storage securely.",
                action: {
                  label: "View Cart",
                  onClick: () => setIsCartOpen(true),
                },
              });
              setIsCartOpen(true);
            }}
            className="w-full sm:w-auto h-16 px-12 text-lg font-bold flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 transition-all duration-300 mb-8"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>Add to Cart</span>
          </Button>

          {/* Render User Reviews Module */}
          <ProductReviews productId={product.id} />
        </div>
      </div>

      <SimilarProducts products={product.similarProducts || []} />
    </div>
  );
};
