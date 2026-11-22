import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { AppShell } from "./presentation/layout/AppShell";
import { BookingsPage } from "./presentation/pages/BookingsPage";
import { ContactsPage } from "./presentation/pages/ContactsPage";
import { LoginPage } from "./presentation/pages/LoginPage";
import { NotFoundPage } from "./presentation/pages/NotFoundPage";
import { OverviewPage } from "./presentation/pages/OverviewPage";
import { RoomsPage } from "./presentation/pages/RoomsPage";
import { UsersPage } from "./presentation/pages/UsersPage";
import { getStoredUser } from "./presentation/providers/AuthProvider";

function RootLayout() {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  beforeLoad: () => {
    if (!getStoredUser()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppShell,
});

const overviewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: OverviewPage,
});

const bookingsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/bookings",
  component: BookingsPage,
});

const roomsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/rooms",
  component: RoomsPage,
});

const contactsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/contacts",
  component: ContactsPage,
});

const usersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/users",
  component: UsersPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([overviewRoute, bookingsRoute, roomsRoute, contactsRoute, usersRoute]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
