import { Request, Response } from "express";

const guiaTransporteTexto = `Variables de decision:

* ¿Qué se debe decidir exactamente?
* ¿Cuánto producto se enviará?
* ¿Desde qué origen hacia qué destino?
* ¿Qué rutas están disponibles?
* ¿Qué cantidad puede transportarse por cada ruta?
* ¿Qué medios de transporte intervienen?
* ¿La decisión se toma por unidades, toneladas, cajas, litros, etc.?
* ¿Existen diferentes productos o solo uno?
* ¿La distribución ocurre en un solo período o en varios?

* Restricciones de oferta:
   * ¿Cuánto puede ofrecer cada origen?
   * ¿Existe una capacidad máxima de producción o despacho?
   * ¿Se debe utilizar toda la oferta disponible?

* Restricciones de demanda:
   * ¿Cuánto necesita cada destino?
   * ¿La demanda debe satisfacerse completamente?
   * ¿Se permiten faltantes?

* Restricciones de capacidad o rutas:
   * ¿Todas las rutas pueden utilizarse?
   * ¿Existe un límite de transporte por ruta?
   * ¿Hay restricciones de vehículos o almacenamiento?
   * ¿Existen rutas prohibidas?

* Funcion objetivo:
   * ¿Qué se quiere minimizar o maximizar?
   * ¿Se busca minimizar costos?
   * ¿Se quiere minimizar tiempo o distancia?
   * ¿Se desea maximizar ganancias?
   * ¿Cuál es el costo de transportar una unidad por cada ruta?
   * ¿Existen penalizaciones o costos adicionales?`;

export const getGuiaTransporte = (_req: Request, res: Response): void => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(guiaTransporteTexto);
};
