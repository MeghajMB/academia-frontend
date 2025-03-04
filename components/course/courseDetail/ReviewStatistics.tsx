import useReviewApi from "@/hooks/api/useReviewApi";
import { ReviewStats } from "@/types/review";
import { Card, CardBody, Progress, Spinner } from "@nextui-org/react";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";


export function ReviewStatistics({ courseId }: {courseId:string}) {
  const { fetchCourseReviewStatiticsApi } = useReviewApi();
  const [reviewStatitics, setReviewStatitics] = useState<ReviewStats>();
  useEffect(() => {
    async function fetchData() {
      const response = await fetchCourseReviewStatiticsApi(courseId);
      setReviewStatitics(response);
    }
    fetchData();
  }, []);
  if(!reviewStatitics){
    return <Spinner />
  }
  return (
    <Card className="bg-content1">
      <CardBody className="gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Customer Reviews</h3>
            <p className="text-sm text-default-500">
              Based on {reviewStatitics.totalReviews} reviews
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {reviewStatitics.averageRating}
              </span>
              <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
            </div>
            <p className="text-sm text-default-500">Average rating</p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.keys(reviewStatitics.ratingBreakdown).map((rating) => {
            

            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                </div>
                <Progress
                  aria-label={`${rating} star reviews`}
                  value={reviewStatitics.ratingBreakdown[rating]}
                  className="flex-1"
                  classNames={{
                    indicator: "bg-yellow-500",
                  }}
                />
                <span className="text-sm text-default-500 w-16 text-right">
                  {reviewStatitics.ratingBreakdown[rating]}%
                </span>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
