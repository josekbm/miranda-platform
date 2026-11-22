import type { PageMeta, Paginated } from "../../../shared/pagination";
import type { Room, RoomType } from "./Room";

export type { PageMeta, Paginated };

export interface RoomQuery {
  page: number;
  pageSize: number;
  type?: RoomType | undefined;
  search?: string | undefined;
  active?: boolean | undefined;
}

export interface RoomRepository {
  findById(id: string): Promise<Room | null>;
  findBySlug(slug: string): Promise<Room | null>;
  list(query: RoomQuery): Promise<Paginated<Room>>;
}
