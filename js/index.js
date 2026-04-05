import { calculateResults } from './calc/calculator.js';
import {
  primaryInputs,
  secondaryElements,
  resultElements,
  requiredFields,
  sectionElements
} from './dom/selectors.js';
import { clearFields, renderResults, setFieldValues, toggleRows } from './dom/ui.js';
import { parseFormValues } from './utils/formatters.js';
import {
  getFieldValues,
  tooltipHandler,
  showCalculationDetails,
  inputHandler
} from './utils/eventsHandlers.js';
import { clearUrlParams, getUrlParams, setUrlParams } from './utils/urlParams.js';

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

function calculateAndRender() {
  const rawValues = getFieldValues(primaryInputs);
  const formValues = parseFormValues(rawValues);
  const results = calculateResults(formValues);

  renderResults(resultElements, results);
  lastCalculationDetails = results.details;
  setUrlParams(formValues);
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

  secondaryElements.viewMore.addEventListener('click', () => {
    showCalculationDetails(resultElements.resultado, lastCalculationDetails);
  });

  secondaryElements.calculate.addEventListener('click', calculateAndRender);
  secondaryElements.clear.addEventListener('click', resetApplication);
}

bindEvents();
hydrateFromUrl();
