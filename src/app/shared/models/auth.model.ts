import { User } from '@auth/interfaces/user.interface';

// LOGIN
export interface LoginApiResponse {
  token: string;
  expirationDate: string;
  user: User;
}
// export interface LoginRequestBody {
//   username: string;
//   password: string;
// }

//REGISTER
export interface RegisterApiResponse {
  data: {
    userId: string;
    token: string;
    expirationDate: string;
  };
  success: boolean;
  errorMessage: string;
}
export interface RegisterRequestBody {
  documentNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  documentType: number;
  age: number;
  confirmPassword: string;
}

//FORGOT PASSWORD
export interface ForgotPasswordApiResponse {
  success: boolean;
  errorMessage: string;
}

export interface ForgotPasswordRequestBody {
  email: string;
}
