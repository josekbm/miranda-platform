import type { Clock } from "../../../shared/ports";
import type { RefreshTokenRepository, RefreshTokenService } from "../domain/ports";

export interface LogoutInput {
  refreshToken: string;
}

export class Logout {
  constructor(
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly clock: Clock,
  ) {}

  async execute(input: LogoutInput): Promise<void> {
    const tokenHash = this.refreshTokenService.hash(input.refreshToken);
    const current = await this.refreshTokens.findByHash(tokenHash);

    if (current && !current.revokedAt) {
      await this.refreshTokens.revoke(current.id, this.clock.now());
    }
  }
}
