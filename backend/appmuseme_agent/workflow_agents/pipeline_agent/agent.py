from google.adk.agents import SequentialAgent

from ...sub_agents.weather_agent import weather_agent
from ..gathering_parallalel_agent import gathering_parallel_agent

# Full pipeline
pipeline_agent = SequentialAgent(
    name="PipelineAgent",
    description="Executes a Sequential pipeline of agents",
    sub_agents=[weather_agent, gathering_parallel_agent],
)