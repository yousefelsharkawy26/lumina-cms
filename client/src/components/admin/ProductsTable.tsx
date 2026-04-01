import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Edit, Trash2, Package } from "lucide-react";
import { type Product } from "@/store/useCartStore";
import Button from "../ui/button";
import { getImageUrl } from "@/lib/utils";

interface ProductsTableProps {
  products: Product[];
  openEditDialog: (product: Product) => void;
  handleDelete: (id: string) => void;
}

const ProductsTable = ({
  products,
  openEditDialog,
  handleDelete,
}: ProductsTableProps) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStockBadge = (stockCount: number) => {
    if (stockCount === 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
          Out of Stock
        </span>
      );
    }
    if (stockCount < 10) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          Low Stock ({stockCount})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        In Stock ({stockCount})
      </span>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="w-[40%]">Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Added Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center h-48 text-muted-foreground"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Package className="w-8 h-8 opacity-20" />
                <p>No products found. Add one above.</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/50 transition-colors group">
              <TableCell className="font-medium flex items-center gap-4 py-3">
                <div className="h-12 w-12 rounded-lg border border-border/50 overflow-hidden bg-muted/30 shrink-0">
                  <img
                    src={getImageUrl(product.imageUrl) || "https://via.placeholder.com/48"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground line-clamp-1">{product.name}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {product.category?.name || "Uncategorized"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-semibold text-foreground/90">
                {formatCurrency(Number(product.price))}
              </TableCell>
              <TableCell>
                {getStockBadge(product.stockCount)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm font-medium">
                {formatDate(product.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                    onClick={() => openEditDialog(product)}
                    title="Edit Product"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                    onClick={() => handleDelete(product.id)}
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
