import type { Clock, IdGenerator, UnitOfWork } from "../shared/ports";

export class FakeClock implements Clock {
  constructor(private current: Date) {}

  now(): Date {
    return new Date(this.current);
  }

  advanceTo(date: Date): void {
    this.current = date;
  }
}

export class SequentialIdGenerator implements IdGenerator {
  private sequence = 0;

  uuid(): string {
    this.sequence += 1;
    return `00000000-0000-4000-8000-${String(this.sequence).padStart(12, "0")}`;
  }
}

export class ImmediateUnitOfWork implements UnitOfWork {
  async transaction<T>(work: () => Promise<T>): Promise<T> {
    return work();
  }
}
