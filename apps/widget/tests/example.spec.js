import test, { expect } from "@playwright/test";

const widgetURL = process.env.WIDGET_BASE_URL;

test("widget page with error caption", async ({ page }) => {
  await page.goto(widgetURL);

  await expect(page).toHaveTitle(/Donum widget/);

  const bodyTag = page.locator("body");

  await expect(bodyTag).toHaveCSS("background-color", "rgb(0, 255, 0)");

  const mainTag = page.locator("#widget");

  await expect(mainTag).toContainText("Error: ");
  await expect(mainTag).toContainText(
    "No address was provided in search params"
  );
});
