import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SlideOutCart = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    getTotalPrice,
  } = useCartStore();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
                <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold ml-2">
                  {items.length} items
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(false)}
                className="text-muted-foreground hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center mt-20">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-lg font-medium text-foreground">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-muted-foreground max-w-[250px]">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <Button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/");
                    }}
                    className="mt-6 shadow-md"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pr-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 items-center bg-background rounded-xl p-3 border border-border/50 shadow-sm"
                    >
                      <img
                        src={item.imageUrl || "https://placehold.co/150"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-1 text-foreground">
                          {item.name}
                        </h4>
                        <div className="text-primary font-bold text-sm mt-0.5">
                          ${Number(item.price).toFixed(2)}
                        </div>
                        <div className="flex items-center mt-2 gap-3">
                          <div className="flex items-center border rounded-md bg-muted/50 overflow-hidden h-7">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-foreground text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors ml-auto p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {items.length > 0 && (
              <div className="p-4 border-t border-border bg-card">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground font-medium">
                    Total
                  </span>
                  <span className="text-xl font-black text-foreground">
                    ${Number(getTotalPrice()).toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center gap-2 h-12 shadow-lg"
                >
                  Go to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
