const DAYS_PER_YEAR = 365;

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toPositiveInteger(value, fallback = 1) {
  const number = Math.trunc(toFiniteNumber(value, fallback));
  return number > 0 ? number : fallback;
}

export function tasaPorCiclo(tna, plazo) {
  const annualNominalRate = toFiniteNumber(tna) / 100;
  const days = toFiniteNumber(plazo);

  if (annualNominalRate <= 0 || days <= 0) {
    return 0;
  }

  return annualNominalRate * (days / DAYS_PER_YEAR);
}

export function interes({ montoInicial, tna, plazo, ciclos, adicional }) {
  const totalCycles = toPositiveInteger(ciclos);
  const cycleRate = tasaPorCiclo(tna, plazo);
  const cycleContribution = Math.max(toFiniteNumber(adicional), 0);
  let total = Math.max(toFiniteNumber(montoInicial), 0);

  for (let cycle = 0; cycle < totalCycles; cycle += 1) {
    const additionalThisCycle = cycle === 0 ? 0 : cycleContribution;
    total = (total + additionalThisCycle) * (1 + cycleRate);
  }

  return total;
}

export function totalInvertido({ montoInicial, ciclos, adicional }) {
  const totalCycles = toPositiveInteger(ciclos);
  const initialAmount = Math.max(toFiniteNumber(montoInicial), 0);
  const cycleContribution = Math.max(toFiniteNumber(adicional), 0);

  return initialAmount + (cycleContribution * Math.max(totalCycles - 1, 0));
}

export function teayt(tna, plazo, ciclos) {
  const cycleRate = tasaPorCiclo(tna, plazo);
  const days = toFiniteNumber(plazo);
  const totalCycles = toPositiveInteger(ciclos);

  if (cycleRate === 0 || days <= 0) {
    return { tea: 0, tet: 0 };
  }

  const periodsPerYear = DAYS_PER_YEAR / days;
  const tea = 100 * (Math.pow(1 + cycleRate, periodsPerYear) - 1);
  const tet = 100 * (Math.pow(1 + cycleRate, totalCycles) - 1);

  return { tea, tet };
}

export function rendimiento(ita, tet) {
  const inflationRate = ita / 100;
  const totalEffectiveRate = tet / 100;

  return (((1 + totalEffectiveRate) / (1 + inflationRate)) - 1) * 100;
}

export function numAjustado(ita = 0, num) {
  const inflationRate = Math.max(toFiniteNumber(ita), -99.999999) / 100;
  return toFiniteNumber(num) / (1 + inflationRate);
}

export function geometricMeanPercent(rates = []) {
  if (!Array.isArray(rates) || rates.length === 0) return 0;
  const validRates = rates.map((rate) => toFiniteNumber(rate, NaN)).filter(Number.isFinite);
  if (validRates.length === 0) return 0;

  const product = validRates.reduce((p, rate) => p * (1 + (rate / 100)), 1);
  const gm = Math.pow(product, 1 / validRates.length) - 1;
  return gm * 100;
}

export function projectInflationPercent(rates = [], cycles = 1) {
  const cycleCount = toFiniteNumber(cycles) > 0 ? toFiniteNumber(cycles) : 1;
  const avgPercent = geometricMeanPercent(rates) / 100;
  const accumulated = Math.pow(1 + avgPercent, cycleCount) - 1;
  return accumulated * 100;
}
