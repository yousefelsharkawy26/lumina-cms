import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { type Product, useCartStore } from "../store/useCartStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isImageExist } from "@/lib/imageHelper";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, setIsCartOpen } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      description: "Item saved to local storage securely.",
      action: {
        label: "View Cart",
        onClick: () => setIsCartOpen(true),
      },
    });
    setIsCartOpen(true);
  };

  const [imageSrc, setImageSrc] = useState(product.imageUrl);

  useEffect(() => {
    const checkImage = async () => {
      const exists = await isImageExist(product.imageUrl);
      if (!exists)
        setImageSrc("https://placehold.co/300x300/png?text=No+Image");
    };
    checkImage();
  }, [product.imageUrl]);

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden flex flex-col hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
        <div className="relative aspect-square bg-muted p-8 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full shadow-lg h-12 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </Button>
          </div>
        </div>

        <CardHeader className="pb-2">
          <Badge
            variant="secondary"
            className="w-fit mb-2 text-primary font-semibold tracking-wide uppercase"
          >
            New Arrival
          </Badge>
          <CardTitle className="leading-tight line-clamp-2">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-grow">
          <CardDescription 
            className="line-clamp-2 prose prose-sm dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </CardContent>

        <CardFooter className="pt-2 flex items-center justify-between">
          <span className="text-xl font-extrabold text-foreground">
            ${Number(product.price).toFixed(2)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
