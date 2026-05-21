"""Modo 3: PRÁCTICA.

Esqueleto inicial. La idea de este modo es que el chatbot le proponga
ejercicios al usuario sobre los temas de la materia, evalúe sus respuestas
y le dé retroalimentación.

TODO (a desarrollar):
- Definir el banco de ejercicios (estático en archivo o generado por el LLM).
- Sistema de corrección: comparar contra solución conocida vs. evaluación
  por LLM con criterios.
- Niveles de dificultad y seguimiento de progreso.
"""

from __future__ import annotations

from langchain_ollama import OllamaLLM

from . import config


_SYSTEM_PROMPT = """Sos un asistente experto en Investigación Operativa
trabajando en MODO PRÁCTICA.

Tu objetivo es proponerle al estudiante ejercicios de la materia y
corregir sus respuestas.

Estrategia:
- Generá un ejercicio adecuado al tema que pida el usuario.
- Esperá la respuesta del estudiante.
- Corregí indicando qué está bien, qué está mal y cómo mejorarlo.
- Respondé siempre en español.

[TODO: cuando estén definidos los temas, agregar al prompt el listado
de unidades, niveles de dificultad y formato de ejercicios esperado.]
"""


def build_llm() -> OllamaLLM:
    """LLM configurado para el modo Práctica."""
    return OllamaLLM(
        model=config.MODEL_NAME,
        temperature=0.5,  # un poco más alto para que varíe los ejercicios
        base_url=config.OLLAMA_BASE_URL,
        num_predict=config.NUM_PREDICT,
        num_ctx=config.NUM_CTX,
        reasoning=config.REASONING,
        system=_SYSTEM_PROMPT,
    )


def run() -> None:
    """Loop interactivo del modo Práctica (versión inicial)."""
    print("\n==========================================")
    print(" MODO PRÁCTICA ")
    print("==========================================")
    print("(Módulo en desarrollo - chat libre con el LLM por ahora)")
    print("Pedí un ejercicio (ej: 'dame un ejercicio de transporte').")
    print("Escribí 'salir' para volver al menú principal.\n")

    llm = build_llm()
    historial: list[str] = []

    while True:
        try:
            entrada = input("Tú: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if not entrada:
            continue
        if entrada.lower() in {"salir", "exit", "quit"}:
            break

        historial.append(f"Usuario: {entrada}")
        prompt = "\n".join(historial) + "\nAsistente:"

        try:
            respuesta = llm.invoke(prompt)
        except Exception as exc:  # noqa: BLE001
            print(f"\n[Error al consultar el modelo] {exc}\n")
            continue

        historial.append(f"Asistente: {respuesta}")
        print("\nBot:")
        print(respuesta)
        print()
