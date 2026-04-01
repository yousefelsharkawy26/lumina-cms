import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { type Product } from "@/store/useCartStore";
import { Plus, Loader2 } from "lucide-react";
import Button from "@/components/ui/button";
import ProductsTable from "@/components/admin/ProductsTable";
import ModalAddEditProduct from "@/components/admin/modalAddEditProduct";

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsRes = await axiosInstance.get("/api/products?limit=1000");

      setProducts(productsRes.data.products || []);
    } catch (err) {
      console.error("Failed to load products or categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your inventory and store listings.
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={openCreateDialog}>
          <Plus className="w-4 h-4" /> Add Product
        </Button>
        <ModalAddEditProduct
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingProduct={editingProduct}
          onSuccess={fetchProducts}
        />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ProductsTable
            products={products}
            openEditDialog={openEditDialog}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};
