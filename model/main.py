"""Punto de entrada del chatbot de IO - Grupo 11.

Permite elegir entre los 3 modos del chatbot:
  1) Consultas   -> RAG sobre data.md (teoría de la materia)
  2) Diagnóstico -> identifica qué modelo de IO aplicar (en desarrollo)
  3) Práctica    -> ejercicios y corrección (en desarrollo)

Uso (desde la raíz del proyecto):
    python -m model.main                  # menú interactivo
    python -m model.main consultas        # arranca directamente Consultas
    python -m model.main consultas --rebuild   # regenera la base vectorial
    python -m model.main diagnostico
    python -m model.main practica
"""

from __future__ import annotations

import argparse
import sys

from . import config, consultas, diagnostico, practica


MENU = f"""
==========================================
 Chatbot IO - Grupo 11
 Modelo: {config.MODEL_NAME}
==========================================
 [1] Consultas   (basado en data.md)
 [2] Diagnóstico (en desarrollo)
 [3] Práctica    (en desarrollo)
 [0] Salir
==========================================
"""


def _menu_loop() -> None:
    while True:
        print(MENU)
        try:
            opcion = input("Seleccioná un modo: ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            print()
            return

        if opcion in {"1", "consultas"}:
            consultas.run()
        elif opcion in {"2", "diagnostico", "diagnóstico"}:
            diagnostico.run()
        elif opcion in {"3", "practica", "práctica"}:
            practica.run()
        elif opcion in {"0", "salir", "exit", "quit"}:
            print("¡Hasta luego!")
            return
        else:
            print("Opción no válida. Probá de nuevo.")


def _parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Chatbot IO - Grupo 11")
    parser.add_argument(
        "modo",
        nargs="?",
        choices=["consultas", "diagnostico", "practica"],
        help="Modo a ejecutar directamente. Si se omite, abre el menú.",
    )
    parser.add_argument(
        "--rebuild",
        action="store_true",
        help="Reconstruye la base vectorial (solo aplica a 'consultas').",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> None:
    args = _parse_args(argv if argv is not None else sys.argv[1:])

    if args.modo == "consultas":
        consultas.run(rebuild_db=args.rebuild)
    elif args.modo == "diagnostico":
        diagnostico.run()
    elif args.modo == "practica":
        practica.run()
    else:
        _menu_loop()


if __name__ == "__main__":
    main()
