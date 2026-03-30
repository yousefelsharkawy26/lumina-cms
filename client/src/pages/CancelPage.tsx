import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      <Card className="w-full max-w-md shadow-2xl text-center border-destructive/20">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-destructive/10 rounded-full">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Checkout Canceled
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Your payment was not processed. Your items remain safely in your
            cart.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border">
            If you experienced an error or changed your mind, you can try again
            anytime.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <Button
            onClick={() => navigate("/cart")}
            className="w-full h-12 text-base font-bold shadow-lg"
            variant="default"
          >
            Return to Cart
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full h-12 font-medium flex gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go back Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
