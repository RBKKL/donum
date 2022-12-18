import test, { expect } from "@playwright/test";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const homepageURL = process.env.WEBAPP_BASE_URL!;

test("homepage has title and link to homepage", async ({ page }) => {
  await page.goto(homepageURL); //TODO: Подключить турбо для использования env переменных

  await expect(page).toHaveTitle(/Donum/);

  const linkToHomePage = page.getByRole("link", { name: "Donum" });

  await expect(linkToHomePage).toHaveAttribute("href", "/");

  await linkToHomePage.click();

  await expect(page).toHaveURL(homepageURL);
});
