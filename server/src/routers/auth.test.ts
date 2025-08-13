import app from "..";

describe("Auth Router", () => {
  test("POST /auth/sign-up/email succeeds with correct payload", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        body: JSON.stringify({
          email: "new-user@example.com",
          name: "New User",
          password: "12345678",
          callbackURL: "http://localhost:3000/callback",
        }),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      },
    );
    const response = await app.request(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("token");
    expect(data).toHaveProperty("user");
  });
});
