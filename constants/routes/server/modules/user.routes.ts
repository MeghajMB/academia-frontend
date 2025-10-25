const VERSION = "v1";

export const USER_ROUTES = {
  GET_ALL: `/${VERSION}/users`,
  GET_BY_ID: (id: string) => `/${VERSION}/users/${id}`,
  GET_BY_SLUG: (slug: string) => `/${VERSION}/users/slug/${slug}`,
  UPDATE: (id: string) => `/${VERSION}/users/${id}`,
  DELETE: (id: string) => `/${VERSION}/users/${id}`,
  
  // User management
  BLOCK: (id: string) => `/${VERSION}/users/${id}/block`,
  UNBLOCK: (id: string) => `/${VERSION}/users/${id}/unblock`,
  
  // User profile
  PROFILE: `/${VERSION}/users/profile`,
  UPDATE_PROFILE: `/${VERSION}/users/profile`,
  UPLOAD_AVATAR: `/${VERSION}/users/avatar`,
  
  // User wallet
  WALLET: `/${VERSION}/users/wallet`,
  WALLET_TRANSACTIONS: `/${VERSION}/users/wallet/transactions`,
  
  // User notifications
  NOTIFICATIONS: `/${VERSION}/users/notifications`,
  MARK_NOTIFICATION_READ: (notificationId: string) => `/${VERSION}/users/notifications/${notificationId}/read`,
  
  // User learning progress
  LEARNING_PROGRESS: `/${VERSION}/users/learning-progress`,
  COURSE_PROGRESS: (courseId: string) => `/${VERSION}/users/courses/${courseId}/progress`,
};
