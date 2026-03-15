const CAR_EMISSION_FACTOR = 0.171; 
const FOOD_EMISSION_FACTOR = 2.5; 
const ENERGY_EMISSION_FACTOR = 0.233; 

const UNCERTAINTY_FACTORS = {
  TRAVEL: 0.10,
  ENERGY: 0.15,
  FOOD: 0.35,
}

function calculateCarbon(category, amountString) {
  const amount = parseFloat(amountString);

  if (isNaN(amount) || amount <= 0) {
    return { error: "Amount must be a positive number" };
  }

  // Travel
  if (category === "Travel") {
    const estimate = amount * CAR_EMISSION_FACTOR;

    return buildResult(
      estimate,
      "Average car travel",
      CAR_EMISSION_FACTOR,
      "kg CO2e per km",
      "Estimate assumes car travel avoided",
      UNCERTAINTY_FACTORS.TRAVEL
    );
  }

  // Food
  if (category === "Food") {
    const estimate = amount * FOOD_EMISSION_FACTOR;

    return buildResult(
      estimate,
      "Average meal emissions",
      FOOD_EMISSION_FACTOR,
      "kg CO2e per meal",
      "Estimate varies widely by diet and food source",
      UNCERTAINTY_FACTORS.FOOD
    );
  }

  // Energy
  if (category === "Energy") {
    const estimate = amount * ENERGY_EMISSION_FACTOR;

    return buildResult(
      estimate,
      "UK electricity average",
      ENERGY_EMISSION_FACTOR,
      "kg CO2e per kWh",
      "Estimate depends on energy mix and time of use",
      UNCERTAINTY_FACTORS.ENERGY
    );
  }

  return { error: "Category not supported yet" };
}

function buildResult(estimate, factorName, factorValue, unit, caveatText, uncertainty) {

  const min = estimate * (1 - uncertainty);
  const max = estimate * (1 + uncertainty);

  let confidence;
  if(uncertainty <= 0.10) confidence = "High";
  else if(uncertainty <= 0.20) confidence = "Medium";
  else confidence = "Low";

  return {
    estimateKgCO2e: Number(estimate.toFixed(3)),
    rangeKgCO2e: {
      min: Number(min.toFixed(3)),
      max: Number(max.toFixed(3))
    },
    uncertaintyPercent: Number((uncertainty * 100).toFixed(1)),

    factor: {
      name: factorName,
      value: factorValue,
      unit: unit
    },

    confidence: confidence,
    caveat:
      caveatText +
      "This is a simplified estimate using average values"
  };
}

module.exports = { calculateCarbon };