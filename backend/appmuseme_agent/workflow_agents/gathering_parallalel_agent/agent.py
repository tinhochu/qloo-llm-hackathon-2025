from google.adk.agents import ParallelAgent

from ...sub_agents.weather_agent import weather_agent
from ...sub_agents.qloo_entity_search_agent import qloo_entity_search_agent

# Parallel pipeline
gathering_parallel_agent = ParallelAgent(
    name="GatheringParallelAgent",
    description="Executes a parallel pipeline of agents",
    sub_agents=[qloo_entity_search_agent],
)