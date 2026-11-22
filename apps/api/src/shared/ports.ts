export interface Clock {
  now(): Date;
}

export interface IdGenerator {
  uuid(): string;
}

export interface UnitOfWork {
  transaction<T>(work: () => Promise<T>): Promise<T>;
}
