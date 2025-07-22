"""Defines tools for OpenWeather"""

from google.adk.tools import ToolContext
import requests
import os
from typing import Dict, Any, Optional, Union
import logging

logger = logging.getLogger(__name__)

def get_coordinates_by_location(
    tool_context: ToolContext, 
    city_name: str, 
    country_name: Optional[str] = None, 
    limit: int = 1
) -> Dict[str, Any]:
    """
    Get coordinates (latitude and longitude) for a location using the OpenWeather Geocoding API
    
    Args:
        tool_context: The tool context
        city_name: Name of the city
        country_name: Name of the country
        limit: Number of results to return (up to 5, default 1)
    
    Returns:
        Dictionary containing latitude and longitude of the first result
    """
    # Validate inputs
    if not city_name.strip():
        return {"error": "City name cannot be empty"}
    
    if limit < 1 or limit > 5:
        return {"error": "Limit must be between 1 and 5"}
    
    # Build the query parameter
    query_parts = [city_name.strip()]
    
    if country_name:
        query_parts.append(country_name.strip())
    
    q_param = ",".join(query_parts)
    
    url = "https://api.openweathermap.org/geo/1.0/direct"
    params = {
        "q": q_param,
        "limit": limit,
        "appid": os.getenv("OPENWEATHER_API_KEY"),
    }

    # Validate API key
    if not params["appid"]:
        return {"error": "OpenWeather API key not found in environment variables"}

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if not data:
            return {"error": f"No coordinates found for location: {q_param}"}
        
        # Return the latitude and longitude of the first result
        first_result = data[0]

        print("DEBUG: First result:", first_result)

        return {
            "lat": first_result["lat"],
            "lon": first_result["lon"],
            "name": first_result["name"],
            "country": first_result.get("country", ""),
            "success": True
        }
    except requests.exceptions.Timeout:
        return {"error": "Request timed out while fetching coordinates"}
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            return {"error": "Invalid OpenWeather API key"}
        elif e.response.status_code == 429:
            return {"error": "Rate limit exceeded for OpenWeather API"}
        else:
            return {"error": f"HTTP error {e.response.status_code}: {e.response.text}"}
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for coordinates: {str(e)}")
        return {"error": f"Failed to get coordinates: {str(e)}"}
    except (KeyError, IndexError) as e:
        logger.error(f"Unexpected response format: {str(e)}")
        return {"error": "Unexpected response format from OpenWeather API"}
    except Exception as e:
        logger.error(f"Unexpected error in get_coordinates_by_location: {str(e)}")
        return {"error": f"Unexpected error: {str(e)}"}

def get_weather_forecast(
    tool_context: ToolContext, 
    lat: float, 
    lon: float, 
    exclude: Optional[str] = None,
    units: str = "metric"
) -> Dict[str, Any]:
    """
    Get the weather forecast for a location using the OpenWeather API
    
    Args:
        tool_context: The tool context
        lat: Latitude of the location
        lon: Longitude of the location
        exclude: Parts of the weather data to exclude (e.g., "minutely,hourly,daily")
        units: Units for temperature and measurements (metric, imperial, or kelvin)
    
    Returns:
        Dictionary containing weather forecast data
    """
    # Validate inputs
    if not isinstance(lat, (int, float)) or not isinstance(lon, (int, float)):
        return {"error": "Latitude and longitude must be numeric values"}
    
    if not -90 <= lat <= 90:
        return {"error": "Latitude must be between -90 and 90 degrees"}
    
    if not -180 <= lon <= 180:
        return {"error": "Longitude must be between -180 and 180 degrees"}
    
    if units not in ["metric", "imperial", "kelvin"]:
        return {"error": "Units must be 'metric', 'imperial', or 'kelvin'"}
    
    url = "https://api.openweathermap.org/data/3.0/onecall"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": os.getenv("OPENWEATHER_API_KEY"),
        "units": units,
    }
    
    # Add exclude parameter if provided
    if exclude:
        params["exclude"] = exclude

    # Validate API key
    if not params["appid"]:
        return {"error": "OpenWeather API key not found in environment variables"}

    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        # Add success flag to response
        data["success"] = True
        return data
        
    except requests.exceptions.Timeout:
        return {"error": "Request timed out while fetching weather forecast"}
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            return {"error": "Invalid OpenWeather API key"}
        elif e.response.status_code == 429:
            return {"error": "Rate limit exceeded for OpenWeather API"}
        elif e.response.status_code == 400:
            return {"error": "Invalid parameters provided to weather API"}
        else:
            return {"error": f"HTTP error {e.response.status_code}: {e.response.text}"}
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for weather forecast: {str(e)}")
        return {"error": f"Failed to get weather forecast: {str(e)}"}
    except Exception as e:
        logger.error(f"Unexpected error in get_weather_forecast: {str(e)}")
        return {"error": f"Unexpected error: {str(e)}"}

def get_current_weather(
    tool_context: ToolContext, 
    lat: float, 
    lon: float, 
    units: str = "metric"
) -> Dict[str, Any]:
    """
    Get current weather for a location using the OpenWeather API
    
    Args:
        tool_context: The tool context
        lat: Latitude of the location
        lon: Longitude of the location
        units: Units for temperature and measurements (metric, imperial, or kelvin)
    
    Returns:
        Dictionary containing current weather data
    """
    # Validate inputs
    if not isinstance(lat, (int, float)) or not isinstance(lon, (int, float)):
        return {"error": "Latitude and longitude must be numeric values"}
    
    if not -90 <= lat <= 90:
        return {"error": "Latitude must be between -90 and 90 degrees"}
    
    if not -180 <= lon <= 180:
        return {"error": "Longitude must be between -180 and 180 degrees"}
    
    if units not in ["metric", "imperial", "kelvin"]:
        return {"error": "Units must be 'metric', 'imperial', or 'kelvin'"}
    
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": os.getenv("OPENWEATHER_API_KEY"),
        "units": units,
    }

    # Validate API key
    if not params["appid"]:
        return {"error": "OpenWeather API key not found in environment variables"}

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Add success flag to response
        data["success"] = True
        return data
        
    except requests.exceptions.Timeout:
        return {"error": "Request timed out while fetching current weather"}
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            return {"error": "Invalid OpenWeather API key"}
        elif e.response.status_code == 429:
            return {"error": "Rate limit exceeded for OpenWeather API"}
        elif e.response.status_code == 400:
            return {"error": "Invalid parameters provided to weather API"}
        else:
            return {"error": f"HTTP error {e.response.status_code}: {e.response.text}"}
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for current weather: {str(e)}")
        return {"error": f"Failed to get current weather: {str(e)}"}
    except Exception as e:
        logger.error(f"Unexpected error in get_current_weather: {str(e)}")
        return {"error": f"Unexpected error: {str(e)}"}