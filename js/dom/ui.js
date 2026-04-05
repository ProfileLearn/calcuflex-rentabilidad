import { dotFormat } from '../utils/formatters.js';

const HIDDEN_CLASS = 'oculto';

export function render(element, value = '') {
  if (!element) return;
  element.value = value;
}

export function renderResults(resultElements, results) {
  render(resultElements.resultado, dotFormat(results.retorno.toFixed(2)));
  render(resultElements.resultadoNeto, dotFormat(results.neto.toFixed(2)));
  render(resultElements.resultadoCiclo, dotFormat(results.resultadoCiclo.toFixed(2)));
}

export function setFieldValues(fields, values) {
  for (const [key, element] of Object.entries(fields)) {
    render(element, values[key] ?? '');
  }
}

export function clearFields(fields) {
  for (const element of Object.values(fields)) {
    render(element, '');
  }
}

export function toggleRows(rows, visible) {
  rows
    .filter(Boolean)
    .forEach((row) => row.classList.toggle(HIDDEN_CLASS, !visible));
}
