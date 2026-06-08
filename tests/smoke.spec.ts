import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const staticBasePath = (process.env.PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const withStaticBasePath = (path: string) => `${staticBasePath}${path}`;

async function gotoHome(page: Page) {
  await page.goto(".");
}

test("hero leads with the real Hα image (ES)", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator(".hero-section__figure img")).toBeVisible();
});

test("English hero renders", async ({ page }) => {
  await page.goto("en/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("a deep-dive discloses extra physics", async ({ page }) => {
  await gotoHome(page);
  const dd = page.locator("details.deep-dive").first();
  await dd.locator("summary").click();
  await expect(dd).toHaveJSProperty("open", true);
  await expect(dd.locator(".katex").first()).toBeVisible();
});

test("etalon diagram names orders and the prefilter window", async ({ page }) => {
  await gotoHome(page);
  await page.locator("#etalon").scrollIntoViewIfNeeded();
  await expect(page.locator("#etalon")).toContainText("órdenes");
  await expect(page.locator("#etalon")).toContainText("Prefiltro");
});

test("spectrum explorer maps wavelength to transition", async ({ page }) => {
  await gotoHome(page);
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

test("tuning section keeps the diagram without the interactive simulator", async ({ page }) => {
  await gotoHome(page);
  await page.locator("#tuning").scrollIntoViewIfNeeded();
  await expect(page.locator("#tuning .diagram svg").first()).toBeVisible();
  await expect(page.locator("#tuning")).toContainText("Centro Hα");
  await expect(page.locator("#tuning")).toContainText("Ala azul");
  await expect(page.locator("#tuning")).toContainText("Ala roja");
  await expect(page.locator("#tuning")).toContainText("Gas que se acerca");
  await expect(page.locator("#tuning")).toContainText("Gas que se aleja");
  await expect(page.locator("#tuning .bandpass-sim")).toHaveCount(0);
  await expect(page.locator("#tuning input[type=range]")).toHaveCount(0);
});

test("filter comparison uses real images with attribution", async ({ page }) => {
  await gotoHome(page);
  await page.locator("#filters").scrollIntoViewIfNeeded();
  const image = page.locator("#filters .filter-comparison__photo img");
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("src", withStaticBasePath("/images/filter-eclipse-glasses.jpg"));
  await expect(page.locator("#filters .filter-comparison__photo figcaption")).toContainText(
    "Wikimedia Commons",
  );
});

test("final image has annotations", async ({ page }) => {
  await gotoHome(page);
  await page.locator("#image").scrollIntoViewIfNeeded();
  await expect(page.locator("#image .hotspot").first()).toBeVisible();
  await expect(
    page.locator("#image a[href='https://www.instagram.com/p/DY6jdP7jEMb/?img_index=1']"),
  ).toHaveClass(/sun-easter-egg/);
});

test("safety shows seven evergreen rules", async ({ page }) => {
  await gotoHome(page);
  const items = page.locator("#safety .safety-rules__item");
  await expect(items).toHaveCount(7);
});

test("sun layer leaders target named layers", async ({ page }) => {
  await gotoHome(page);
  await page.locator(".sun-layers").scrollIntoViewIfNeeded();
  await expect(page.locator(".sun-layers [data-layer='photosphere']")).toHaveCount(1);
  await expect(page.locator(".sun-layers [data-layer='chromosphere']")).toHaveCount(1);
  await expect(page.locator(".sun-layers [data-layer='corona']")).toHaveCount(1);
});

test("footer uses icon-only social profile links", async ({ page }) => {
  await gotoHome(page);
  const github = page.locator(".site-footer__links a[href='https://github.com/Vasallo94']");
  const linkedin = page.locator(".site-footer__links a[href='https://www.linkedin.com/in/enrique-vasallo/']");
  await expect(github).toHaveAttribute("aria-label", "GitHub");
  await expect(linkedin).toHaveAttribute("aria-label", "LinkedIn");
  await expect(github.locator("svg")).toBeVisible();
  await expect(linkedin.locator("svg")).toBeVisible();
  await expect(page.locator(".site-footer__inner p")).toHaveCount(0);
});
