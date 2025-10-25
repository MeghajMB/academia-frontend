const VERSION = "v1";

export const COURSE_ROUTES = {
  GET_ALL: `/${VERSION}/courses`,
  GET_BY_ID: (id: string) => `/${VERSION}/courses/${id}`,
  CREATE: `/${VERSION}/courses`,
  UPDATE: (id: string) => `/${VERSION}/courses/${id}`,
  DELETE: (id: string) => `/${VERSION}/courses/${id}`,
  GET_BY_SLUG: (slug: string) => `/${VERSION}/courses/slug/${slug}`,
  
  // Course enrollment
  ENROLL: `/${VERSION}/courses/enroll`,
  UNENROLL: (courseId: string) => `/${VERSION}/courses/${courseId}/unenroll`,
  MY_COURSES: `/${VERSION}/courses/my-courses`,
  
  // Course reviews
  REVIEWS: (courseId: string) => `/${VERSION}/courses/${courseId}/reviews`,
  ADD_REVIEW: (courseId: string) => `/${VERSION}/courses/${courseId}/reviews`,
};
