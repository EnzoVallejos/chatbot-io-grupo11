import { Request, Response } from "express";

const guiaAsignacionTexto = `Variables de decision:
   * ¿Qué recurso debe asignarse?
   * ¿A qué tarea, actividad o proyecto se asignará?
   * ¿Cuántos recursos deben destinarse?
   * ¿Quién realizará cada tarea?
   * ¿Qué máquinas trabajarán en qué procesos?
   * ¿Qué cantidad de tiempo o presupuesto se asignará?
   * ¿Puede asignarse a varias tareas?
   * ¿Cada tarea requiere uno o varios recursos?
   * ¿La asignación es total o parcial?

* Restricciones de disponibilidad de recursos:
   * ¿Cuántos recursos están disponibles?
   * ¿Cada recurso puede realizar varias tareas o solo una?
   * ¿Existe un límite de tiempo o capacidad?
   * ¿Qué recursos son limitados?

* Restricciones de cumplimiento de tareas:
   * ¿Todas las tareas deben realizarse?
   * ¿Cada tarea necesita exactamente un recurso?
   * ¿Puede quedar una tarea sin asignar?
   * ¿Algunas tareas requieren varios recursos?

* Restricciones de capacidad:
   * ¿Existe un presupuesto máximo?
   * ¿Cuántas horas puede trabajar cada recurso?
   * ¿Cuál es la capacidad máxima de cada máquina?
   * ¿Hay límites de materiales o energía?

* Restricciones lógicas:
   * ¿Todos los recursos pueden realizar todas las tareas?
   * ¿Existen tareas incompatibles?
   * ¿Hay recursos especializados?
   * ¿Algunas asignaciones están prohibidas?

* Funcion objetivo:
   * ¿Qué se desea minimizar o maximizar?
   * ¿Se busca minimizar costos?
   * ¿Se quiere minimizar el tiempo total?
   * ¿Se desea maximizar la productividad?
   * ¿Se quiere maximizar ganancias o eficiencia?
   * ¿Cuál es el beneficio o costo de cada asignación?
   * ¿Existen prioridades entre tareas?`;

export const getGuiaAsignacion = (_req: Request, res: Response): void => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(guiaAsignacionTexto);
};
