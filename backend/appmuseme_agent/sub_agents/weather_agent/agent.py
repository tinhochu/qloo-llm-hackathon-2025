from google.adk.agents import LlmAgent

from ...tools.openweather import get_weather_forecast, get_coordinates_by_location
from . import prompt

MODEL = "gemini-2.0-flash"

weather_agent = LlmAgent(
    model=MODEL,
    name="WeatherAgent",
    description="Gets the weather for a given location",
    instruction=prompt.WEATHER_AGENT_PROMPT,
    tools=[get_coordinates_by_location, get_weather_forecast],
    output_key="weather_payload"
)
