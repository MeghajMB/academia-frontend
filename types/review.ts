export interface Review {
    id: string
    studentId: {
      name: string
      avatar?: string
    }
    rating: number
    comment: string
    createdAt: string
  }
  
  export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<string, number>;
}
  
  