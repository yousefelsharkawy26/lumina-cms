import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // We clear the cart gracefully upon successful striped checkout
    if (clearCart && sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      <Card className="w-full max-w-md shadow-2xl text-center border-green-500/20">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Thank you for your order. We have received your payment and are
            preparing your items for shipment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionId && (
            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground break-all border">
              Order Ref: {sessionId.replace("cs_test_", "")}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full h-12 text-base font-bold shadow-lg"
          >
            Continue Shopping
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/profile")}
            className="w-full text-muted-foreground"
          >
            View Order Status
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
