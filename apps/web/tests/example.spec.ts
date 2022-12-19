import test, { expect } from "@playwright/test";

test("homepage has title and link to homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Donum");

  const linkToHomePage = page.getByRole("link", { name: "Donum" });

  await expect(linkToHomePage).toHaveAttribute("href", "/");

  await linkToHomePage.click();

  await expect(page).toHaveURL("/");
});
