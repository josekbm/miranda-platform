import { err, ok, type Result } from "../../../lib/result";
import type { Clock, IdGenerator } from "../../../shared/ports";
import { ACCESS_TOKEN_TTL_SECONDS } from "../domain/auth.constants";
import { AuthError, InvalidRefreshTokenError, UserInactiveError } from "../domain/errors";
import type {
  AuthSession,
  RefreshTokenRepository,
  RefreshTokenService,
  TokenService,
  UnitOfWork,
  UserRepository,
} from "../domain/ports";

export interface RefreshSessionInput {
  refreshToken: string;
  userAgent?: string;
  ip?: string;
}

export class RefreshSession {
  constructor(
    private readonly users: UserRepository,
    private readonly tokens: TokenService,
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly ids: IdGenerator,
    private readonly clock: Clock,
    private readonly uow: UnitOfWork,
  ) {}

  async execute(input: RefreshSessionInput): Promise<Result<AuthSession, AuthError>> {
    try {
      const tokenHash = this.refreshTokenService.hash(input.refreshToken);
      const current = await this.refreshTokens.findByHash(tokenHash);

      if (!current || current.revokedAt) {
        return err(new InvalidRefreshTokenError());
      }

      const now = this.clock.now();

      if (current.expiresAt.getTime() <= now.getTime()) {
        return err(new InvalidRefreshTokenError());
      }

      const user = await this.users.findById(current.userId);

      if (!user) {
        return err(new InvalidRefreshTokenError());
      }

      if (!user.isActive()) {
        return err(new UserInactiveError());
      }

      const accessToken = await this.tokens.signAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      const nextRefresh = this.refreshTokenService.generate(now);

      await this.uow.transaction(async () => {
        await this.refreshTokens.revoke(current.id, now);
        await this.refreshTokens.create({
          id: this.ids.uuid(),
          userId: user.id,
          tokenHash: nextRefresh.hash,
          expiresAt: nextRefresh.expiresAt,
          userAgent: input.userAgent ?? current.userAgent,
          ip: input.ip ?? current.ip,
        });
      });

      return ok({
        accessToken,
        refreshToken: nextRefresh.token,
        accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
        refreshTokenExpiresAt: nextRefresh.expiresAt,
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
