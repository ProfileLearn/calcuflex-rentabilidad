import { interes, teayt, rendimiento, numAjustado, totalInvertido } from '../utils/calcMethods.js';

export function calculateResults(formNumValues) {
  const { tna, plazo, ciclos, inflacion } = formNumValues;
  const tasasEfectivas = teayt(tna, plazo, ciclos);
  const capitalInvertido = totalInvertido(formNumValues);
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
    neto: retorno - capitalInvertido,
    resultadoCiclo: retornoPosterior - retorno,
    details: {
      tea: tasasEfectivas.tea,
      tet: tasasEfectivas.tet,
      rendimiento: rendimiento(inflacion, tasasEfectivas.tet),
      capitalInvertido,
      ciclos,
      plazo
    }
  };
}
