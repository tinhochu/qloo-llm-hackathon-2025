from google.adk.agents import LlmAgent
from ...tools.qloo import search_qloo_entities
from . import prompt

MODEL = "gemini-2.0-flash"

qloo_entity_search_agent = LlmAgent(
    model=MODEL,
    name="QlooEntitySearchAgent",
    description="Searches the Qloo API for entities",
    instruction=prompt.QLOO_ENTITY_SEARCH_AGENT_PROMPT,
    tools=[search_qloo_entities],
    output_key="qloo_entities"
)
