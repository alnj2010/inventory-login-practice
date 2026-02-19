export interface AuthResponse {
  body: {
    user: User;
    accessToken: string;
  };
}

export interface AuthResponseError {
  body: {
    error: string;
  };
}

export interface User {
  id: string;
  name?: string;
  username: string;
}

export interface AccessTokenResponse {
  body: {
    accessToken: string;
    user: User;
  };
}
