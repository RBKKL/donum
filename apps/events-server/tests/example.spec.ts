import test, { expect } from "@playwright/test";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const eventsServerURL = process.env.EVENTS_SERVER_URL!;

test("events-server page with errors", async ({ page }) => {
  await page.goto(eventsServerURL);

  const bodyTag = page.locator("body");

  await expect(bodyTag).toContainText(
    `{"message":"Route GET:/ not found","error":"Not Found","statusCode":404}`
  );
});
