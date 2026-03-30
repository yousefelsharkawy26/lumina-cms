import { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface CategorySidebarProps {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const CategorySidebar = ({
  selectedCategoryId,
  onSelectCategory,
}: CategorySidebarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full md:w-64 flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (categories.length === 0) {
    return null; // Don't show sidebar if no categories exist
  }

  return (
    <div className="w-full md:w-64 space-y-4 pr-6 shrink-0">
      <h3 className="font-semibold tracking-tight text-lg mb-4">Categories</h3>
      <div className="flex flex-col space-y-1">
        <Button
          variant={selectedCategoryId === null ? "secondary" : "ghost"}
          className={cn(
            "justify-start font-medium",
            selectedCategoryId === null
              ? "bg-primary/10 text-primary hover:bg-primary/20"
              : "text-muted-foreground",
          )}
          onClick={() => onSelectCategory(null)}
        >
          All Products
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategoryId === cat.id ? "secondary" : "ghost"}
            className={cn(
              "justify-start font-medium",
              selectedCategoryId === cat.id
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-muted-foreground",
            )}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
