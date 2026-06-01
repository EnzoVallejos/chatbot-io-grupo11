import { Request, Response } from "express";

export interface Escenario {
  tipo: string;
  titulo: string;
  descripcion: string;
  datos: string;
  resolucion_sugerida: string;
}

const escenarios: Record<string, Escenario[]> = {
  transporte: [
    {
      tipo: "transporte",
      titulo: "Distribución de cemento",
      descripcion:
        "Una empresa cementera tiene 2 plantas productoras (P1 y P2) y debe abastecer a 3 obras en construcción (O1, O2 y O3). Cada planta tiene una capacidad máxima de despacho semanal y cada obra tiene una demanda mínima que debe cubrirse. El objetivo es minimizar el costo total de transporte.",
      datos: `Capacidad de las plantas (toneladas/semana):
P1: 120 toneladas
P2: 80 toneladas

Demanda de las obras (toneladas/semana):
O1: 70 toneladas
O2: 90 toneladas
O3: 40 toneladas

Costo de transporte por tonelada ($):
       O1   O2   O3
P1      3    7    5
P2      4    2    6`,
      resolucion_sugerida: `Variables de decisión:
xij = toneladas enviadas desde planta i a obra j
x11 = P1 a O1, x12 = P1 a O2, x13 = P1 a O3
x21 = P2 a O1, x22 = P2 a O2, x23 = P2 a O3

Función objetivo:
min Z = 3x11 + 7x12 + 5x13 + 4x21 + 2x22 + 6x23

Restricciones:
Oferta:
x11 + x12 + x13 <= 120  (P1)
x21 + x22 + x23 <= 80   (P2)

Demanda:
x11 + x21 = 70  (O1)
x12 + x22 = 90  (O2)
x13 + x23 = 40  (O3)

No negatividad:
xij >= 0`,
    },
    {
      tipo: "transporte",
      titulo: "Reparto de combustible",
      descripcion:
        "Una distribuidora de combustible opera desde 3 depósitos (D1, D2, D3) hacia 4 estaciones de servicio (E1, E2, E3, E4). Se quiere minimizar el costo total de distribución respetando la capacidad de cada depósito y la demanda de cada estación.",
      datos: `Capacidad de los depósitos (litros):
D1: 5000
D2: 4000
D3: 3000

Demanda de las estaciones (litros):
E1: 2000
E2: 3500
E3: 3000
E4: 3500

Costo por litro transportado ($):
       E1   E2   E3   E4
D1      2    4    5    3
D2      3    1    4    2
D3      5    3    2    4`,
      resolucion_sugerida: `Variables de decisión:
xij = litros enviados desde depósito i a estación j
x11..x14 desde D1, x21..x24 desde D2, x31..x34 desde D3

Función objetivo:
min Z = 2x11 + 4x12 + 5x13 + 3x14
      + 3x21 + 1x22 + 4x23 + 2x24
      + 5x31 + 3x32 + 2x33 + 4x34

Restricciones:
Oferta:
x11 + x12 + x13 + x14 <= 5000  (D1)
x21 + x22 + x23 + x24 <= 4000  (D2)
x31 + x32 + x33 + x34 <= 3000  (D3)

Demanda:
x11 + x21 + x31 = 2000  (E1)
x12 + x22 + x32 = 3500  (E2)
x13 + x23 + x33 = 3000  (E3)
x14 + x24 + x34 = 3500  (E4)

No negatividad:
xij >= 0`,
    },
  ],

  asignacion: [
    {
      tipo: "asignacion",
      titulo: "Asignación de técnicos a tareas",
      descripcion:
        "Una empresa de mantenimiento tiene 3 técnicos disponibles (T1, T2, T3) y 3 tareas pendientes (A, B, C). Cada técnico puede realizar cualquier tarea pero con distinto costo según su experiencia. Se debe asignar exactamente un técnico por tarea minimizando el costo total.",
      datos: `Costo de asignación ($):
       A    B    C
T1    15   10   12
T2     9   14    8
T3    11    7   13`,
      resolucion_sugerida: `Variables de decisión:
xij = 1 si el técnico i realiza la tarea j, 0 en otro caso
i ∈ {T1, T2, T3}, j ∈ {A, B, C}

Función objetivo:
min Z = 15x11 + 10x12 + 12x13
      +  9x21 + 14x22 +  8x23
      + 11x31 +  7x32 + 13x33

Restricciones:
Cada técnico realiza exactamente una tarea:
x11 + x12 + x13 = 1
x21 + x22 + x23 = 1
x31 + x32 + x33 = 1

Cada tarea la realiza exactamente un técnico:
x11 + x21 + x31 = 1
x12 + x22 + x32 = 1
x13 + x23 + x33 = 1

Variables binarias:
xij ∈ {0, 1}`,
    },
    {
      tipo: "asignacion",
      titulo: "Asignación de máquinas a productos",
      descripcion:
        "Una fábrica tiene 4 máquinas (M1, M2, M3, M4) y debe producir 4 tipos de piezas (P1, P2, P3, P4). Cada máquina solo puede producir un tipo de pieza a la vez. El tiempo de producción varía según la combinación. Se quiere minimizar el tiempo total de producción.",
      datos: `Tiempo de producción (horas):
        P1   P2   P3   P4
M1       5    8    4    7
M2       6    4    9    5
M3       8    5    6    4
M4       4    7    5    8`,
      resolucion_sugerida: `Variables de decisión:
xij = 1 si la máquina i produce la pieza j, 0 en otro caso
i ∈ {M1, M2, M3, M4}, j ∈ {P1, P2, P3, P4}

Función objetivo:
min Z = 5x11 + 8x12 + 4x13 + 7x14
      + 6x21 + 4x22 + 9x23 + 5x24
      + 8x31 + 5x32 + 6x33 + 4x34
      + 4x41 + 7x42 + 5x43 + 8x44

Restricciones:
Cada máquina produce exactamente un tipo de pieza:
x11 + x12 + x13 + x14 = 1  (M1)
x21 + x22 + x23 + x24 = 1  (M2)
x31 + x32 + x33 + x34 = 1  (M3)
x41 + x42 + x43 + x44 = 1  (M4)

Cada pieza es producida por exactamente una máquina:
x11 + x21 + x31 + x41 = 1  (P1)
x12 + x22 + x32 + x42 = 1  (P2)
x13 + x23 + x33 + x43 = 1  (P3)
x14 + x24 + x34 + x44 = 1  (P4)

Variables binarias:
xij ∈ {0, 1}`,
    },
  ],

  financiero: [
    {
      tipo: "financiero",
      titulo: "Inversión en proyectos inmobiliarios",
      descripcion:
        "Un inversor dispone de $500.000 para distribuir entre tres proyectos inmobiliarios (A, B, C). Cada proyecto tiene una rentabilidad esperada distinta y un monto mínimo de inversión. El objetivo es maximizar la rentabilidad total respetando las restricciones de capital y los límites por proyecto.",
      datos: `Rentabilidad anual esperada:
Proyecto A: 10%
Proyecto B: 16%
Proyecto C: 12%

Restricciones:
- Capital total disponible: $500.000
- Inversión mínima en A: $50.000
- Inversión máxima en B: $200.000
- Inversión máxima en C: $180.000
- No se puede invertir más del 60% del capital en un solo proyecto`,
      resolucion_sugerida: `Variables de decisión:
x = monto invertido en Proyecto A ($)
y = monto invertido en Proyecto B ($)
z = monto invertido en Proyecto C ($)

Función objetivo:
max Z = 0.10x + 0.16y + 0.12z

Restricciones:
x + y + z <= 500000
x >= 50000
y <= 200000
z <= 180000
x <= 300000  (60% de 500.000)
y <= 300000
z <= 300000
x, y, z >= 0`,
    },
    {
      tipo: "financiero",
      titulo: "Cartera de instrumentos financieros",
      descripcion:
        "Un fondo de inversión dispone de $1.000.000 para asignar entre cuatro instrumentos financieros: plazo fijo, bonos, acciones y criptomonedas. Cada instrumento tiene distinto rendimiento y riesgo. Se quiere maximizar el rendimiento cumpliendo restricciones de riesgo y diversificación.",
      datos: `Rendimiento anual y nivel de riesgo:
Plazo fijo:     7%  — riesgo bajo
Bonos:         10%  — riesgo bajo-medio
Acciones:      18%  — riesgo alto
Criptomonedas: 30%  — riesgo muy alto

Restricciones:
- Capital total: $1.000.000
- Máximo 25% en criptomonedas
- Máximo 40% en acciones
- Mínimo 15% en plazo fijo
- Mínimo 10% en bonos
- Instrumentos de alto riesgo (acciones + cripto) no pueden superar el 50% del total`,
      resolucion_sugerida: `Variables de decisión:
x1 = monto invertido en Plazo fijo ($)
x2 = monto invertido en Bonos ($)
x3 = monto invertido en Acciones ($)
x4 = monto invertido en Criptomonedas ($)

Función objetivo:
max Z = 0.07x1 + 0.10x2 + 0.18x3 + 0.30x4

Restricciones:
x1 + x2 + x3 + x4 <= 1000000
x4 <= 250000
x3 <= 400000
x1 >= 150000
x2 >= 100000
x3 + x4 <= 500000
x1, x2, x3, x4 >= 0`,
    },
  ],

  produccion: [
    {
      tipo: "produccion",
      titulo: "Fabricación de muebles de oficina",
      descripcion:
        "Una carpintería fabrica escritorios y estanterías. Cada producto requiere horas de corte, ensamble y pintura. La planta tiene capacidad limitada en cada proceso. Se quiere determinar cuántas unidades producir de cada tipo para maximizar la ganancia semanal.",
      datos: `Horas requeridas por unidad:
              Corte  Ensamble  Pintura
Escritorio      4       6        2
Estantería      2       3        3

Horas disponibles por semana:
Corte:    160 horas
Ensamble: 210 horas
Pintura:  120 horas

Ganancia por unidad:
Escritorio: $80
Estantería: $50`,
      resolucion_sugerida: `Variables de decisión:
x = cantidad de escritorios a producir por semana
y = cantidad de estanterías a producir por semana

Función objetivo:
max Z = 80x + 50y

Restricciones:
Corte:    4x + 2y <= 160
Ensamble: 6x + 3y <= 210
Pintura:  2x + 3y <= 120
x, y >= 0`,
    },
    {
      tipo: "produccion",
      titulo: "Producción de alimentos envasados",
      descripcion:
        "Una planta de alimentos produce tres productos: arroz, lentejas y fideos. Cada uno requiere tiempo de procesamiento, envasado y etiquetado. Se tienen restricciones de materia prima y capacidad de máquinas. Se quiere maximizar la ganancia diaria.",
      datos: `Tiempo requerido por tonelada (horas):
            Procesamiento  Envasado  Etiquetado
Arroz            3            2          1
Lentejas         2            3          1
Fideos           4            2          2

Capacidad diaria (horas):
Procesamiento: 120
Envasado:       90
Etiquetado:     50

Ganancia por tonelada ($):
Arroz:    200
Lentejas: 280
Fideos:   250`,
      resolucion_sugerida: `Variables de decisión:
x = toneladas de arroz a producir por día
y = toneladas de lentejas a producir por día
z = toneladas de fideos a producir por día

Función objetivo:
max Z = 200x + 280y + 250z

Restricciones:
Procesamiento: 3x + 2y + 4z <= 120
Envasado:      2x + 3y + 2z <= 90
Etiquetado:    x  + y  + 2z <= 50
x, y, z >= 0`,
    },
  ],

  mezcla: [
    {
      tipo: "mezcla",
      titulo: "Mezcla de fertilizantes",
      descripcion:
        "Una empresa agroquímica produce fertilizante mezclando tres componentes: nitrógeno (N), fósforo (P) y potasio (K). El producto final debe cumplir estándares mínimos de concentración de nutrientes. Se quiere minimizar el costo de producción por tonelada de mezcla.",
      datos: `Aporte de nutrientes por kg de componente:
             Nitrógeno  Fósforo  Potasio
Componente N    0.6       0.1      0.1
Componente P    0.1       0.5      0.2
Componente K    0.2       0.2      0.6

Disponibilidad máxima:
Componente N: 400 kg
Componente P: 350 kg
Componente K: 300 kg

Requerimientos mínimos por tonelada de mezcla:
Nitrógeno: al menos 200 kg
Fósforo:   al menos 150 kg
Potasio:   al menos 180 kg

Costo por kg:
Componente N: $8
Componente P: $6
Componente K: $5`,
      resolucion_sugerida: `Variables de decisión:
x = kg de Componente N a utilizar
y = kg de Componente P a utilizar
z = kg de Componente K a utilizar

Función objetivo:
min Z = 8x + 6y + 5z

Restricciones:
Nitrógeno:  0.6x + 0.1y + 0.2z >= 200
Fósforo:    0.1x + 0.5y + 0.2z >= 150
Potasio:    0.1x + 0.2y + 0.6z >= 180
x <= 400
y <= 350
z <= 300
x, y, z >= 0`,
    },
    {
      tipo: "mezcla",
      titulo: "Mezcla de combustibles",
      descripcion:
        "Una refinería mezcla tres tipos de nafta (A, B, C) para producir combustible premium. El producto debe cumplir con valores mínimos de octanaje y máximos de azufre. Se quiere minimizar el costo de producción de 10.000 litros de combustible.",
      datos: `Características por litro:
         Octanaje  Azufre (ppm)  Costo ($/litro)
Nafta A    85          50             1.2
Nafta B    92          30             1.8
Nafta C    98          10             2.5

Disponibilidad:
Nafta A: máximo 5000 litros
Nafta B: máximo 4000 litros
Nafta C: máximo 3000 litros

Requerimientos del combustible final:
- Octanaje promedio ponderado: al menos 90
- Azufre promedio ponderado: máximo 35 ppm
- Producción total: exactamente 10.000 litros`,
      resolucion_sugerida: `Variables de decisión:
x = litros de Nafta A a utilizar
y = litros de Nafta B a utilizar
z = litros de Nafta C a utilizar

Función objetivo:
min Z = 1.2x + 1.8y + 2.5z

Restricciones:
Producción total:
x + y + z = 10000

Octanaje ponderado >= 90:
85x + 92y + 98z >= 90(x + y + z)
→ -5x + 2y + 8z >= 0

Azufre ponderado <= 35 ppm:
50x + 30y + 10z <= 35(x + y + z)
→ 15x - 5y - 25z <= 0

Disponibilidad:
x <= 5000
y <= 4000
z <= 3000
x, y, z >= 0`,
    },
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const getEscenario = (req: Request, res: Response): void => {
  const { tipo } = req.params;
  const lista = escenarios[tipo];

  if (!lista) {
    res.status(404).json({
      error: `Tipo no encontrado. Tipos válidos: ${Object.keys(escenarios).join(", ")}`,
    });
    return;
  }

  // No se expone resolucion_sugerida al frontend
  const { resolucion_sugerida, ...escenario } = pickRandom(lista);
  void resolucion_sugerida;
  res.status(200).json(escenario);
};

export const getEscenarioConSolucion = (req: Request, res: Response): void => {
  const { tipo } = req.params;
  const lista = escenarios[tipo];

  if (!lista) {
    res.status(404).json({
      error: `Tipo no encontrado.`,
    });
    return;
  }

  res.status(200).json(pickRandom(lista));
};

// Exportar mapa completo para uso interno del evaluador
export { escenarios };
