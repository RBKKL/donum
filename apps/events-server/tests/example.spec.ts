import test, { expect } from "@playwright/test";

test("events-server page with errors", async ({ page }) => {
  await page.goto("http://localhost:8000");

  const bodyTag = page.locator("body");

  await expect(bodyTag).toContainText(
    `{"message":"Route GET:/ not found","error":"Not Found","statusCode":404}`
  );
});
