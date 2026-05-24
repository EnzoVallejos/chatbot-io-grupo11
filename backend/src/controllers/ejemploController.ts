import { Request, Response } from "express";

// ── TRANSPORTE ────────────────────────────────────────────────────────────────

const ejemploTransporte1 = `Escenario:
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
Z = 4x11 + 6x12 + 8x13 + 5x21 + 3x22 + 7x23
Restricciones:
Oferta de fábricas:
x11 + x12 + x13 ≤ 100
x21 + x22 + x23 ≤ 150
Demanda de depósitos:
x11 + x21 = 80
x12 + x22 = 70
x13 + x23 = 60
No negatividad:
xij ≥ 0`;

const ejemploTransporte2 = `Escenario:
Una empresa distribuye agua embotellada desde 3 plantas hacia 4 supermercados. Cada planta tiene una cantidad limitada de cajas disponibles y cada supermercado necesita recibir cierta cantidad. El costo de transporte depende de la distancia entre cada planta y supermercado. La empresa quiere minimizar el costo total de distribución.
Datos:
Capacidad de las plantas:
Planta 1: 500 cajas
Planta 2: 400 cajas
Planta 3: 300 cajas
Demanda de los supermercados:
Supermercado 1: 200 cajas
Supermercado 2: 350 cajas
Supermercado 3: 250 cajas
Supermercado 4: 400 cajas
Costo de transporte por caja:
Planta 1 → S1 = $4
Planta 1 → S2 = $6
Planta 1 → S3 = $8
Planta 1 → S4 = $5
Planta 2 → S1 = $5
Planta 2 → S2 = $4
Planta 2 → S3 = $3
Planta 2 → S4 = $6
Planta 3 → S1 = $7
Planta 3 → S2 = $5
Planta 3 → S3 = $4
Planta 3 → S4 = $3
Variables de decisión:
xij = cantidad de cajas enviadas desde la planta i hacia el supermercado j.
Ejemplos:
x11 = cajas enviadas desde Planta 1 a Supermercado 1
x24 = cajas enviadas desde Planta 2 a Supermercado 4
Función objetivo:
Minimizar el costo total de transporte de las cajas enviadas entre plantas y supermercados.
min Z = 4x11 + 6x12 + 8x13 + 5x14 + 5x21 + 4x22 + 3x23 + 6x24 + 7x31 + 5x32 + 4x33 + 3x34
Restricciones:
Restricciones de oferta:
Planta 1:
x11 + x12 + x13 + x14 ≤ 500
Planta 2:
x21 + x22 + x23 + x24 ≤ 400
Planta 3:
x31 + x32 + x33 + x34 ≤ 300
Restricciones de demanda:
Supermercado 1:
x11 + x21 + x31 = 200
Supermercado 2:
x12 + x22 + x32 = 350
Supermercado 3:
x13 + x23 + x33 = 250
Supermercado 4:
x14 + x24 + x34 = 400
Restricciones de no negatividad:
x11, x12, x13, x14 ≥ 0
x21, x22, x23, x24 ≥ 0
x31, x32, x33, x34 ≥ 0`;

// ── ASIGNACIÓN ────────────────────────────────────────────────────────────────

const ejemploAsignacion1 = `Escenario:
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
Z = 8x11 + 6x12 + 7x13 + 5x21 + 7x22 + 4x23 + 9x31 + 8x32 + 6x33
Restricciones:
Cada empleado realiza un solo proyecto:
x11 + x12 + x13 = 1
x21 + x22 + x23 = 1
x31 + x32 + x33 = 1
Cada proyecto recibe un empleado:
x11 + x21 + x31 = 1
x12 + x22 + x32 = 1
x13 + x23 + x33 = 1
Variables binarias:
xij ∈ {0,1}`;

const ejemploAsignacion2 = `Escenario:
Una empresa de logística debe asignar 4 conductores a 4 rutas de reparto. Cada conductor tiene distinta experiencia y genera distintos costos según la ruta asignada. La empresa quiere minimizar el costo total de las asignaciones.
Datos:
Costos de asignación por conductor y ruta:
      R1   R2   R3   R4
C1    10    6    9    8
C2     7   11    8    5
C3     9    5    6    7
C4     4    8   10    6
Variables de decisión:
xij = 1 si el conductor i es asignado a la ruta j
xij = 0 en otro caso
Función objetivo:
Minimizar el costo total de asignación:
min Z = 10x11 + 6x12 + 9x13 + 8x14 + 7x21 + 11x22 + 8x23 + 5x24 + 9x31 + 5x32 + 6x33 + 7x34 + 4x41 + 8x42 + 10x43 + 6x44
Restricciones:
Cada conductor realiza una sola ruta:
x11 + x12 + x13 + x14 = 1
x21 + x22 + x23 + x24 = 1
x31 + x32 + x33 + x34 = 1
x41 + x42 + x43 + x44 = 1
Cada ruta es cubierta por un solo conductor:
x11 + x21 + x31 + x41 = 1
x12 + x22 + x32 + x42 = 1
x13 + x23 + x33 + x43 = 1
x14 + x24 + x34 + x44 = 1
Variables binarias:
xij ∈ {0,1}`;

