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
  const hasDecimalSeparator = text.includes(",");
  const hasTrailingComma = text.endsWith(",");
  let [entero = "", ...decimalParts] = text.split(",");

  entero = dotFormat(entero, true);

  const decimal = decimalParts.join("").replace(/\./g, "").slice(0, maxDecimals);

  if (hasTrailingComma && decimal.length === 0) {
    return `${entero},`;
  }

  if (!hasDecimalSeparator) {
    return entero;
  }

  return `${entero},${decimal}`;
}

export function sanitizePercentageInput(text) {
  const cleanText = text.replace(/[^\d,\.]/g, "");
  const lastSeparatorIndex = Math.max(
    cleanText.lastIndexOf(","),
    cleanText.lastIndexOf(".")
  );

  if (lastSeparatorIndex === -1) {
    return dotFormat(cleanText, true);
  }

  const integerPart = cleanText.slice(0, lastSeparatorIndex).replace(/[,.]/g, "");
  const decimalPart = cleanText.slice(lastSeparatorIndex + 1).replace(/[,.]/g, "").slice(0, 2);
  const formattedIntegerPart = dotFormat(integerPart, true);

  if (/[,.]$/.test(cleanText) && decimalPart.length === 0) {
    return `${formattedIntegerPart},`;
  }

  return `${formattedIntegerPart},${decimalPart}`;
}
