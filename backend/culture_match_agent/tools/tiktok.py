"""Defines tools for TikTok"""

from google.adk.tools import ToolContext
import requests
import os

def fetch_music_trend_list(tool_context: ToolContext):
    """Get the trending music list on TikTok with extended metadata"""
    url = "https://tiktok-api23.p.rapidapi.com/api/trending/song"
    querystring = {
        "page": "1",
        "limit": "20",
        "period": "7",
        "rank_type": "popular",
        "country": "US"
    }

    api_key = os.getenv("RAPID_API_KEY")
    
    if not api_key:
        print("Error: RAPID_API_KEY environment variable not set.")
        return None

    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": "tiktok-api23.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        response.raise_for_status()
        data = response.json()
        sound_list = data.get('data', {}).get('sound_list', [])

        # Extract extended fields for trend scoring and reasoning
        result = [
            {
                'clip_id': item.get('clip_id'),
                'title': item.get('title'),
                'author': item.get('author'),
                'link': item.get('link'),
                'country_code': item.get('country_code'),
                'cover': item.get('cover'),
                'duration': item.get('duration'),
                'rank': item.get('rank'),
                'trend': item.get('trend', [])  # List of {time, value}
            }
            for item in sound_list
            if item.get('clip_id') and item.get('title') and item.get('trend')  # Ensure completeness
        ]

        return result

    except requests.RequestException as e:
        print(f"Error fetching TikTok trending music: {e}")
        return None