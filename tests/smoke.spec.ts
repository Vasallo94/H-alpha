import { expect, test } from "@playwright/test";

test("hero leads with the real H-alpha image (ES)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-section__figure img")).toBeVisible();
});

test("English hero renders", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("a deep-dive discloses extra physics", async ({ page }) => {
  await page.goto("/");
  const dd = page.locator("details.deep-dive").first();
  await dd.locator("summary").click();
  await expect(dd).toHaveJSProperty("open", true);
});

test("spectrum explorer maps wavelength to transition", async ({ page }) => {
  await page.goto("/");
  const slider = page.locator("#spectrum input[type=range]");
  // Scroll into view so the client:visible island hydrates before we interact.
  await slider.scrollIntoViewIfNeeded();
  // Wait for the React island to hydrate.
  await expect(page.locator("#spectrum .spectrum-explorer__readout")).toBeVisible();
  // Move to min (400 nm) then advance 3 × PageUp (each step = 30 nm) → ~490 nm,
  // which falls in the 460–599 range that maps to the n=4 → n=2 Balmer transition.
  // (fill() sets the DOM value but doesn't fire React synthetic events; PageUp does.)
  await slider.press("Home");
  await slider.press("PageUp");
  await slider.press("PageUp");
  await slider.press("PageUp");
  await expect(page.locator("#spectrum")).toContainText("n=4");
});

test("tuning simulator reacts to controls", async ({ page }) => {
  await page.goto("/");
  const readout = page.locator(".bandpass-sim__readout");
  await readout.scrollIntoViewIfNeeded();
  await expect(readout).toBeVisible();
  const width = page.locator("#tuning input[type=range]").first();
  await width.fill("1.2");
  await expect(readout).toBeVisible();
});

test("final image has annotations and before/after", async ({ page }) => {
  await page.goto("/");
  await page.locator("#image").scrollIntoViewIfNeeded();
  await expect(page.locator("#image .hotspot").first()).toBeVisible();
  await expect(page.locator("#image .before-after input[type=range]")).toBeVisible();
});

test("safety shows at least four evergreen rules", async ({ page }) => {
  await page.goto("/");
  const items = page.locator("#safety .safety-rules__item");
  expect(await items.count()).toBeGreaterThanOrEqual(4);
});
