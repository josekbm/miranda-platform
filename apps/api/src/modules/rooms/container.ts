import type { PrismaClient } from "../../generated/prisma/client";
import type { Result } from "../../lib/result";
import { GetRoomById } from "./application/GetRoomById";
import { GetRoomBySlug } from "./application/GetRoomBySlug";
import { ListRooms } from "./application/ListRooms";
import type { RoomError } from "./domain/errors";
import type { Paginated, RoomQuery } from "./domain/ports";
import type { Room } from "./domain/Room";
import { PrismaRoomRepository } from "./infrastructure/PrismaRoomRepository";

export interface ListRoomsUseCase {
  execute(query: RoomQuery): Promise<Paginated<Room>>;
}

export interface GetRoomByIdUseCase {
  execute(id: string): Promise<Result<Room, RoomError>>;
}

export interface GetRoomBySlugUseCase {
  execute(slug: string): Promise<Result<Room, RoomError>>;
}

export interface RoomsContainer {
  listRooms: ListRoomsUseCase;
  getRoomById: GetRoomByIdUseCase;
  getRoomBySlug: GetRoomBySlugUseCase;
}

export function buildRoomsContainer(prisma: PrismaClient): RoomsContainer {
  const rooms = new PrismaRoomRepository(prisma);

  return {
    listRooms: new ListRooms(rooms),
    getRoomById: new GetRoomById(rooms),
    getRoomBySlug: new GetRoomBySlug(rooms),
  };
}
