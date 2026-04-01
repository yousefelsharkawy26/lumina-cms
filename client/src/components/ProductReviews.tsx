import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { Star, MessageSquare } from "lucide-react";
import Button from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuthStore();
  const token = user?.token || localStorage.getItem("token");

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/api/products/${productId}/reviews`);
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setError("");

    try {
      await axiosInstance.post(
        `/api/products/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t pt-12">
      <h2 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-primary" />
        Customer Reviews
      </h2>

      {user ? (
        <Card className="mb-10 bg-muted/20 border-primary/10">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
            {error && (
              <p className="text-destructive mb-4 text-sm font-medium">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Review
                </label>
                <Textarea
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setComment(e.target.value)
                  }
                  placeholder="What did you like or dislike? What should other shoppers know?"
                  required
                  className="resize-none h-24"
                  disabled={submitting}
                />
              </div>
              <Button type="submit" disabled={submitting || !comment.trim()}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="mb-10 p-6 bg-muted/40 rounded-xl border border-dashed text-center">
          <p className="text-muted-foreground">
            Please log in to write a review.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground italic">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {review.user?.name || "Anonymous User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-foreground leading-relaxed">
                  {review.comment}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
