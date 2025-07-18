from google.adk.agents import SequentialAgent

from ..preprod_parallalel_agent import preprod_parallel_agent

# Full pipeline
preprod_pipeline_agent = SequentialAgent(
    name="PreProdPipelineAgent",
    description="Executes a Sequential pipeline of agents",
    sub_agents=[preprod_parallel_agent],
)