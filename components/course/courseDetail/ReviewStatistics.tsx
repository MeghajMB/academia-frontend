import { IReviewStats } from "@/types/review";
import { Card, CardBody, Progress, Spinner } from "@heroui/react";
import { Star } from "lucide-react";

export function ReviewStatistics({
  reviewStats,
}: {
  reviewStats: IReviewStats|undefined;
}) {
  if (!reviewStats) {
    return <Spinner />;
  }
  return (
    <Card className="bg-content1">
      <CardBody className="gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Customer Reviews</h3>
            <p className="text-sm text-default-500">
              Based on {reviewStats.totalReviews} reviews
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {reviewStats.averageRating}
              </span>
              <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
            </div>
            <p className="text-sm text-default-500">Average rating</p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.keys(reviewStats.ratingBreakdown).map((rating) => {
            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                </div>
                <Progress
                  aria-label={`${rating} star reviews`}
                  value={reviewStats.ratingBreakdown[rating]}
                  className="flex-1"
                  classNames={{
                    indicator: "bg-yellow-500",
                  }}
                />
                <span className="text-sm text-default-500 w-16 text-right">
                  {reviewStats.ratingBreakdown[rating]}%
                </span>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
