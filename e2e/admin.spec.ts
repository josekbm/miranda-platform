import { expect, test } from "@playwright/test";

const adminUrl = "http://127.0.0.1:5173";

async function login(page: import("@playwright/test").Page) {
  await page.goto(`${adminUrl}/login`);
  await page.getByRole("button", { name: /entrar al panel/i }).click();
  await expect(page).toHaveURL(`${adminUrl}/`);
  await expect(
    page.getByRole("heading", { level: 1, name: /buenos días, miranda/i }),
  ).toBeVisible();
}

test.describe("dashboard interno", () => {
  test("login, overview y navegación principal", async ({ page }) => {
    await login(page);

    await expect(page.getByText("Llegadas hoy")).toBeVisible();
    await expect(page.getByText("Ingresos y ocupación")).toBeVisible();

    await page.getByRole("link", { name: "Reservas", exact: true }).click();
    await expect(page).toHaveURL(`${adminUrl}/bookings`);
    await expect(page.getByRole("heading", { level: 1, name: "Reservas" })).toBeVisible();

    await page.getByRole("link", { name: "Habitaciones", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Habitaciones" })).toBeVisible();

    await page.getByRole("link", { name: "Contactos", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Contactos" })).toBeVisible();

    await page.getByRole("link", { name: "Equipo", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Equipo" })).toBeVisible();
  });

  test("confirmar una reserva pendiente y cambiar a modo oscuro", async ({ page }) => {
    await login(page);
    await page.getByRole("link", { name: "Reservas", exact: true }).click();

    await page.getByRole("button", { name: /pendientes/i }).click();
    await page.getByRole("button", { name: "Ver" }).first().click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Confirmada" }).click();
    await expect(page.getByText("Reserva actualizada")).toBeVisible();

    await page.getByRole("button", { name: "Activar modo oscuro" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("la sesión persiste al recargar", async ({ page }) => {
    await login(page);
    await page.reload();
    await expect(
      page.getByRole("heading", { level: 1, name: /buenos días, miranda/i }),
    ).toBeVisible();
  });
});
