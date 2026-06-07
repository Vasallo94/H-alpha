import { describe, expect, it } from "vitest";
import { withBasePath } from "./basePath";

describe("withBasePath", () => {
  it("prefixes root-relative public assets with the configured base path", () => {
    expect(withBasePath("/images/sun-h-alpha.png", "/H-alpha/")).toBe("/H-alpha/images/sun-h-alpha.png");
  });

  it("keeps external and hash links unchanged", () => {
    expect(withBasePath("https://example.com/image.jpg", "/H-alpha/")).toBe("https://example.com/image.jpg");
    expect(withBasePath("#tuning", "/H-alpha/")).toBe("#tuning");
  });

  it("leaves paths root-relative when the base path is root", () => {
    expect(withBasePath("/images/sun-h-alpha.png", "/")).toBe("/images/sun-h-alpha.png");
  });
});
