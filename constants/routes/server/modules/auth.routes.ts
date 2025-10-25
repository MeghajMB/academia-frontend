const VERSION = "v1";

export const AUTH_ROUTES = {
  SIGN_UP: `/${VERSION}/auth/signup`,
  SIGN_IN: `/${VERSION}/auth/signin`,
  ADMIN_SIGN_IN: `/${VERSION}/auth/admin/signin`,
  
  // Email verification
  VERIFY_EMAIL: `/${VERSION}/auth/verify-email`,
  RESEND_VERIFICATION: `/${VERSION}/auth/resend-verification`,
  
  // Password management
  FORGOT_PASSWORD: `/${VERSION}/auth/forgot-password`,
  RESET_PASSWORD: `/${VERSION}/auth/reset-password`,
  
  // OTP
  VERIFY_OTP: `/${VERSION}/auth/verify-otp`,
  RESEND_OTP: `/${VERSION}/auth/resend-otp`,
  
  // Token management
  ACCESS_TOKEN: `/${VERSION}/auth/access-token`,
  REFRESH_TOKEN: `/${VERSION}/auth/refresh-token`,
  SIGN_OUT: `/${VERSION}/auth/signout`,
  
  // OAuth
  GOOGLE: `/${VERSION}/auth/google`,
  FACEBOOK: `/${VERSION}/auth/facebook`,
  
  // Profile
  PROFILE: `/${VERSION}/auth/profile`,
  UPDATE_PROFILE: `/${VERSION}/auth/profile`,
};
