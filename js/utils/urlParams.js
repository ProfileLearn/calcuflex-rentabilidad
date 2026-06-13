function shouldPersistValue(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return false;
  }

  return parsed !== 0;
}

function toDisplayNumber(value) {
  return String(value).replace('.', ',');
}

export function setUrlParams(params) {
  const url = new URL(window.location.href);

  for (const [key, value] of Object.entries(params)) {
    if (shouldPersistValue(value)) {
      url.searchParams.set(key, String(value));
    } else {
      url.searchParams.delete(key);
    }
  }

  window.history.replaceState({}, '', url);
}

export function clearUrlParams() {
  window.history.replaceState({}, '', window.location.pathname);
}

export function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};

  for (const key of params.keys()) {
    const value = params.get(key);

    if (shouldPersistValue(value)) {
      result[key] = toDisplayNumber(value);
    }
  }

  return result;
}
