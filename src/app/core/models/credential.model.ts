export type CredentialModel = {
  email: string;
  password: string;
};

export type SignInResponseModel = {
  token: string;
  type: string;
};

export type ResetPasswordRequestModel = {
  email: string;
};

export type ResetPasswordConfirmModel = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordResponseModel = {
  message: string;
  success: boolean;
};
