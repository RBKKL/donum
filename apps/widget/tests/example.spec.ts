import test, { expect } from "@playwright/test";

test("widget: error when no address in search params", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Donum widget");

  const bodyTag = page.locator("body");

  await expect(bodyTag).toHaveCSS("background-color", "rgb(0, 255, 0)");

  const mainTag = page.locator("#widget");

  await expect(mainTag).toContainText("Error: ");
  await expect(mainTag).toContainText(
    "No address was provided in search params"
  );
});
