from google.adk.agents import LlmAgent
from . import prompt
from .workflow_agents.pipeline_agent import pipeline_agent

appmuseme_agent = LlmAgent(
    model="gemini-2.0-flash",
    name="AppmusemeAgent",
    instruction=prompt.ROOT_PROMPT,
    sub_agents=[pipeline_agent],
    output_key="payload",
)

root_agent = appmuseme_agent