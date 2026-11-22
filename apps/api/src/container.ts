import { getPrisma } from "./lib/prisma";
import { type AuthContainer, buildAuthContainer } from "./modules/auth/container";
import { type BookingsContainer, buildBookingsContainer } from "./modules/bookings/container";
import { buildRoomsContainer, type RoomsContainer } from "./modules/rooms/container";

export interface AppContainer {
  auth: AuthContainer;
  bookings: BookingsContainer;
  rooms: RoomsContainer;
}

export function buildContainer(): AppContainer {
  const prisma = getPrisma();

  return {
    auth: buildAuthContainer(prisma),
    bookings: buildBookingsContainer(prisma),
    rooms: buildRoomsContainer(prisma),
  };
}
