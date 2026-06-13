import { tooltipsObject } from '../assets/tooltipsObject.js'
import {
  dotFormat,
  sanitizeNumericInput,
  sanitizeDecimalInput,
  sanitizePercentageInput
} from './formatters.js';

const decimalFieldIds = new Set(['inicialIn', 'adicionalIn']);
const percentageFieldIds = new Set(['tnaIn', 'inflacionIn']);

export function getFieldValues(fields) {
  const values = {};

  for (const [fieldName, element] of Object.entries(fields)) {
    values[fieldName] = element.value;
  }

  return values;
}

export function tooltipHandler(event) {
  if (!(event.target instanceof Element)) return;

  const tooltipButton = event.target.closest('[data-tooltip]');
  if (!tooltipButton) return;

  const key = tooltipButton.dataset.tooltip;
  if (key && tooltipsObject[key]) {
    window.alert(tooltipsObject[key]);
  }
}

export function showCalculationDetails(resultElement, calculationDetails) {
  if (!resultElement.value || !calculationDetails) {
    window.alert('Debes hacer un cálculo primero');
    return;
  }

  const { tea, tet, rendimiento, capitalInvertido, ciclos, plazo } = calculationDetails;
  window.alert(
    `Tasa Efectiva Anual: ${tea.toFixed(2)} %\n` +
    `Tasa Efectiva Total x ${ciclos} ciclos de ${plazo} días: ${tet.toFixed(2)} %\n` +
    `Capital invertido: ${dotFormat(capitalInvertido.toFixed(2))}\n` +
    `Rendimiento Ajustado: ${rendimiento.toFixed(2)} %`
  );
}

export function inputHandler(event) {
  if (!(event.target instanceof HTMLInputElement)) return;

  const { id, value } = event.target;
  let formattedValue = sanitizeNumericInput(value);

  if (decimalFieldIds.has(id)) {
    formattedValue = sanitizeDecimalInput(formattedValue);
  } else if (percentageFieldIds.has(id)) {
    formattedValue = sanitizePercentageInput(formattedValue);
  } else {
    formattedValue = formattedValue.replace(/\D/g, '');
  }

  event.target.value = formattedValue;
}
