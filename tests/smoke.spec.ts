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

test("updates the Spanish spectrum explorer readout", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Longitud de onda seleccionada").fill("520");

  await expect(page.getByText("Selección: 520 nm")).toBeVisible();
});

test("renders the Spanish filter comparison as three safety-focused cards", async ({ page }) => {
  await page.goto("/");

  const filterComparison = page.getByRole("list", { name: "Comparación de tipos de filtros solares" });

  await expect(filterComparison.getByRole("listitem")).toHaveCount(3);
  await expect(filterComparison).toContainText("Gafas de eclipse");
  await expect(filterComparison).toContainText("ISO 12312-2");
  await expect(filterComparison).toContainText("Filtro telescópico de luz blanca");
  await expect(filterComparison).toContainText("Apertura frontal");
  await expect(filterComparison).toContainText("blocking filter");
  await expect(filterComparison).toContainText("seguridad");
});

test("updates the Spanish bandpass tuning explanation", async ({ page }) => {
  await page.goto("/");

  const simulator = page.getByRole("group", { name: "Simulador de la ventana espectral H-alpha" });
  const readout = simulator.locator(".bandpass-sim__readout");

  await expect(readout.getByText("Banda estrecha")).toBeVisible();

  await simulator.getByRole("slider", { name: "Anchura de bandpass" }).press("End");
  await expect(readout.getByText("Banda ancha")).toBeVisible();

  await simulator.getByRole("slider", { name: "Desplazamiento de tuning" }).press("End");
  await expect(readout.getByText("Fuera de banda")).toBeVisible();
});
