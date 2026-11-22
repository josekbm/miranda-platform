export type RoomErrorCode = "ROOM_VALIDATION" | "ROOM_NOT_FOUND";

export class RoomError extends Error {
  constructor(
    public readonly code: RoomErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "RoomError";
  }
}

export class RoomValidationError extends RoomError {
  constructor(message: string) {
    super("ROOM_VALIDATION", message);
    this.name = "RoomValidationError";
  }
}

export class RoomNotFoundError extends RoomError {
  constructor(identifier: string) {
    super("ROOM_NOT_FOUND", `Room ${identifier} was not found.`);
    this.name = "RoomNotFoundError";
  }
}
