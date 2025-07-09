export type CredentialModel = {
  email: string;
  password: string;
};

export type SignInResponseModel = {
  token: string;
  type: string;
};
