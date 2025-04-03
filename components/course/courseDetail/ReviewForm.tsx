"use client"

import type React from "react"

import { Button, Card, CardBody, CardFooter, CardHeader, Textarea } from "@heroui/react"
import { Star } from "lucide-react"
import { useState } from "react"
import { Review } from "@/types/review"

interface ReviewFormProps {
  initialReview?: Review
  onSubmit: (review: Partial<Review>) => void
  onCancel?: () => void
}

export function ReviewForm({ initialReview, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating || 0)
  const [comment, setComment] = useState(initialReview?.comment || "")
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      rating,
      comment,
      ...(initialReview?.id ? { id: initialReview.id } : {}),
    })
  }

  return (
    <Card className="bg-content1">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <h3 className="text-lg font-bold">{initialReview ? "Edit Review" : "Write a Review"}</h3>
        </CardHeader>
        <CardBody className="gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-gray-600 text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              minRows={3}
              required
            />
          </div>
        </CardBody>
        <CardFooter className="justify-end gap-2">
          {onCancel && (
            <Button variant="flat" color="danger" onPress={onCancel}>
              Cancel
            </Button>
          )}
          <Button color="primary" type="submit" isDisabled={!rating || !comment.trim()}>
            {initialReview ? "Update Review" : "Submit Review"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

