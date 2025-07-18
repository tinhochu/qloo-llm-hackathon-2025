from google.adk.agents import LlmAgent

from ...tools.tiktok import fetch_music_trend_list
from . import prompt

MODEL = "gemini-2.0-flash"

music_trend_agent = LlmAgent(
    model=MODEL,
    name="MusicTrendAgent",
    description="Generates a music trend for a social media post",
    instruction=prompt.MUSIC_AGENT_PROMPT,
    tools=[fetch_music_trend_list],
    output_key="generated_music"
)
