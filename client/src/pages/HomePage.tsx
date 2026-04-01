import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ProductFilters } from "../components/ProductFilters";
import type { Product } from "../store/useCartStore";
import { Loader2, PackageX, ChevronLeft, ChevronRight } from "lucide-react";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 9,
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axiosInstance.get("/api/products", {
          params: {
            q: query,
            categoryId,
            minPrice,
            maxPrice,
            sortBy,
            order,
            page,
            limit: 9,
          },
        });
        setProducts(data.products || []);
        if (data.pagination) setPagination(data.pagination);
      } catch {
        setError(
          "Failed to load products. Please check the backend connection.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, categoryId, minPrice, maxPrice, sortBy, order, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div
        className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700"
        style={{ animationDelay: "0.1s" }}
      >
        <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground mb-6">
          {query ? `Results for "${query}"` : "Discover Premium Goods"}
        </h1>
        <p className="max-w-xl mx-auto text-xl text-muted-foreground">
          {query
            ? `Found ${pagination.totalItems} items matching your search.`
            : "Curated collection of high-quality products designed for your modern lifestyle."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <ProductFilters />

        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-6 rounded-lg text-center font-medium shadow-sm max-w-md mx-auto border border-destructive/20">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 border rounded-2xl border-dashed flex flex-col items-center justify-center text-center text-muted-foreground">
              <PackageX className="w-12 h-12 mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-medium text-foreground mb-2">
                No products found
              </h3>
              <p>
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in fill-mode-both duration-500"
                    style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-8 border-t border-border/50">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 border rounded-md hover:bg-muted bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex items-center"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:hidden"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex space-x-1">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1,
                    ).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => handlePageChange(pg)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md font-medium transition-colors ${
                          pagination.page === pg
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 border bg-primary rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex items-center"
                  >
                    Next <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:hidden"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
