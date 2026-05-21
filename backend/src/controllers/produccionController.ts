import { Request, Response } from "express";

const guiaProduccionTexto = `Variables de decision:
   * ¿Qué productos deben fabricarse?
   * ¿Cuántas unidades de cada producto se producirán?
   * ¿Qué recursos se utilizarán?
   * ¿Qué cantidad de materia prima se necesita?
   * ¿Cuántas horas de trabajo o máquina se emplearán?
   * ¿Qué líneas de producción participarán?
   * ¿La producción se realiza en uno o varios períodos?
   * ¿Existen distintos niveles de producción?
   * ¿Se producirán todos los productos o solo algunos?

* Restricciones de materia prima:
   * ¿Cuánta materia prima está disponible?
   * ¿Cuánto material requiere cada producto?
   * ¿Existen insumos limitados?

* Restricciones de mano de obra:
   * ¿Cuántas horas de trabajo hay disponibles?
   * ¿Cuántas horas requiere producir cada unidad?
   * ¿Existen turnos o límites laborales?

* Restricciones de capacidad de máquinas:
   * ¿Cuántas horas pueden operar las máquinas?
   * ¿Existe capacidad máxima de producción?
   * ¿Hay cuellos de botella?

* Restricciones de demanda:
   * ¿Cuál es la demanda máxima del mercado?
   * ¿Existe una producción mínima requerida?
   * ¿Se deben satisfacer pedidos específicos?

* Restricciones de almacenamiento:
   * ¿Existe espacio limitado para almacenar productos?
   * ¿Hay costos o límites de inventario?

* Funcion objetivo:
   * ¿Se quiere maximizar ganancias?
   * ¿Se desea minimizar costos de producción?
   * ¿Se busca maximizar la productividad?
   * ¿Cuál es la utilidad de cada producto?
   * ¿Qué costos genera fabricar cada unidad?
   * ¿Qué combinación de productos es más rentable?`;

export const getGuiaProduccion = (_req: Request, res: Response): void => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(guiaProduccionTexto);
};
