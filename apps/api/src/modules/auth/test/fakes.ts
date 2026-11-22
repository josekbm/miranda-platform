import { REFRESH_TOKEN_TTL_MS } from "../domain/auth.constants";
import type {
  AccessTokenPayload,
  CreateRefreshTokenInput,
  PasswordHasher,
  RefreshTokenRecord,
  RefreshTokenRepository,
  RefreshTokenService,
  TokenService,
  UserRepository,
} from "../domain/ports";
import type { Role } from "../domain/roles";
import type { User } from "../domain/User";

export {
  FakeClock,
  ImmediateUnitOfWork,
  SequentialIdGenerator,
} from "../../../test/fakes";

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  constructor(users: User[] = []) {
    for (const user of users) {
      this.users.set(user.id, user);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    return [...this.users.values()].find((user) => user.email === normalized) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  save(user: User): void {
    this.users.set(user.id, user);
  }
}

export class FakePasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return hash === `hashed:${password}`;
  }
}

export class FakeTokenService implements TokenService {
  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return `access:${payload.sub}:${payload.role}`;
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const [, sub, role] = token.split(":");

    if (!sub || !role) {
      throw new Error("Invalid access token");
    }

    return { sub, email: "test@example.com", role: role as Role };
  }
}

export class FakeRefreshTokenService implements RefreshTokenService {
  private sequence = 0;

  generate(now: Date): { token: string; hash: string; expiresAt: Date } {
    this.sequence += 1;
    const token = `refresh-${this.sequence}`;

    return {
      token,
      hash: this.hash(token),
      expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS),
    };
  }

  hash(token: string): string {
    return `hash:${token}`;
  }
}

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  readonly records = new Map<string, RefreshTokenRecord>();

  async findByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    return this.records.get(tokenHash) ?? null;
  }

  async create(input: CreateRefreshTokenInput): Promise<void> {
    this.records.set(input.tokenHash, {
      ...input,
      revokedAt: null,
      createdAt: new Date(),
    });
  }

  async revoke(id: string, revokedAt: Date): Promise<void> {
    for (const [hash, record] of this.records) {
      if (record.id === id) {
        this.records.set(hash, { ...record, revokedAt });
      }
    }
  }

  async revokeAllForUser(userId: string, revokedAt: Date): Promise<void> {
    for (const [hash, record] of this.records) {
      if (record.userId === userId) {
        this.records.set(hash, { ...record, revokedAt });
      }
    }
  }
}
