const DAYS_PER_YEAR = 365;
const MONTHS_PER_YEAR = 12;

export function interes({ montoInicial, tna, plazo, ciclos, adicional }) {
  const dailyRate = (tna / DAYS_PER_YEAR) / 100;
  const totalCycles = Math.max(Number(ciclos), 1);
  const cycleContribution = Number(adicional);
  let total = Number(montoInicial);

  for (let cycle = 0; cycle < totalCycles; cycle += 1) {
    total = (total * ((dailyRate * plazo) + 1)) + cycleContribution;
  }

  return total;
}

export function teayt(tna, plazo, ciclos) {
  const tea = 100 * (Math.pow(1 + ((tna / 100) / MONTHS_PER_YEAR), MONTHS_PER_YEAR) - 1);

  if (!plazo || !ciclos) {
    return { tea, tet: 0 };
  }

  const tet = 100 * (Math.pow(1 + ((tna / 100) / (DAYS_PER_YEAR / plazo)), ciclos) - 1);

  return { tea, tet };
}

export function rendimiento(ita, tet) {
  const inflationRate = ita / 100;
  const totalEffectiveRate = tet / 100;

  return (((1 + totalEffectiveRate) / (1 + inflationRate)) - 1) * 100;
}

export function numAjustado(ita = 0, num) {
  return num / (1 + (ita / 100));
}
