import { Request, Response } from "express";

const ejemploTransporteTexto = `Escenario:
 Una empresa tiene dos fábricas F1 y F2 y tres depósitos D1, D2 y D3.
F1 puede enviar hasta 100 unidades.
F2 puede enviar hasta 150 unidades.
Demandas:
D1 necesita 80 unidades.
D2 necesita 70 unidades.
D3 necesita 60 unidades.
Costos de transporte por unidad:
     D1  D2  D3
F1    4   6   8
F2    5   3   7
Variables de decisión:
x11 = unidades enviadas de F1 a D1
 x12 = unidades enviadas de F1 a D2
 x13 = unidades enviadas de F1 a D3
 x21 = unidades enviadas de F2 a D1
 x22 = unidades enviadas de F2 a D2
 x23 = unidades enviadas de F2 a D3
Función objetivo:
Minimizar el costo total:
Z=4x11 + 6x12 + 8x13 + 5x21 + 3x22 + 7x23
Restricciones:
Oferta de fábricas:
X11 + x12 + x13 ≤ 100
 X21 + x22 +x23 ≤ 150
Demanda de depósitos:
X11 +x21 =80
X12 + x22 = 70
X13 + x23 = 60
No negatividad:
Xij ≥ 0`;

const ejemploAsignacionTexto = `Escenario:
 Una empresa debe asignar 3 empleados a 3 proyectos.
Costos de asignación:
     P1  P2  P3
E1    8   6   7
E2    5   7   4
E3    9   8   6
Variables de decisión:
xij = 1 si el empleado i realiza el proyecto j
 xij = 0 en otro caso
Función objetivo:
Minimizar el costo total:
Z = 8 x11 + 6x12 + 7x13 + 5x21 + 7x22 + 4x23 + 9x31 + 8x32 + 6x33
Restricciones:
Cada empleado realiza un solo proyecto:
X11 + x12 + x13 = 1 
X21 + x22 + x23 = 1
X31 + x32 + x33 = 1
Cada proyecto recibe un empleado:
X11 +x21 + x31 = 1
 X12 + x22+ x32 = 1
 X13 + x23 + x33 = 1
Variables binarias:
Xij ∈ {0,1}`;

const ejemploFinancieroTexto = `Escenario:
 Una empresa dispone de 100000 dólares para invertir en dos proyectos.
El Proyecto A genera 12% de rentabilidad.
Proyecto B genera 18% de rentabilidad.
Restricciones:
Como máximo 60000 dólares pueden invertirse en A.
Al menos 30000 dólares deben invertirse en B.
Variables de decisión:
x = dinero invertido en A
 y = dinero invertido en B
Función objetivo:
Maximizar la rentabilidad:
Z = 0.12x + 0.18y 
Restricciones:
X + y ≤ 100000
X ≤ 60000
Y ≥ 30000
X, y ≥ 0`;

const ejemploProduccionTexto = `Escenario:
 Una fábrica produce mesas y sillas.
Una mesa requiere 5 horas de carpintería y 2 horas de pintura.
Una silla requiere 3 horas de carpintería y 1 hora de pintura.
Disponibilidad:
200 horas de carpintería.
80 horas de pintura.
Ganancias:
40 dólares por mesa.
25 dólares por silla.
Variables de decisión:
x = número de mesas
 y = número de sillas
Función objetivo:
Maximizar ganancias:
Z = 40x + 25y
Restricciones:
5x + 3y ≤ 200
2x + y ≤ 80
X,y ≥ 0`;

const ejemploMezclaTexto = `Escenario:
 Una empresa fabrica alimento para ganado mezclando maíz y soja.
El maíz aporta 2 unidades de proteína por kg.
La soja aporta 5 unidades de proteína por kg.
Disponibilidad:
Máximo 400 kg de maíz.
Máximo 300 kg de soja.
Se necesitan al menos 1200 unidades de proteína.
Costos:
Maíz: 3 dólares por kg.
Soja: 5 dólares por kg.
Variables de decisión:
x = kg de maíz
 y = kg de soja
Función objetivo:
Minimizar costo:
Z = 3x + 5y
Restricciones:
2x+5y≥1200
X ≤ 400
Y ≤ 300
X,y ≥ 0`;

const ejemplos: Record<string, string> = {
  transporte: ejemploTransporteTexto,
  asignacion: ejemploAsignacionTexto,
  financiero: ejemploFinancieroTexto,
  produccion: ejemploProduccionTexto,
  mezcla: ejemploMezclaTexto,
};

export const getEjemplo = (req: Request, res: Response): void => {
  const { tipo } = req.params;
  const texto = ejemplos[tipo];

  if (!texto) {
    res.status(404).send(`Ejemplo no encontrado. Tipos válidos: ${Object.keys(ejemplos).join(", ")}`);
    return;
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(texto);
};
