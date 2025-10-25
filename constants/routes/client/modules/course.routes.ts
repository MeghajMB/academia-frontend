export const COURSE_ROUTES = {
  // Course viewing and learning
  COURSE_DETAILS: (courseSlug: string) => `/course/${courseSlug}`,
  COURSE_LEARN: (courseSlug: string) => `/course/${courseSlug}/learn`,
};
