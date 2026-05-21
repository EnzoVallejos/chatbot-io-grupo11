"""Modo 2: DIAGNÓSTICO.

Esqueleto inicial. La idea de este modo es que el chatbot le haga preguntas
al usuario para identificar qué tipo de problema de Investigación Operativa
tiene entre manos (programación lineal, colas, transporte, stock, etc.) y
le sugiera qué modelo aplicar.

TODO (a desarrollar):
- Definir el árbol de preguntas / criterios de diagnóstico.
- Decidir si conviene RAG, function calling, JSON estructurado, etc.
- Guardar el historial del diagnóstico para retomarlo.
"""

from __future__ import annotations

from langchain_ollama import OllamaLLM

from . import config


_SYSTEM_PROMPT = """Sos un asistente experto en Investigación Operativa
trabajando en MODO DIAGNÓSTICO.

Tu objetivo es identificar qué tipo de problema/modelo de IO tiene el
usuario (programación lineal, colas, transporte, asignación, stock,
Markov, juegos, programación dinámica, etc.).

Estrategia:
- Hacé preguntas cortas, de a una por vez, para acotar el problema.
- No asumas datos: pedí al usuario lo que falte.
- Cuando tengas suficiente información, sugerí qué modelo aplicar y por qué.
- Respondé siempre en español.

[TODO: refinar criterios y agregar ejemplos a este prompt cuando esté
definida la lógica del diagnóstico.]
"""


def build_llm() -> OllamaLLM:
    """LLM configurado para el modo Diagnóstico."""
    return OllamaLLM(
        model=config.MODEL_NAME,
        temperature=config.TEMPERATURE,
        base_url=config.OLLAMA_BASE_URL,
        num_predict=config.NUM_PREDICT,
        num_ctx=config.NUM_CTX,
        reasoning=config.REASONING,
        system=_SYSTEM_PROMPT,
    )


def run() -> None:
    """Loop interactivo del modo Diagnóstico (versión inicial)."""
    print("\n==========================================")
    print(" MODO DIAGNÓSTICO ")
    print("==========================================")
    print("(Módulo en desarrollo - chat libre con el LLM por ahora)")
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
