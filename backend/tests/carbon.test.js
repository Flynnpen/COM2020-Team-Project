import { calculateCarbonFromFactor } from "../src/services/carbon.service.js";

describe("carbon.service unit tests", () => {
  test("calculateCarbonFromFactor returns correct estimate and confidence for valid input", () => {
    const factorRow = {
      factor_id: "f1",
      source: "DEFRA",
      value: 0.5,
      unit_in: "km",
      unit_out: "kg CO2e",
      uncertainty: 0.1,
      notes: "Average car travel.",
    };

    const result = calculateCarbonFromFactor(10, factorRow);

    expect(result).toEqual({
      estimateKgCO2e: 5,
      rangeKgCO2e: {
        min: 4.5,
        max: 5.5,
      },
      factor: {
        id: "f1",
        source: "DEFRA",
        value: 0.5,
        unit_in: "km",
        unit_out: "kg CO2e",
        uncertainty: 0.1,
        notes: "Average car travel.",
      },
      confidence: "High",
      caveat: "Average car travel. This is a simplified estimate using average values.",
    });
  });

  test("calculateCarbonFromFactor returns error for invalid quantity", () => {
    const factorRow = {
      factor_id: "f1",
      source: "DEFRA",
      value: 0.5,
      unit_in: "km",
      unit_out: "kg CO2e",
      uncertainty: 0.1,
      notes: "Average car travel.",
    };

    const result = calculateCarbonFromFactor("abc", factorRow);

    expect(result).toEqual({
      error: "Quantity must be a positive number",
    });
  });

  test("calculateCarbonFromFactor returns error for invalid factor value", () => {
    const factorRow = {
      factor_id: "f1",
      source: "DEFRA",
      value: "not-a-number",
      unit_in: "km",
      unit_out: "kg CO2e",
      uncertainty: 0.1,
      notes: "Average car travel.",
    };

    const result = calculateCarbonFromFactor(10, factorRow);

    expect(result).toEqual({
      error: "Factor value is invalid",
    });
  });
});