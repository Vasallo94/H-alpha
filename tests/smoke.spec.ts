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
  await expect(dd.locator(".katex").first()).toBeVisible();
});

test("spectrum explorer maps wavelength to transition", async ({ page }) => {
  await page.goto("/");
  const slider = page.locator("#spectrum input[type=range]");
  // Scroll into view so the client:visible island hydrates before we interact.
  await slider.scrollIntoViewIfNeeded();
  // Wait for the React island to hydrate.
  await expect(page.locator("#spectrum .spectrum-explorer__readout")).toBeVisible();
  await slider.evaluate((input) => {
    const range = input as HTMLInputElement;
    range.value = "486";
    range.dispatchEvent(new Event("input", { bubbles: true }));
    range.dispatchEvent(new Event("change", { bubbles: true }));
  });
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

test("filter comparison uses real images with attribution", async ({ page }) => {
  await page.goto("/");
  await page.locator("#filters").scrollIntoViewIfNeeded();
  const image = page.locator("#filters .filter-comparison__photo img");
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("src", "/images/filter-eclipse-glasses.jpg");
  await expect(page.locator("#filters .filter-comparison__photo figcaption")).toContainText(
    "Wikimedia Commons",
  );
});

test("final image has annotations", async ({ page }) => {
  await page.goto("/");
  await page.locator("#image").scrollIntoViewIfNeeded();
  await expect(page.locator("#image .hotspot").first()).toBeVisible();
});

test("safety shows seven evergreen rules", async ({ page }) => {
  await page.goto("/");
  const items = page.locator("#safety .safety-rules__item");
  await expect(items).toHaveCount(7);
});

test("tuning explains the single Doppler-shifted limb cue", async ({ page }) => {
  await page.goto("/");
  await page.locator("#tuning").scrollIntoViewIfNeeded();
  await expect(page.locator(".bandpass-sim__note")).toContainText("Doppler");
  await expect(page.locator(".bandpass-sim__preview")).toBeVisible();
});

test("footer links to Enrique's social profiles", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".site-footer__links a[href='https://github.com/enriquebook']")).toBeVisible();
  await expect(page.locator(".site-footer__links a[href='https://www.linkedin.com/in/enriquebook/']")).toBeVisible();
});
