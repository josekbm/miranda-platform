export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "USER_INACTIVE"
  | "INVALID_REFRESH_TOKEN"
  | "UNAUTHORIZED"
  | "AUTH_VALIDATION";

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("INVALID_CREDENTIALS", "Email or password is incorrect.");
    this.name = "InvalidCredentialsError";
  }
}

export class UserInactiveError extends AuthError {
  constructor() {
    super("USER_INACTIVE", "This user is inactive.");
    this.name = "UserInactiveError";
  }
}

export class InvalidRefreshTokenError extends AuthError {
  constructor() {
    super("INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired.");
    this.name = "InvalidRefreshTokenError";
  }
}

export class UnauthorizedError extends AuthError {
  constructor() {
    super("UNAUTHORIZED", "Authentication is required.");
    this.name = "UnauthorizedError";
  }
}

export class AuthValidationError extends AuthError {
  constructor(message: string) {
    super("AUTH_VALIDATION", message);
    this.name = "AuthValidationError";
  }
}
