import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setCheckoutLoading(true);
    try {
      const payload = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const { data } = await axios.post("/api/orders", { items: payload });

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      }
    } catch (err) {
      console.error("Checkout failed", err);
      // You could show a toast or error message here
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground">
          Looks like you haven't added anything yet.
        </p>
        <Button
          onClick={() => navigate("/")}
          size="lg"
          className="mt-4 shadow-lg hover:-translate-y-1 transition-all"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in slide-in-from-bottom-4 duration-500">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight mb-10 text-foreground">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Card className="col-span-1 lg:col-span-8 p-0 overflow-hidden border-border bg-card">
          <ScrollArea className="h-[600px] w-full border-0">
            <div className="p-6 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl flex flex-col sm:flex-row items-center gap-6 border bg-card hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl bg-muted"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-primary font-bold mt-1">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg bg-background overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-none text-muted-foreground"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-10 text-center font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-none text-muted-foreground"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <div className="col-span-1 lg:col-span-4">
          <Card className="sticky top-28 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-muted-foreground font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground">
                    ${Number(getTotalPrice()).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold">Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center text-foreground">
                  <span className="text-xl font-extrabold">Total</span>
                  <span className="text-3xl text-primary font-black">
                    ${Number(getTotalPrice()).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                size="lg"
                className="w-full mt-8 flex gap-2 font-bold shadow-lg hover:-translate-y-1 transition-all group"
              >
                {checkoutLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Secure Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Encrypted billing securely handled natively by Stripe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
