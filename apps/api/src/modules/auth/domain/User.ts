import { AuthValidationError } from "./errors";
import type { Role, UserStatus } from "./roles";

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
  avatarUrl: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireNonEmpty(value: string, field: string): string {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new AuthValidationError(`${field} is required.`);
  }

  return trimmed;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static reconstitute(props: UserProps): User {
    const email = requireNonEmpty(props.email, "User email").toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      throw new AuthValidationError("User email is not valid.");
    }

    return new User({
      ...props,
      id: requireNonEmpty(props.id, "User id"),
      email,
      passwordHash: requireNonEmpty(props.passwordHash, "Password hash"),
      name: requireNonEmpty(props.name, "User name"),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  get role(): Role {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl;
  }

  isActive(): boolean {
    return this.props.status === "ACTIVE";
  }

  toPublic(): PublicUser {
    return {
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      phone: this.props.phone,
      role: this.props.role,
      status: this.props.status,
      avatarUrl: this.props.avatarUrl,
    };
  }

  toPrimitives(): UserProps {
    return { ...this.props };
  }
}
