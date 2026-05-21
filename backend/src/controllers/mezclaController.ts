import { Request, Response } from "express";

const guiaMezclaTexto = `Variables de decision:
   * ¿Qué materiales o ingredientes se mezclarán?
   * ¿Cuánto de cada componente debe utilizarse?
   * ¿Qué proporción tendrá cada ingrediente?
   * ¿Cuáles son las materias primas disponibles?
   * ¿Cuánto producto final debe obtenerse?
   * ¿Existen diferentes tipos de mezclas?
   * ¿La mezcla se realiza en uno o varios procesos?
   * ¿Qué componentes son opcionales u obligatorios?

* Restricciones de disponibilidad:
   * ¿Cuánto hay disponible de cada ingrediente?
   * ¿Existen límites máximos de uso?
   * ¿Algunos materiales son escasos?

* Restricciones de compatibilidad:
   * ¿Qué porcentaje mínimo o máximo debe tener cada componente?
   * ¿Qué propiedades debe cumplir la mezcla?
   * ¿Existen estándares de calidad?

* Restricciones de demanda:
   * ¿Cuánto producto final debe producirse?
   * ¿Existe una cantidad mínima requerida?
   * ¿La mezcla debe sumar exactamente una cantidad total?

* Restricciones calidad:
   * ¿Cuál debe ser el nivel mínimo de pureza?
   * ¿Qué concentración máxima se permite?
   * ¿Existen límites nutricionales, químicos o técnicos?

* Funcion objetivo:
   * ¿Se quiere minimizar el costo de la mezcla?
   * ¿Se busca maximizar ganancias?
   * ¿Se desea maximizar calidad o rendimiento?
   * ¿Cuál es el costo de cada ingrediente?
   * ¿Qué componente aporta mayor beneficio?
   * ¿Cuál es la combinación más eficiente?`;

export const getGuiaMezcla = (_req: Request, res: Response): void => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(guiaMezclaTexto);
};
