interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

interface BackendTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

declare namespace Auth {
  export interface AccessRefreshTokens {
    user?: IUser;
    backendTokens: BackendTokens;
  }
}
