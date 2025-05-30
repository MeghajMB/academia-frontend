export interface InstructorPayload {
  headline: string;
  biography: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  website: string;
  agreement: boolean;
}
export interface ResetPasswordPayload {
  email: string;
  password: string;
  token: string;
}

export interface VerifyOtpPayload {
  otp: string;
  email: string;
}

/*  */
export interface VerifyOtpData {
  userId: string;
}

export interface RegisterInstructorData {
  data?: null;
}

export interface ResendOtpData {
  data?: null;
}

export interface ForgotPasswordData {
  data?: null;
}

export interface VerifyResetPasswordData {
  resetToken: string;
}

export interface ResetPasswordData {
  data?: null;
}

export interface LogoutData {
  data?: null;
}

export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
  id: string;
  role: string;
  name: string;
  email: string;
  verified: boolean;
  profilePicture: string;
}

export interface SignInData {
  accessToken: string;
  refreshToken: string;
  id: string;
  name: string;
  role: string;
  userEmail: string;
}
