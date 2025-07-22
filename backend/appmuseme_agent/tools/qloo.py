"""Defines tools for Qloo API"""

import requests
import os
from typing import Dict, Any, Optional, List

def search_qloo_entities(
    query: str,
    location: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Search for entities using the Qloo API
    
    Args:
        query: The text to search against
        location: Geolocation in "latitude,longitude" format
    
    Returns:
        dict: A dictionary containing a 'status' key ('success' or 'error') and either 'results' with an array of entities if successful, or 'error_message' if an error occurred.
    """
    
    # Validate inputs
    if not query or not query.strip():
        return {
            "status": "error", 
            "error_message": "Query is empty or invalid"
        }
    
    # Get API key from environment
    api_key = os.getenv("QLOO_API_KEY")
    
    if not api_key:
        return {
            "status": "error", 
            "error_message": "QLOO_API_KEY environment variable not set"
        }
    
    # Get API URL from environment
    api_url = os.getenv("QLOO_API_URL")
    
    if not api_url:
        return {
            "status": "error", 
            "error_message": "QLOO_API_URL environment variable not set",
            "status_code": 500
        }
    
    # Build query parameters
    params = {'query': query.strip()}

    params['types'] = 'urn:entity:place'
    
    if location:
        params['filter.location'] = location

    # Make the request
    url = api_url + "/search"
    headers = {'x-api-key': api_key}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            return {
                "status": "error",
                "error_message": f"Qloo API returned status code {response.status_code}",
                "status_code": response.status_code
            }
        
        data = response.json()
        results = data.get("results", [])
        
        return {
            "status": "success",
            "results": results,
            "status_code": response.status_code
        }
        
    except requests.exceptions.Timeout:
        return {
            "status": "error",
            "error_message": "Qloo API request timed out",
            "status_code": 500
        }
    except requests.exceptions.HTTPError as e:
        error_msg = f"Qloo API HTTP error: {e}"
        if hasattr(e, 'response') and e.response is not None:
            error_msg += f" (Status: {e.response.status_code})"
        return {
            "status": "error",
            "error_message": error_msg,
            "status_code": e.response.status_code
        }
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "error_message": f"Qloo API request exception: {e}",
            "status_code": 500
        }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Unexpected error in search_qloo_entities: {e}",
            "status_code": 500
        }