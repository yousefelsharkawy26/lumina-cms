import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Category {
  id: string;
  name: string;
}

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [adding, setAdding] = useState(false);
  const { user } = useAuthStore();
  const token = user?.token || localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get("/api/categories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setAdding(true);
    try {
      const { data } = await axiosInstance.post(
        "/api/categories",
        { name: newCatName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCategories([...categories, data]);
      setNewCatName("");
    } catch (error) {
      console.error("Failed to add category", error);
      alert(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to add category",
      );
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await axiosInstance.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete category", error);
      alert(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
          "Failed to delete category. It might be linked to products.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
        <p className="text-muted-foreground mt-2">
          Organize your products into catalog sections.
        </p>
      </div>

      <div className="bg-card shadow-sm border rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <Input
            placeholder="Category Name (e.g. Electronics)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="max-w-xs"
            disabled={adding}
          />
          <Button type="submit" disabled={adding || !newCatName.trim()}>
            {adding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add Category
          </Button>
        </form>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Existing Categories</h3>
        </div>
        <div className="p-0">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No categories found.
            </div>
          ) : (
            <ul className="divide-y">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground">
                    {cat.name}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
