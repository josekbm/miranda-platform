import type { Paginated, RoomQuery, RoomRepository } from "../domain/ports";
import type { Room } from "../domain/Room";

export class InMemoryRoomRepository implements RoomRepository {
  private readonly items = new Map<string, Room>();

  constructor(rooms: Room[] = []) {
    for (const room of rooms) {
      this.items.set(room.id, room);
    }
  }

  async findById(id: string): Promise<Room | null> {
    return this.items.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<Room | null> {
    return [...this.items.values()].find((room) => room.slug === slug) ?? null;
  }

  async list(query: RoomQuery): Promise<Paginated<Room>> {
    const search = query.search?.toLowerCase();
    const filtered = [...this.items.values()].filter((room) => {
      if (query.active !== undefined && room.isActive !== query.active) {
        return false;
      }

      if (query.type && room.type !== query.type) {
        return false;
      }

      if (search) {
        const matchesNumber = room.roomNumber.toLowerCase().includes(search);
        const matchesName = room.translations.some((translation) =>
          translation.name.toLowerCase().includes(search),
        );

        if (!matchesNumber && !matchesName) {
          return false;
        }
      }

      return true;
    });

    const start = (query.page - 1) * query.pageSize;

    return {
      data: filtered.slice(start, start + query.pageSize),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / query.pageSize),
      },
    };
  }

  save(room: Room): void {
    this.items.set(room.id, room);
  }
}
