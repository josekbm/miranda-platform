import { createHash, randomBytes } from "node:crypto";
import { REFRESH_TOKEN_TTL_MS } from "../domain/auth.constants";
import type { RefreshTokenService } from "../domain/ports";

export class CryptoRefreshTokenService implements RefreshTokenService {
  generate(now: Date): { token: string; hash: string; expiresAt: Date } {
    const token = randomBytes(48).toString("base64url");

    return {
      token,
      hash: this.hash(token),
      expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS),
    };
  }

  hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
