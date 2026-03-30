import { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SearchX } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface Category {
  id: string;
  name: string;
}

export const ProductFilters = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("categoryId") || "all";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentOrder = searchParams.get("order") || "desc";

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

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

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset to page 1 when filtering
    params.set("page", "1");
    setSearchParams(params);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    params.set("page", "1");
    setSearchParams(params);
  };

  const clearFilters = () => {
    const q = searchParams.get("q"); // Preserve search query
    const params = new URLSearchParams();
    if (q) params.set("q", q);

    setMinPrice("");
    setMaxPrice("");
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="w-full md:w-64 flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full md:w-64 space-y-8 pr-6 shrink-0 border-r border-border/50 pb-12">
      {/* Search Header for Mobile/Context */}
      <div className="hidden">
        {/* Placeholder for future mobile filter drawer toggle */}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold tracking-tight text-lg">Categories</h3>
        <div className="flex flex-col space-y-1">
          <Button
            variant={currentCategory === "all" ? "secondary" : "ghost"}
            className={cn(
              "justify-start font-medium",
              currentCategory === "all"
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-muted-foreground",
            )}
            onClick={() => updateParam("categoryId", "all")}
          >
            All Products
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={currentCategory === cat.id ? "secondary" : "ghost"}
              className={cn(
                "justify-start font-medium leading-none",
                currentCategory === cat.id
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground",
              )}
              onClick={() => updateParam("categoryId", cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/50">
        <h3 className="font-semibold tracking-tight text-lg">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <Button
          onClick={applyPriceFilter}
          variant="outline"
          className="w-full text-foreground"
        >
          Apply Range
        </Button>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/50">
        <h3 className="font-semibold tracking-tight text-lg">Sort By</h3>
        <div className="flex flex-col space-y-2">
          <select
            className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground"
            value={`${currentSortBy}-${currentOrder}`}
            onChange={(e) => {
              const [sBy, o] = e.target.value.split("-");
              const params = new URLSearchParams(searchParams.toString());
              params.set("sortBy", sBy);
              params.set("order", o);
              params.set("page", "1");
              setSearchParams(params);
            }}
          >
            <option value="createdAt-desc">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        <Button
          onClick={clearFilters}
          variant="ghost"
          className="w-full text-muted-foreground hover:text-destructive transition-colors"
        >
          <SearchX className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};
