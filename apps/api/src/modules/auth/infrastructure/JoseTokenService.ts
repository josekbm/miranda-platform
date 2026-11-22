import { jwtVerify, SignJWT } from "jose";
import { ACCESS_TOKEN_TTL_SECONDS } from "../domain/auth.constants";
import type { AccessTokenPayload, TokenService } from "../domain/ports";
import { isRole } from "../domain/roles";

const encoder = new TextEncoder();

export class JoseTokenService implements TokenService {
  private readonly key: Uint8Array;

  constructor(
    secret: string,
    private readonly issuer = "miranda-api",
    private readonly audience = "miranda-admin",
  ) {
    this.key = encoder.encode(secret);
  }

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return new SignJWT({ email: payload.email, role: payload.role })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.sub)
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS)
      .sign(this.key);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const { payload } = await jwtVerify(token, this.key, {
      issuer: this.issuer,
      audience: this.audience,
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string" ||
      !isRole(payload.role)
    ) {
      throw new Error("Invalid access token payload");
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
