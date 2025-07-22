"""Defines tools for Qloo API"""

from google.adk.tools import ToolContext
import requests
import os
from typing import Dict, Any, Optional, List

def search_qloo_entities(
    tool_context: ToolContext,
    query: str,
    location: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Search for entities using the Qloo API
    
    Args:
        tool_context: The tool context
        query: The text to search against
        location: Geolocation in "latitude,longitude" format
    
    Returns:
        List of dictionaries containing entity information
    """

    print(f"DEBUG: Query: {query}")
    print(f"DEBUG: Location: {location}")
    
    # Validate inputs
    if not query.strip():
        print("ERROR: Query is empty")
        return []
    
    # Get API key from environment
    api_key = os.getenv("QLOO_API_KEY")
    
    if not api_key:
        print("ERROR: QLOO_API_KEY environment variable not set")
        return []
    
    # Get API URL from environment
    api_url = os.getenv("QLOO_API_URL")
    if not api_url:
        print("ERROR: QLOO_API_URL environment variable not set")
        return []
    
    # Build query parameters
    params = {'query': query.strip()}
    params['filter.location'] = location
    
    # Make the request
    url = api_url + "/search"
    print(f"DEBUG: URL: {url}")
    headers = {'x-api-key': api_key}
    
    try:
        print(f"DEBUG: Making Qloo API request to {url}")
        print(f"DEBUG: Query: {query}")
        print(f"DEBUG: Params: {params}")
        print(f"DEBUG: Headers: {headers}")
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        print(f"DEBUG: Qloo API response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"ERROR: Qloo API returned status {response.status_code}")
            print(f"ERROR: Response text: {response.text}")
            return []
        
        data = response.json()
        print(f"DEBUG: Qloo API response keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
        
        results = data.get("results", [])
        print(f"DEBUG: Found {len(results)} results")
        
        return results
        
    except requests.exceptions.Timeout:
        print("ERROR: Qloo API request timed out")
        return []
    except requests.exceptions.HTTPError as e:
        print(f"ERROR: Qloo API HTTP error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"ERROR: Response status: {e.response.status_code}")
            print(f"ERROR: Response text: {e.response.text}")
        return []
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Qloo API request exception: {e}")
        return []
    except Exception as e:
        print(f"ERROR: Unexpected error in search_qloo_entities: {e}")
        return []