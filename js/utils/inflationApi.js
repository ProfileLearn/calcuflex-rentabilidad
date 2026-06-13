import { projectInflationPercent } from './calcMethods.js';

const API_URL = 'https://api.argentinadatos.com/v1/finanzas/indices/inflacion';
const DEFAULT_ESTIMATED_INFLATION = 0;

export async function fetchEstimatedInflation(cycles = 1, plazoDays = 30, k = 6) {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API status ${res.status}`);
    const data = await res.json(); // espera un array de { fecha, valor }

    if (!Array.isArray(data) || data.length === 0) return DEFAULT_ESTIMATED_INFLATION;

    const cycleMonths = Number.isFinite(plazoDays) && plazoDays > 0 ? plazoDays / 30 : 1;
    const totalMonths = Math.max(0, Number(cycles)) * cycleMonths;
    if (totalMonths <= 0) return DEFAULT_ESTIMATED_INFLATION;

    // Asegura orden cronológico ascendente por fecha, toma últimos k elementos
    const sorted = data.slice().sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const lastK = sorted.slice(-Math.max(1, k));
    const rates = lastK.map((item) => Number(item.valor)).filter((v) => Number.isFinite(v));

    if (rates.length === 0) return DEFAULT_ESTIMATED_INFLATION;

    // projectInflationPercent espera array de % y devuelve % acumulado para totalMonths
    return projectInflationPercent(rates, totalMonths);
  } catch (err) {
    console.error('fetchEstimatedInflation error:', err);
    return DEFAULT_ESTIMATED_INFLATION;
  }
}
