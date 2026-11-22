import { err, ok, type Result } from "../../../lib/result";
import { type AuthError, UnauthorizedError } from "../domain/errors";
import type { UserRepository } from "../domain/ports";
import type { PublicUser } from "../domain/User";

export class GetCurrentUser {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string): Promise<Result<PublicUser, AuthError>> {
    const user = await this.users.findById(userId);

    if (!user?.isActive()) {
      return err(new UnauthorizedError());
    }

    return ok(user.toPublic());
  }
}
