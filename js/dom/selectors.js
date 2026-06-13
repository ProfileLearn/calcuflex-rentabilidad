function byId(id) {
  return document.getElementById(id);
}

function getRow(element) {
  return element?.closest('.row') ?? null;
}

export const primaryInputs = {
  tna: byId('tnaIn'),
  montoInicial: byId('inicialIn'),
  plazo: byId('plazoIn'),
  ciclos: byId('ciclosIn'),
  adicional: byId('adicionalIn'),
  inflacion: byId('inflacionIn')
};

export const secondaryElements = {
  appForm: document.getElementsByClassName('app')[0],
  advanceOptions: byId('advance-options'),
  projectInflation: byId('proyectar-inflacion'),
  viewMore: byId('ver-mas'),
  calculate: byId('calcular'),
  clear: byId('clear')
};

export const resultElements = {
  resultado: byId('resultadoIn'),
  resultadoNeto: byId('resultadoNeto'),
  resultadoCiclo: byId('resultadoCiclo')
};

export const sectionElements = {
  inflationRow: getRow(primaryInputs.inflacion),
  resultCycleRow: getRow(resultElements.resultadoCiclo),
  viewMoreRow: getRow(secondaryElements.viewMore)
};

export const requiredFields = ['tna', 'montoInicial', 'plazo', 'ciclos'];
