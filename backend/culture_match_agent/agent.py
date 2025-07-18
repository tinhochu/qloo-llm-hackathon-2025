from google.adk.agents import LlmAgent
from . import prompt
from .sub_agents.preprod_pipeline_agent import preprod_pipeline_agent

creator_companion_agent = LlmAgent(
    model="gemini-2.0-flash",
    name="AppmusemeAgent",
    instruction=prompt.ROOT_PROMPT,
    sub_agents=[preprod_pipeline_agent],
    output_key="package",
)

root_agent = creator_companion_agent