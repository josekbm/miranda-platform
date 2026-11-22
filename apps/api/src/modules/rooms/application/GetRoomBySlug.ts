import { err, ok, type Result } from "../../../lib/result";
import { type RoomError, RoomNotFoundError } from "../domain/errors";
import type { RoomRepository } from "../domain/ports";
import type { Room } from "../domain/Room";

export class GetRoomBySlug {
  constructor(private readonly rooms: RoomRepository) {}

  async execute(slug: string): Promise<Result<Room, RoomError>> {
    const room = await this.rooms.findBySlug(slug);

    if (!room?.isActive) {
      return err(new RoomNotFoundError(slug));
    }

    return ok(room);
  }
}
