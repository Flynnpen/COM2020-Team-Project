import { calculatePoints } from "../src/services/scoring.service.js";

describe("scoring.service unit tests", () => {
  test("calculatePoints uses points_per_kg when provided", () => {
    const result = calculatePoints(2.4, { points_per_kg: 5 });

    expect(result).toBe(12);
  });

  test("calculatePoints uses default value 10 when points_per_kg is missing", () => {
    const result = calculatePoints(2.4, {});

    expect(result).toBe(24);
  });

  test("calculatePoints rounds the final result", () => {
    const result = calculatePoints(2.56, { points_per_kg: 3 });

    expect(result).toBe(8);
  });
});