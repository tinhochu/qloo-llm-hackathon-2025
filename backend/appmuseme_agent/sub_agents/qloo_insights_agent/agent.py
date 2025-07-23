from google.adk.agents import LlmAgent
from ...tools.qloo import get_insights
from . import prompt

MODEL = "gemini-2.0-flash"

qloo_insights_agent = LlmAgent(
    model=MODEL,
    name="QlooInsightsAgent",
    description="Returns taste-based insights based on the input parameters you provide.",
    instruction=prompt.QLOO_INSIGHTS_AGENT_PROMPT,
    tools=[get_insights],
    output_key="qloo_insights",
)
