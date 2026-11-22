import { expect, test } from "@playwright/test";

test.describe("web pública", () => {
  test("home, habitaciones y detalle funcionan en ES", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /refugio mediterráneo/i }),
    ).toBeVisible();

    await page
      .getByRole("link", { name: /descubrir habitaciones/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/habitaciones/);
    await expect(
      page.getByRole("heading", { level: 1, name: /cuatro formas de mirar al mar/i }),
    ).toBeVisible();

    await page
      .getByRole("link", { name: /ver habitación/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/habitaciones\/single-bed-101/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Habitación Single 101" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "English" }).first().click();
    await expect(page).toHaveURL(/\/en\/rooms\/single-bed-101/);
    await expect(page.getByRole("heading", { level: 1, name: "Single Room 101" })).toBeVisible();
  });

  test("el formulario de contacto se prerrellena desde una habitación", async ({ page }) => {
    await page.goto("/contacto?room=suite-301&checkIn=2026-12-01&checkOut=2026-12-03&guests=2");

    await expect(
      page.getByRole("heading", { level: 1, name: /estamos al otro lado/i }),
    ).toBeVisible();
    await expect(page.getByLabel("Asunto")).toHaveValue(/Suite 301/);
    await expect(page.getByLabel("Mensaje")).toHaveValue(/Suite 301/);
    await expect(page.getByLabel("Mensaje")).toHaveValue(/2026-12-01/);
  });

  test("las páginas bilingües tienen hreflang", async ({ page }) => {
    await page.goto("/en/rooms");
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
  });
});
