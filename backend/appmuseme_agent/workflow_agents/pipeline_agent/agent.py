from google.adk.agents import SequentialAgent

from ...sub_agents.weather_agent import weather_agent
from ...sub_agents.qloo_insights_agent import qloo_insights_agent

# Full pipeline
pipeline_agent = SequentialAgent(
    name="PipelineAgent",
    description="Executes a Sequential pipeline of agents",
    sub_agents=[weather_agent,qloo_insights_agent],
)