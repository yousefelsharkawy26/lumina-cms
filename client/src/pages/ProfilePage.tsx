import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingsStore } from "../store/useSettingsStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  PackageOpen,
  User,
  Edit2,
  Save,
  X,
  Download,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { exportInvoicePDF } from "../lib/exportInvoicePDF";
import { getImageUrl } from "../lib/utils";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export const ProfilePage = () => {
  const { user, login } = useAuthStore();
  const { settings } = useSettingsStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Extract currency symbol safely (e.g. from "USD ($)")
  const currencySymbol = settings?.currency?.match(/\(([^)]+)\)/)?.[1] || "$";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/api/orders/myorders");
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { data } = await axiosInstance.put(
        "/api/users/profile",
        { name, email, password: password || undefined },
        {
          headers: {
            Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`,
          },
        },
      );
      login(data);
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setPassword("");
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to update profile",
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-background to-background border border-primary/20 p-8 md:p-12 mb-10 shadow-sm">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-70 animate-pulse" />
            <div className="relative w-20 h-20 bg-background rounded-full border-2 border-primary/50 flex items-center justify-center shadow-xl">
              <User className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Welcome back, {user?.name?.split(" ")[0] || "Shopper"}!
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage your personal credentials and track your premium orders
              tightly in one place.
            </p>
          </div>

          <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[140px] shadow-sm">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
              Lifetime Spent
            </p>
            <p className="text-2xl font-bold text-foreground">
              {currencySymbol}
              {totalSpent.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Details (Glassmorphic Card) */}
        <div className="lg:col-span-1">
          <Card className="bg-card/40 backdrop-blur-2xl border-border/50 shadow-xl overflow-hidden relative transition-all duration-300 hover:shadow-primary/5">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Account Details
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 hover:bg-primary/10 hover:text-primary transition-colors rounded-full px-3"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500"
                >
                  {error && (
                    <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background/50 focus:bg-background transition-all h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 focus:bg-background transition-all h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      New Default Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/50 focus:bg-background transition-all h-11"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-border/50">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={updateLoading}
                      className="flex-1 h-11 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateLoading}
                      className="flex-1 h-11 shadow-md hover:shadow-lg transition-all"
                    >
                      {updateLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}{" "}
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {successMessage && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      {successMessage}
                    </div>
                  )}

                  <div className="group">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      <User className="w-3.5 h-3.5" /> Identity
                    </p>
                    <p className="font-semibold text-lg text-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                      {user?.name || "Customer"}
                    </p>
                  </div>

                  <div className="group">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Mail className="w-3.5 h-3.5" /> Authentication Email
                    </p>
                    <p className="font-medium text-foreground bg-muted/30 p-3 rounded-xl border border-border/50 break-all">
                      {user?.email}
                    </p>
                  </div>

                  <div className="group">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      Platform Access Level
                    </p>
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/50 flex">
                      <Badge
                        variant={
                          user?.role === "ADMIN" ? "default" : "secondary"
                        }
                        className="px-3 py-1 shadow-sm"
                      >
                        {user?.role === "ADMIN"
                          ? "Administrator"
                          : "Standard User"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order History (Dynamic Table) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/40 backdrop-blur-2xl border-border/50 shadow-xl overflow-hidden h-full flex flex-col">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-background rounded-lg shadow-sm border border-border/50">
                  <PackageOpen className="w-5 h-5 text-primary" />
                </div>
                Purchase History
              </CardTitle>
              <CardDescription className="text-sm mt-2">
                Review your recent purchases, check delivery statuses, and
                download valid tax invoices.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-20 min-h-[400px]">
                  <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50 mb-4" />
                  <p className="text-muted-foreground font-medium animate-pulse">
                    Loading secure ledger...
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center min-h-[400px]">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <PackageOpen className="w-10 h-10 text-muted-foreground opacity-30" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Your ledger is empty
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    All your future premium purchases will be securely stored
                    and tracked right here.
                  </p>
                  <Button
                    className="mt-8 rounded-full px-8 shadow-md hover:shadow-lg transition-all"
                    onClick={() => (window.location.href = "/")}
                  >
                    Explore Catalog
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto p-4 md:p-6 pb-20">
                  <Table className="border-collapse">
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="w-[120px] font-semibold tracking-wider text-xs uppercase">
                          Products
                        </TableHead>
                        <TableHead className="font-semibold tracking-wider text-xs uppercase">
                          Order ID
                        </TableHead>
                        <TableHead className="font-semibold tracking-wider text-xs uppercase">
                          Date
                        </TableHead>
                        <TableHead className="font-semibold tracking-wider text-xs uppercase">
                          Status
                        </TableHead>
                        <TableHead className="text-right font-semibold tracking-wider text-xs uppercase">
                          Total
                        </TableHead>
                        <TableHead className="text-center w-[110px] font-semibold tracking-wider text-xs uppercase">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="group cursor-default md:cursor-pointer hover:bg-primary/5 transition-all duration-300 border-border/50 hover:shadow-sm"
                        >
                          {/* Mini Gallery Column */}
                          <TableCell className="py-4">
                            <div className="flex -space-x-3 overflow-hidden p-1">
                              {order.orderItems
                                .slice(0, 3)
                                .map((item, index) => (
                                  <img
                                    key={item.id}
                                    src={
                                      getImageUrl(item.product?.imageUrl) ||
                                      "https://via.placeholder.com/40"
                                    }
                                    alt={item.product?.name || "Product"}
                                    className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover bg-muted transition-transform duration-300 group-hover:scale-110"
                                    style={{ zIndex: 3 - index }}
                                    title={item.product?.name}
                                  />
                                ))}
                              {order.orderItems.length > 3 && (
                                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground z-0">
                                  +{order.orderItems.length - 3}
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors py-4">
                            ...{order.id.slice(-8)}
                          </TableCell>

                          <TableCell className="font-medium py-4">
                            {new Date(order.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </TableCell>

                          <TableCell className="py-4">
                            <Badge
                              variant={
                                order.status === "PAID"
                                  ? "default"
                                  : "secondary"
                              }
                              className={`shadow-sm ${
                                order.status === "PAID"
                                  ? "bg-green-500 hover:bg-green-600 border-none text-white"
                                  : order.status === "CANCELLED"
                                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                    : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              }`}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right font-bold text-base py-4">
                            {currencySymbol}
                            {order.totalAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>

                          <TableCell className="text-center py-4 pr-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 w-full rounded-lg bg-background group-hover:border-primary/30 group-hover:text-primary transition-all shadow-sm group-hover:shadow hover:bg-primary/10"
                              onClick={() =>
                                exportInvoicePDF(
                                  order as unknown as import("../lib/exportInvoicePDF").Order,
                                  user as { name: string; email: string },
                                )
                              }
                              disabled={
                                order.status === "CANCELLED" ||
                                order.status === "PENDING"
                              }
                            >
                              <Download className="w-4 h-4 mr-1.5" /> PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
