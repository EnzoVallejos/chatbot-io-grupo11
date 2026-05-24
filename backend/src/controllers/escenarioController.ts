import { Request, Response } from "express";

export interface Escenario {
  tipo: string;
  titulo: string;
  descripcion: string;
  datos: string;
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

  res.status(200).json(pickRandom(lista));
};
