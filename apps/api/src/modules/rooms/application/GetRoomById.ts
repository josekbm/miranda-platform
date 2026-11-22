import { err, ok, type Result } from "../../../lib/result";
import { type RoomError, RoomNotFoundError } from "../domain/errors";
import type { RoomRepository } from "../domain/ports";
import type { Room } from "../domain/Room";

export class GetRoomById {
  constructor(private readonly rooms: RoomRepository) {}

  async execute(id: string): Promise<Result<Room, RoomError>> {
    const room = await this.rooms.findById(id);

    if (!room) {
      return err(new RoomNotFoundError(id));
    }

    return ok(room);
  }
}
