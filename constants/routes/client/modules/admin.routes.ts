export const ADMIN_ROUTES = {
  // Main admin dashboard
  DASHBOARD: "/admin/dashboard",
  
  // User management
  STUDENTS: "/admin/students",
  INSTRUCTORS: "/admin/instructors",
  
  // Content management
  COURSES: "/admin/courses",
  COURSE_DETAILS: (courseSlug: string) => `/admin/courses/${courseSlug}`,
  CATEGORIES: "/admin/categories",
  
  // Review system
  REVIEW_COURSES: "/admin/review-courses",
  REVIEW_COURSE_CURRICULUM: "/admin/review-courses/curriculum",
  REVIEW_INSTRUCTOR: "/admin/review-instructor",
  REVIEW_INSTRUCTOR_DETAILS: (instructorSlug: string) => `/admin/review-instructor/${instructorSlug}`,
  
  // Financial management
  COINS: "/admin/coins",
};