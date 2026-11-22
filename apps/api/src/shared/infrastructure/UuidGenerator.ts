import { randomUUID } from "node:crypto";
import type { IdGenerator } from "../ports";

export class UuidGenerator implements IdGenerator {
  uuid(): string {
    return randomUUID();
  }
}
