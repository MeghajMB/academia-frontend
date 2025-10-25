export const INSTRUCTOR_ROUTES = {
  // Main instructor dashboard
  DASHBOARD: "/instructor/dashboard",
  HOME: "/instructor",
  
  // Course management
  COURSES: "/instructor/courses",
  COURSE_DETAILS: (courseSlug: string) => `/instructor/courses/${courseSlug}`,
  CREATE_COURSE: "/instructor/courses/create",
  
  // Gig management
  GIGS: "/instructor/gigs",
};
