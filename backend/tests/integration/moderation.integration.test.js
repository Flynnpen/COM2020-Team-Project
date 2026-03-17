import request from "supertest";
import { jest } from "@jest/globals";

const supabaseAdmin = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => ({
          limit: jest.fn(),
        })),
        single: jest.fn(),
      })),
    })),
  })),
};

jest.unstable_mockModule("../../src/lib/supabaseClient.js", () => ({
  supabaseAdmin,
  supabaseUser: {},
}));

const { default: app } = await import("../../src/app.js");

describe("Moderation integration tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /moderation/queue returns 403 for non-moderator users", async () => {
    const res = await request(app).get("/moderation/queue");

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      error: 'Forbidden. Set header "x-user-role: moderator" for dev.',
    });
  });

  test("POST /moderation/submissions/:submissionId/decision returns 400 when moderator id is missing", async () => {
    const res = await request(app)
      .post("/moderation/submissions/sub-1/decision")
      .set("x-user-role", "moderator")
      .send({ decision: "approve" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Missing moderator id (user header "x-user-id")',
    });
  });

  test("POST /moderation/submissions/:submissionId/decision returns 400 for invalid decision", async () => {
    const res = await request(app)
      .post("/moderation/submissions/sub-1/decision")
      .set("x-user-role", "moderator")
      .set("x-user-id", "demo")
      .send({ decision: "maybe" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'decision must be "approve" or "reject"',
    });
  });
});