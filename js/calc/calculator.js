import { interes, teayt, rendimiento, numAjustado } from '../utils/calcMethods.js';

export function calculateResults(formNumValues) {
  const { tna, plazo, ciclos, inflacion, montoInicial } = formNumValues;
  const tasasEfectivas = teayt(tna, plazo, ciclos);
  const retornoBruto = interes(formNumValues);
  const retorno = numAjustado(inflacion, retornoBruto);
  const retornoPosterior = interes({
    montoInicial: retorno,
    tna,
    plazo,
    ciclos: 1,
    adicional: 0
  });

  return {
    retorno,
    neto: retorno - montoInicial,
    resultadoCiclo: retornoPosterior - retorno,
    details: {
      tea: tasasEfectivas.tea,
      tet: tasasEfectivas.tet,
      rendimiento: rendimiento(inflacion, tasasEfectivas.tet),
      ciclos,
      plazo
    }
  };
}