// ── FINANCIERO ────────────────────────────────────────────────────────────────

const ejemploFinanciero1 = `Escenario:
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
x + y ≤ 100000
x ≤ 60000
y ≥ 30000
x, y ≥ 0`;

const ejemploFinanciero2 = `Escenario:
Un inversor dispone de $200000 para distribuir entre tres activos financieros: bonos, acciones y fondos de inversión. Cada activo tiene una rentabilidad esperada y un nivel de riesgo. El inversor quiere maximizar la rentabilidad total respetando sus límites de riesgo y liquidez.
Datos:
Rentabilidad esperada:
Bonos: 8% anual
Acciones: 15% anual
Fondos: 11% anual
Restricciones del inversor:
No invertir más de $80000 en acciones.
Invertir al menos $40000 en bonos.
La inversión total no puede superar $200000.
Variables de decisión:
x = dinero invertido en bonos
y = dinero invertido en acciones
z = dinero invertido en fondos
Función objetivo:
Maximizar la rentabilidad total:
max Z = 0.08x + 0.15y + 0.11z
Restricciones:
x + y + z ≤ 200000
y ≤ 80000
x ≥ 40000
x, y, z ≥ 0`;

// ── PRODUCCIÓN ────────────────────────────────────────────────────────────────

const ejemploProduccion1 = `Escenario:
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
x, y ≥ 0`;

const ejemploProduccion2 = `Escenario:
Una empresa produce tres tipos de calzado: zapatillas, sandalias y botas. Cada producto consume horas de corte, costura y terminación. La planta tiene capacidad limitada en cada etapa y la empresa quiere maximizar sus ganancias semanales.
Datos:
Horas requeridas por par:
             Corte  Costura  Terminación
Zapatilla      2       3          1
Sandalia       1       2          1
Bota           3       4          2
Disponibilidad semanal:
Corte: 120 horas
Costura: 180 horas
Terminación: 80 horas
Ganancia por par:
Zapatilla: $30
Sandalia: $20
Bota: $50
Variables de decisión:
x = pares de zapatillas producidos
y = pares de sandalias producidos
z = pares de botas producidas
Función objetivo:
Maximizar ganancias:
max Z = 30x + 20y + 50z
Restricciones:
Corte:
2x + y + 3z ≤ 120
Costura:
3x + 2y + 4z ≤ 180
Terminación:
x + y + 2z ≤ 80
No negatividad:
x, y, z ≥ 0`;

// ── MEZCLA ────────────────────────────────────────────────────────────────────

const ejemploMezcla1 = `Escenario:
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
2x + 5y ≥ 1200
x ≤ 400
y ≤ 300
x, y ≥ 0`;

const ejemploMezcla2 = `Escenario:
Una empresa elabora pintura mezclando tres pigmentos: rojo, azul y blanco. Cada pigmento tiene un costo por litro y aporta distintas propiedades de cobertura y brillo. La empresa debe producir al menos 1000 litros de pintura cumpliendo estándares mínimos de calidad.
Datos:
Disponibilidad de pigmentos:
Rojo: máximo 500 litros
Azul: máximo 400 litros
Blanco: máximo 600 litros
Propiedades por litro:
           Cobertura  Brillo
Rojo           3         2
Azul           2         4
Blanco         4         1
Requerimientos mínimos de la mezcla final:
Cobertura: al menos 2800 unidades
Brillo: al menos 2000 unidades
Costos:
Rojo: $6 por litro
Azul: $8 por litro
Blanco: $4 por litro
Variables de decisión:
x = litros de pigmento rojo
y = litros de pigmento azul
z = litros de pigmento blanco
Función objetivo:
Minimizar el costo total de la mezcla:
min Z = 6x + 8y + 4z
Restricciones:
Producción mínima:
x + y + z ≥ 1000
Cobertura mínima:
3x + 2y + 4z ≥ 2800
Brillo mínimo:
2x + 4y + z ≥ 2000
Disponibilidad:
x ≤ 500
y ≤ 400
z ≤ 600
No negatividad:
x, y, z ≥ 0`;

// ── REGISTRO ─────────────────────────────────────────────────────────────────

const ejemplos: Record<string, string[]> = {
  transporte: [ejemploTransporte1, ejemploTransporte2],
  asignacion: [ejemploAsignacion1, ejemploAsignacion2],
  financiero: [ejemploFinanciero1, ejemploFinanciero2],
  produccion: [ejemploProduccion1, ejemploProduccion2],
  mezcla:     [ejemploMezcla1,     ejemploMezcla2],
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const getEjemplo = (req: Request, res: Response): void => {
  const { tipo } = req.params;
  const lista = ejemplos[tipo];

  if (!lista) {
    res.status(404).send(`Ejemplo no encontrado. Tipos válidos: ${Object.keys(ejemplos).join(", ")}`);
    return;
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(pickRandom(lista));
};
