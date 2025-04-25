"use client"

import { motion } from "framer-motion"
import { Progress } from "@heroui/react"
import { StarIcon } from "lucide-react"

interface RatingDistributionProps {
  data: {
    average: number
    total: number
    distribution: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
  }
}

export const RatingDistribution = ({ data }: RatingDistributionProps) => {
  const totalReviews = Object.values(data.distribution).reduce((sum, count) => sum + count, 0)

  const ratingBars = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: data.distribution[rating as keyof typeof data.distribution],
    percentage: Math.round((data.distribution[rating as keyof typeof data.distribution] / totalReviews) * 100),
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center"
      >
        <div className="text-6xl font-bold text-secondary mb-2">{data.average}</div>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              size={20}
              className={Number.parseFloat(data.average) >= star ? "text-amber-500 fill-amber-500" : "text-gray-300"}
            />
          ))}
        </div>
        <p className="text-default-500 text-sm">{data.total} reviews</p>
      </motion.div>

      <div className="space-y-4">
        {ratingBars.map((item, index) => (
          <motion.div
            key={item.rating}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{item.rating}</span>
                <StarIcon size={14} className="text-amber-500 fill-amber-500" />
              </div>
              <Progress
                value={item.percentage}
                color={item.rating >= 4 ? "success" : item.rating === 3 ? "warning" : "danger"}
                className="h-2 flex-1"
                aria-label={`${item.rating} star ratings`}
              />
              <div className="w-16 text-right">
                <span className="text-sm text-default-500">{item.count}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
