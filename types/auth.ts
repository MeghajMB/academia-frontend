  // User Credentials for Login
  export interface UserCredentials {
    email: string;
    password: string;
  }
  
  //User SignUp Interface
  export interface SignupCredentials extends UserCredentials {
    name: string;
    confirmPassword: string;
  }