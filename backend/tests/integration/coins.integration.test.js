import request from "supertest";
import { jest } from "@jest/globals";

const mockSingle = jest.fn();
const mockRange = jest.fn();

const mockUsersSelectChain = {
  eq: jest.fn(() => ({
    single: mockSingle,
  })),
};

const mockCoinTransactionsSelectChain = {
  eq: jest.fn(() => ({
    order: jest.fn(() => ({
      range: mockRange,
    })),
  })),
};

const supabaseUser = {
  from: jest.fn((table) => {
    if (table === "users") {
      return {
        select: jest.fn(() => mockUsersSelectChain),
      };
    }

    if (table === "coin_transactions") {
      return {
        select: jest.fn(() => mockCoinTransactionsSelectChain),
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  }),
};

const supabaseAdmin = {};

jest.unstable_mockModule("../../src/lib/supabaseClient.js", () => ({
  supabaseUser,
  supabaseAdmin,
}));

const { default: app } = await import("../../src/app.js");

describe("Coins integration tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /coins returns 400 when x-user-id header is missing", async () => {
    const res = await request(app).get("/coins");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Missing user id. Pass header "x-user-id"',
    });
  });

  test("GET /coins/history returns 400 when x-user-id header is missing", async () => {
    const res = await request(app).get("/coins/history");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Missing user id. Pass header "x-user-id"',
    });
  });
});