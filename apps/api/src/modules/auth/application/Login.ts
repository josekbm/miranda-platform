import { err, ok, type Result } from "../../../lib/result";
import type { Clock, IdGenerator } from "../../../shared/ports";
import { ACCESS_TOKEN_TTL_SECONDS } from "../domain/auth.constants";
import { AuthError, InvalidCredentialsError, UserInactiveError } from "../domain/errors";
import type {
  AuthSession,
  PasswordHasher,
  RefreshTokenRepository,
  RefreshTokenService,
  TokenService,
  UserRepository,
} from "../domain/ports";

export interface LoginInput {
  email: string;
  password: string;
  userAgent?: string;
  ip?: string;
}

export class Login {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: TokenService,
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly ids: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async execute(input: LoginInput): Promise<Result<AuthSession, AuthError>> {
    try {
      const email = input.email.trim().toLowerCase();
      const user = await this.users.findByEmail(email);

      if (!user) {
        return err(new InvalidCredentialsError());
      }

      const passwordMatches = await this.passwordHasher.verify(
        input.password,
        user.toPrimitives().passwordHash,
      );

      if (!passwordMatches) {
        return err(new InvalidCredentialsError());
      }

      if (!user.isActive()) {
        return err(new UserInactiveError());
      }

      const now = this.clock.now();
      const accessToken = await this.tokens.signAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      const refresh = this.refreshTokenService.generate(now);

      await this.refreshTokens.create({
        id: this.ids.uuid(),
        userId: user.id,
        tokenHash: refresh.hash,
        expiresAt: refresh.expiresAt,
        userAgent: input.userAgent ?? null,
        ip: input.ip ?? null,
      });

      return ok({
        accessToken,
        refreshToken: refresh.token,
        accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
        refreshTokenExpiresAt: refresh.expiresAt,
        user: user.toPublic(),
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return err(error);
      }

      throw error;
    }
  }
}
