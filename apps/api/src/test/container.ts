import type { AppContainer } from "../container";
import type { AuthContainer } from "../modules/auth/container";
import type { TokenService } from "../modules/auth/domain/ports";
import type { BookingsContainer } from "../modules/bookings/container";
import type { RoomsContainer } from "../modules/rooms/container";

function notImplemented(): never {
  throw new Error("Not implemented in fake container");
}

const defaultTokens: TokenService = {
  async signAccessToken() {
    return "access-token";
  },
  async verifyAccessToken(token) {
    if (token !== "valid") {
      throw new Error("Invalid token");
    }

    return {
      sub: "00000000-0000-4000-8000-000000000001",
      email: "admin@miranda.test",
      role: "ADMIN",
    };
  },
};

export function createFakeContainer(
  overrides: {
    auth?: Partial<AuthContainer>;
    bookings?: Partial<BookingsContainer>;
    rooms?: Partial<RoomsContainer>;
  } = {},
): AppContainer {
  const auth = {
    login: { execute: notImplemented },
    refreshSession: { execute: notImplemented },
    logout: { execute: notImplemented },
    getCurrentUser: { execute: notImplemented },
    tokens: defaultTokens,
    ...overrides.auth,
  } as AuthContainer;

  const bookings = {
    createBooking: { execute: notImplemented },
    listBookings: { execute: notImplemented },
    getBooking: { execute: notImplemented },
    updateBookingStatus: { execute: notImplemented },
    ...overrides.bookings,
  } as BookingsContainer;

  const rooms = {
    listRooms: { execute: notImplemented },
    getRoomById: { execute: notImplemented },
    getRoomBySlug: { execute: notImplemented },
    ...overrides.rooms,
  } as RoomsContainer;

  return { auth, bookings, rooms };
}
