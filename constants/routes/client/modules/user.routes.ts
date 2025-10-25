export const USER_ROUTES = {
  // Main user dashboard/home
  HOME: "/home",
  
  // Learning related
  COURSES: "/home/courses",
  MY_LEARNING: "/home/my-learning",
  MY_SESSION: "/home/my-session",
  
  // Marketplace
  GIGS: "/home/gigs",
  GIG_DETAILS: (gigSlug: string) => `/home/gigs/${gigSlug}`,
  SHOP: "/home/shop",
  
  // User management
  PROFILE: "/home/profile",
  WALLET: "/home/wallet",
  NOTIFICATION: "/home/notification",
  
  // Instructor profiles
  INSTRUCTOR_PROFILE: (instructorSlug: string) => `/home/instructor/${instructorSlug}`,
};
