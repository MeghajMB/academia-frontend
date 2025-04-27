
  export interface FetchUsersData {
    users: Array<{ id: string; name: string; email: string; role: string }>;
    totalPages: number;
  }
  
  export interface FetchCoursesData {
    courses: Array<{ id: string; title: string; instructor: string }>;
    totalPages: number;
  }
  
  export interface FetchInstructorRequestsData {
    requests: Array<{ id: string; userId: string; status: string }>;
    totalPages: number;
  }
  
  export interface FetchCategoriesData {
    categories: Array<{ id: string; name: string; description: string }>;
    totalPages: number;
  }
  
  export interface CreateCategoryData {
    categoryId: string;
  }
  
  export interface FetchCoursesForReviewData {
    courses: Array<{ id: string; title: string; instructor: string }>;
    totalPages: number;
  }