import type { Paginated, RoomQuery, RoomRepository } from "../domain/ports";
import type { Room } from "../domain/Room";

export class ListRooms {
  constructor(private readonly rooms: RoomRepository) {}

  async execute(query: RoomQuery): Promise<Paginated<Room>> {
    const page = Math.max(1, Math.trunc(query.page));
    const pageSize = Math.min(100, Math.max(1, Math.trunc(query.pageSize)));

    return this.rooms.list({ ...query, page, pageSize });
  }
}
