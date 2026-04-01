import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import Button from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useState, useEffect } from "react";
import type { Product } from "@/store/useCartStore";
import { toast } from "sonner";

interface ModalAddEditProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  onSuccess: () => void;
}

const ModalAddEditProduct = ({
  open,
  onOpenChange,
  editingProduct,
  onSuccess,
}: ModalAddEditProductProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stockCount, setStockCount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [creating, setCreating] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const fetchCategories = async () => {
    try {
      const categoriesRes = await axiosInstance.get("/api/categories");
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingFile(true);
    try {
      const { data } = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(data.imageUrl);
      toast.success(data.message);
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Image upload failed. Ensure it is a valid format (jpg, png).");
    } finally {
      setUploadingFile(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (editingProduct) {
        setName(editingProduct.name);
        setDescription(editingProduct.description || "");
        setPrice(editingProduct.price.toString());
        setImageUrl(editingProduct.imageUrl || "");
        setStockCount(editingProduct.stockCount?.toString() || "0");
        setCategoryId(editingProduct.categoryId || "");
      } else {
        setName("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        setStockCount("");
        setCategoryId("");
      }
    }
  }, [open, editingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        stockCount: parseInt(stockCount, 10),
        categoryId: categoryId || null,
      };

      if (editingProduct) {
        await axiosInstance.put(`/api/products/${editingProduct.id}`, payload);
      } else {
        await axiosInstance.post("/api/products", payload);
      }

      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error("Failed to save product", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {editingProduct
              ? "Update the details for this product. Changes will reflect instantly on the storefront."
              : "Create a new product listing for your store immediately."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Basic Information & Media */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-foreground"
                >
                  Product Name
                </Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className="bg-muted/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-sm font-semibold text-foreground"
                  >
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="stockCount"
                    className="text-sm font-semibold text-foreground"
                  >
                    Stock Inventory
                  </Label>
                  <Input
                    id="stockCount"
                    type="number"
                    required
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    placeholder="0"
                    className="bg-muted/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-semibold text-foreground"
                >
                  Category Classification
                </Label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-sm h-10 px-3 py-2 rounded-md border border-input bg-transparent text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-colors"
                >
                  <option value="" className="bg-background text-foreground">
                    No Category Assigned
                  </option>
                  {categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                      className="bg-background text-foreground"
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="imageFile"
                  className="text-sm font-semibold text-foreground"
                >
                  Product Cover Image
                </Label>
                <div className="flex flex-col gap-2 p-5 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/50 transition-all duration-200 ease-in-out group">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors cursor-pointer"
                  />
                  <Input type="hidden" required value={imageUrl} />

                  {uploadingFile && (
                    <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium py-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading
                      image to cloud...
                    </div>
                  )}
                  {imageUrl && !uploadingFile && (
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-2 break-all bg-background p-2 rounded-md border border-border">
                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="font-medium text-foreground">
                        Attached:
                      </span>{" "}
                      {imageUrl.split("/").pop()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Rich Text Editor */}
            <div className="space-y-3 h-full">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-foreground"
              >
                Description
              </Label>
              <div
                className="flex flex-col border border-input rounded-xl overflow-hidden shadow-sm min-h-[350px] max-h-[500px]
                
              "
              >
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  placeholder="Draft your compelling product story here. Use bold text or lists to highlight features..."
                  className="flex flex-col h-90"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 border-input hover:bg-muted/50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating}
              className="px-8 shadow-md hover:shadow-lg transition-all"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingProduct ? "Save Changes" : "Publish Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddEditProduct;
