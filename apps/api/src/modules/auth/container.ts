import { env } from "../../env";
import type { PrismaClient } from "../../generated/prisma/client";
import type { Result } from "../../lib/result";
import { PrismaUnitOfWork } from "../../shared/infrastructure/PrismaUnitOfWork";
import { SystemClock } from "../../shared/infrastructure/SystemClock";
import { UuidGenerator } from "../../shared/infrastructure/UuidGenerator";
import { GetCurrentUser } from "./application/GetCurrentUser";
import { Login, type LoginInput } from "./application/Login";
import { Logout, type LogoutInput } from "./application/Logout";
import { RefreshSession, type RefreshSessionInput } from "./application/RefreshSession";
import type { AuthError } from "./domain/errors";
import type { AuthSession, TokenService } from "./domain/ports";
import type { PublicUser } from "./domain/User";
import { Argon2PasswordHasher } from "./infrastructure/Argon2PasswordHasher";
import { CryptoRefreshTokenService } from "./infrastructure/CryptoRefreshTokenService";
import { JoseTokenService } from "./infrastructure/JoseTokenService";
import { PrismaRefreshTokenRepository } from "./infrastructure/PrismaRefreshTokenRepository";
import { PrismaUserRepository } from "./infrastructure/PrismaUserRepository";

export interface LoginUseCase {
  execute(input: LoginInput): Promise<Result<AuthSession, AuthError>>;
}

export interface RefreshSessionUseCase {
  execute(input: RefreshSessionInput): Promise<Result<AuthSession, AuthError>>;
}

export interface LogoutUseCase {
  execute(input: LogoutInput): Promise<void>;
}

export interface GetCurrentUserUseCase {
  execute(userId: string): Promise<Result<PublicUser, AuthError>>;
}

export interface AuthContainer {
  login: LoginUseCase;
  refreshSession: RefreshSessionUseCase;
  logout: LogoutUseCase;
  getCurrentUser: GetCurrentUserUseCase;
  tokens: TokenService;
}

export function buildAuthContainer(prisma: PrismaClient): AuthContainer {
  const users = new PrismaUserRepository(prisma);
  const refreshTokens = new PrismaRefreshTokenRepository(prisma);
  const passwordHasher = new Argon2PasswordHasher();
  const tokens = new JoseTokenService(env.JWT_SECRET);
  const refreshTokenService = new CryptoRefreshTokenService();
  const ids = new UuidGenerator();
  const clock = new SystemClock();
  const uow = new PrismaUnitOfWork(prisma);

  return {
    login: new Login(users, passwordHasher, tokens, refreshTokens, refreshTokenService, ids, clock),
    refreshSession: new RefreshSession(
      users,
      tokens,
      refreshTokens,
      refreshTokenService,
      ids,
      clock,
      uow,
    ),
    logout: new Logout(refreshTokens, refreshTokenService, clock),
    getCurrentUser: new GetCurrentUser(users),
    tokens,
  };
}
