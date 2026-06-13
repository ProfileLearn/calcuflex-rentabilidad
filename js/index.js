import { calculateResults } from './calc/calculator.js';
import {
  primaryInputs,
  secondaryElements,
  resultElements,
  requiredFields,
  sectionElements
} from './dom/selectors.js';
import { clearFields, renderResults, setFieldValues, toggleRows } from './dom/ui.js';
import { parseFormValues, sanitizePercentageInput } from './utils/formatters.js';
import {
  getFieldValues,
  tooltipHandler,
  showCalculationDetails,
  inputHandler
} from './utils/eventsHandlers.js';
import { clearUrlParams, getUrlParams, setUrlParams } from './utils/urlParams.js';
import { fetchEstimatedInflation } from './utils/inflationApi.js';


let lastCalculationDetails = null;

function canAutoCalculate() {
  return requiredFields.every((fieldName) => primaryInputs[fieldName].value.trim() !== '');
}

function updateAdvancedMode(isEnabled) {
  if (!isEnabled) {
    primaryInputs.inflacion.value = '';
  }

  toggleRows(
    [
      sectionElements.inflationRow,
      sectionElements.resultCycleRow,
      sectionElements.viewMoreRow
    ],
    isEnabled
  );
}

async function calculateAndRender() {
  const rawValues = getFieldValues(primaryInputs);
  const formValues = parseFormValues(rawValues);
  const hasManualInflation = rawValues.inflacion.trim() !== '';

  const results = calculateResults(formValues);

  renderResults(resultElements, results);
  lastCalculationDetails = results.details;

  const urlValues = { ...formValues };
  if (!secondaryElements.advanceOptions.checked || !hasManualInflation) {
    delete urlValues.inflacion;
  }

  setUrlParams(urlValues);
}

async function projectInflationAndRender() {
  if (!canAutoCalculate()) {
    window.alert('Completa TNA, Monto Inicial, Plazo y Ciclos antes de proyectar inflación');
    return;
  }

  secondaryElements.projectInflation.disabled = true;
  const originalText = secondaryElements.projectInflation.textContent;
  secondaryElements.projectInflation.textContent = 'Proyectando';

  try {
    const rawValues = getFieldValues(primaryInputs);
    const formValues = parseFormValues(rawValues);
    const estimatedInflation = await fetchEstimatedInflation(formValues.ciclos, formValues.plazo);
    primaryInputs.inflacion.value = sanitizePercentageInput(String(estimatedInflation.toFixed(2)));
    await calculateAndRender();
  } finally {
    secondaryElements.projectInflation.disabled = false;
    secondaryElements.projectInflation.textContent = originalText;
  }
}

function resetApplication() {
  clearFields(primaryInputs);
  clearFields(resultElements);
  secondaryElements.advanceOptions.checked = false;
  updateAdvancedMode(false);
  lastCalculationDetails = null;
  clearUrlParams();
}

function hydrateFromUrl() {
  const params = getUrlParams();
  setFieldValues(primaryInputs, params);

  const advancedModeEnabled = Boolean(params.inflacion);
  secondaryElements.advanceOptions.checked = advancedModeEnabled;
  updateAdvancedMode(advancedModeEnabled);

  if (canAutoCalculate()) {
    calculateAndRender();
  }
}

function bindEvents() {
  secondaryElements.appForm.addEventListener('input', inputHandler);
  secondaryElements.appForm.addEventListener('click', tooltipHandler);

  secondaryElements.advanceOptions.addEventListener('change', (event) => {
    updateAdvancedMode(event.target.checked);

    if (canAutoCalculate()) {
      calculateAndRender();
    }
  });

  secondaryElements.projectInflation.addEventListener('click', projectInflationAndRender);

  secondaryElements.viewMore.addEventListener('click', () => {
    showCalculationDetails(resultElements.resultado, lastCalculationDetails);
  });

  secondaryElements.calculate.addEventListener('click', calculateAndRender);
  secondaryElements.clear.addEventListener('click', resetApplication);
}

bindEvents();
hydrateFromUrl();
