import { Avatar, Button, Card, CardBody } from "@heroui/react";
import { Edit2, Star, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { ReviewStatistics } from "./ReviewStatistics";
import { Review } from "@/types/review";

interface CourseReviewsProps {
  reviews: Review[];
  currentUserId?: string;
  onAddReview: (review: Partial<Review>) => void;
  onEditReview: (review: Partial<Review>) => void;
  onDeleteReview: (reviewId: string) => void;
  canReview: boolean;
  hasReviewed: boolean;
  courseId: string;
}

function CourseReviews({
  reviews,
  currentUserId,
  onAddReview,
  onEditReview,
  onDeleteReview,
  canReview,
  courseId,
  hasReviewed,
}: CourseReviewsProps) {
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);

  const handleAddReview = (review: Partial<Review>) => {
    onAddReview(review);
    setIsAddingReview(false);
  };

  const handleEditReview = (review: Partial<Review>) => {
    onEditReview(review);
    setEditingReviewId(null);
  };
  return (
    <div className="space-y-6">
      <ReviewStatistics courseId={courseId} />

      {!isAddingReview && canReview && !hasReviewed && (
        <Button
          color="primary"
          onPress={() => setIsAddingReview(true)}
          className="w-full sm:w-auto"
        >
          Write a Review
        </Button>
      )}

      {isAddingReview && (
        <ReviewForm
          onSubmit={handleAddReview}
          onCancel={() => setIsAddingReview(false)}
        />
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id}>
            {editingReviewId === review.id ? (
              <ReviewForm
                initialReview={review}
                onSubmit={handleEditReview}
                onCancel={() => setEditingReviewId(null)}
              />
            ) : (
              <Card className="bg-content1">
                <CardBody className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={review.studentId.avatar}
                      name={review.studentId.name}
                      size="md"
                      className="border-2 border-content2"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-default-foreground">
                            {review.studentId.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} />
                            <span className="text-xs text-default-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>

                        {currentUserId === review.studentId.name && (
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              onPress={() => setEditingReviewId(review.id)}
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              color="danger"
                              onPress={() => onDeleteReview(review.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        )}
                      </div>

                      <p className="mt-3 text-sm text-default-500 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseReviews;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating
              ? "fill-yellow-500 text-yellow-500"
              : "fill-gray-600 text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;

  return date.toLocaleDateString();
}
