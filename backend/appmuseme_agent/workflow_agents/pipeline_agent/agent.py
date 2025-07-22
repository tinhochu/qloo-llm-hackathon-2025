from google.adk.agents import SequentialAgent

from ..gathering_parallalel_agent import gathering_parallel_agent

# Full pipeline
pipeline_agent = SequentialAgent(
    name="PipelineAgent",
    description="Executes a Sequential pipeline of agents",
    sub_agents=[gathering_parallel_agent],
)