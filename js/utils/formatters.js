export function dotFormat(text, dynamic = false) {
  const value = String(text ?? '');
  const clearText = dynamic ? value.replace(/\./g, '') : value.replace(/\./, ',');
  const regex = /\B(?=(\d{3})+(?!\d))/g;
  return clearText.replace(regex, '.');
}

export function parseNumber(text) {
  const normalizedText = String(text ?? '').replace(/\./g, '').replace(',', '.');
  const number = Number.parseFloat(normalizedText);
  return isNaN(number) ? 0 : number;
}

export function parseFormValues(stringObject) {
  const result = {};
  for (const prop in stringObject) {
    result[prop] = parseNumber(stringObject[prop]);
  }
  return result;
}

export function sanitizeNumericInput(text) {
  return text.replace(/[^\d,\.]/g, "").replace(/^[,\.]/, "0,");
}

export function sanitizeDecimalInput(text, maxDecimals = 2) {
  const cleanText = String(text ?? '').replace(/[^\d,\.]/g, '');
  const commaIndex = cleanText.lastIndexOf(',');
  const dotIndex = cleanText.lastIndexOf('.');
  const dotCount = (cleanText.match(/\./g) ?? []).length;
  const dotDecimalPart = cleanText.slice(dotIndex + 1).replace(/[,.]/g, '');
  const usesCommaDecimal = commaIndex !== -1;
  const usesDotDecimal = !usesCommaDecimal
    && dotCount === 1
    && dotIndex !== -1
    && (
      cleanText.endsWith('.')
      || (dotDecimalPart.length > 0 && dotDecimalPart.length <= maxDecimals)
    );

  const decimalSeparatorIndex = usesCommaDecimal ? commaIndex : dotIndex;
  const hasDecimalSeparator = usesCommaDecimal || usesDotDecimal;
  const hasTrailingSeparator = /[,\.]$/.test(cleanText);
  let entero = hasDecimalSeparator ? cleanText.slice(0, decimalSeparatorIndex) : cleanText;
  const decimalText = hasDecimalSeparator ? cleanText.slice(decimalSeparatorIndex + 1) : '';

  entero = dotFormat(entero, true);

  const decimal = decimalText.replace(/[,.]/g, "").slice(0, maxDecimals);

  if (hasTrailingSeparator && decimal.length === 0) {
    return `${entero},`;
  }

  if (!hasDecimalSeparator) {
    return entero;
  }

  return `${entero},${decimal}`;
}

export function sanitizePercentageInput(text) {
  const cleanText = String(text ?? '').replace(/[^\d,\.]/g, '');
  const commaIndex = cleanText.lastIndexOf(',');
  const dotIndex = cleanText.lastIndexOf('.');
  const dotCount = (cleanText.match(/\./g) ?? []).length;
  const dotDecimalPart = cleanText.slice(dotIndex + 1).replace(/[,.]/g, '');
  const usesCommaDecimal = commaIndex !== -1;
  const usesDotDecimal = !usesCommaDecimal
    && dotCount === 1
    && dotIndex !== -1
    && (
      cleanText.endsWith('.')
      || (dotDecimalPart.length > 0 && dotDecimalPart.length <= 2)
    );

  const decimalSeparatorIndex = usesCommaDecimal ? commaIndex : dotIndex;
  const hasDecimalSeparator = usesCommaDecimal || usesDotDecimal;
  const hasTrailingSeparator = /[,\.]$/.test(cleanText);
  const integerText = hasDecimalSeparator ? cleanText.slice(0, decimalSeparatorIndex) : cleanText;
  const decimalText = hasDecimalSeparator ? cleanText.slice(decimalSeparatorIndex + 1) : '';
  const integer = integerText.replace(/[,.]/g, '');
  const decimal = decimalText.replace(/[,.]/g, '').slice(0, 2);

  if (hasTrailingSeparator && decimal.length === 0) {
    return `${integer},`;
  }

  if (!hasDecimalSeparator) {
    return integer;
  }

  return `${integer},${decimal}`;
}
