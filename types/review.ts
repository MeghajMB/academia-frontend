export interface Review {
    id: string
    studentId: {
      id:string
      name: string
      avatar?: string
    }
    rating: number
    comment: string
    createdAt: string
  }
  
  export interface IReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<string, number>;
}
  
  