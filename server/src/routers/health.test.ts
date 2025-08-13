import { describe, it, expect } from "vitest";
import { healthRouter } from "./health";

describe("Health Router", () => {
  it("GET /health", async () => {
    const res = await healthRouter.request("/");

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");
  });
});
