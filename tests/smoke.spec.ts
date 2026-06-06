import { expect, test } from "@playwright/test";

test("renders the Spanish home page hero", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Cómo un telescopio H-alpha revela la cromosfera" }),
  ).toBeVisible();
  await expect(page.getByText("Sol en una sola línea espectral")).toBeVisible();
});

test("renders the English home page hero", async ({ page }) => {
  await page.goto("/en/");

  await expect(
    page.getByRole("heading", { name: "How an H-alpha telescope reveals the chromosphere" }),
  ).toBeVisible();
  await expect(page.getByText("The Sun in one spectral line")).toBeVisible();
});
