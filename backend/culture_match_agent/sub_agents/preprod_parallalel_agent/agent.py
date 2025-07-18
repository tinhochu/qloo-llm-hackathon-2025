from google.adk.agents import ParallelAgent
from ..music_trend_agent import music_trend_agent

# Parallel pipeline
preprod_parallel_agent = ParallelAgent(
    name="PreproductionParallelAgent",
    description="Executes a parallel pipeline of agents to go find the music",
    sub_agents=[music_trend_agent],
)