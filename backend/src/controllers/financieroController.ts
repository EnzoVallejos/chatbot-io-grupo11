import { Request, Response } from "express";

const guiaFinancieroTexto = `Variables de decision:
   * ¿Qué decisiones económicas deben tomarse?
   * ¿Cuánto dinero se invertirá?
   * ¿En qué proyectos, activos o cuentas se invertirá?
   * ¿Cuánto se pedirá prestado?
   * ¿Cómo se distribuirá el presupuesto?
   * ¿Qué porcentaje del capital se asignará a cada alternativa?
   * ¿Cuánto ahorrar o gastar en cada período?
   * ¿Qué instrumentos financieros están disponibles?
   * ¿Las decisiones son únicas o se repiten en el tiempo?

* Restricciones de presupuesto:
   * ¿Cuánto dinero total está disponible?
   * ¿Existe un capital máximo para invertir?
   * ¿Hay límites de gasto?

* Restricciones de rentabilidad mínima:
   * ¿Se requiere una ganancia mínima?
   * ¿Existe un rendimiento esperado obligatorio?
   * ¿Qué retorno debe alcanzarse?

* Restricciones de riesgo:
   * ¿Cuál es el nivel máximo de riesgo aceptable?
   * ¿Hay inversiones demasiado riesgosas?
   * ¿Debe diversificar el capital?

* Restricciones liquidez:
   * ¿Se necesita dinero disponible en ciertos períodos?
   * ¿Qué parte del capital debe permanecer líquida?
   * ¿Existen pagos futuros obligatorios?

* Restricciones legales:
   * ¿Existen límites regulatorios?
   * ¿Hay porcentajes máximos por inversión?
   * ¿Se deben respetar políticas internas?

* Funcion objetivo:
   * ¿Se quiere maximizar ganancias?
   * ¿Se busca minimizar costos financieros?
   * ¿Se desea minimizar el riesgo?
   * ¿Se quiere maximizar la rentabilidad?
   * ¿Cuál es el rendimiento esperado de cada inversión?
   * ¿Cuál es el costo de cada fuente de financiamiento?
   * ¿Qué combinación genera mayor beneficio?`;

export const getGuiaFinanciero = (_req: Request, res: Response): void => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(guiaFinancieroTexto);
};
