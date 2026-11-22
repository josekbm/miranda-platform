import type { AuthSession } from "../../domain/ports";

export function toAuthResponse(session: AuthSession) {
  return {
    accessToken: session.accessToken,
    accessTokenExpiresIn: session.accessTokenExpiresIn,
    refreshTokenExpiresAt: session.refreshTokenExpiresAt.toISOString(),
    user: session.user,
  };
}
