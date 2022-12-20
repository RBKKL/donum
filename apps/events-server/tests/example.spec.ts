import test, { expect } from "@playwright/test";

test("events-server return unauthenticated on test donation", async ({
  request,
}) => {
  const res = await request.post("/test");
  expect(res.status()).toBe(403);
  expect(await res.text()).toContain("Wrong secret");
});
