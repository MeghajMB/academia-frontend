const VERSION = "v1";

export const INSTRUCTOR_ROUTES = {
  GET_ALL: `/${VERSION}/instructors`,
  GET_BY_ID: (id: string) => `/${VERSION}/instructors/${id}`,
  GET_BY_SLUG: (slug: string) => `/${VERSION}/instructors/slug/${slug}`,
  UPDATE: (id: string) => `/${VERSION}/instructors/${id}`,
  
  // Instructor courses
  COURSES: (instructorId: string) => `/${VERSION}/instructors/${instructorId}/courses`,
  
  // Instructor gigs
  GIGS: (instructorId: string) => `/${VERSION}/instructors/${instructorId}/gigs`,
  
  // Instructor reviews
  REVIEWS: (instructorId: string) => `/${VERSION}/instructors/${instructorId}/reviews`,
};
