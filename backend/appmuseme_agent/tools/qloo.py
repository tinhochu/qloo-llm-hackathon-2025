"""Defines tools for Qloo API"""

import requests
import os
from typing import Dict, Any

def get_insights(
    query: str,
    interests_entities: str,
    tags: str,
) -> Dict[str, Any]:
    """
    Get insights for an entity using the Qloo API
    """
    url =  os.getenv('QLOO_API_URL') + "/v2/insights/"
    
    # Build query parameters
    params = {
        'filter.type': 'urn:entity:place',
        'signal.location.query': query,
        'signal.interests.entities': interests_entities,
        'filter.tags': tags
    }

    
    # Get API key from environment variable
    api_key = os.getenv('QLOO_API_KEY')
    if not api_key:
        return {
            'success': False,
            'error': 'QLOO_API_KEY environment variable not set',
            'status_code': None
        }
    
    headers = {
        'x-api-key': api_key
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        return {
            'success': True,
            'data': response.json(),
            'status_code': response.status_code
        }
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': str(e),
            'status_code': getattr(e.response, 'status_code', None) if hasattr(e, 'response') else None
        }
