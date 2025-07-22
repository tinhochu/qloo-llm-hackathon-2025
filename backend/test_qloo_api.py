#!/usr/bin/env python3
"""
Test script for Qloo API connectivity
Run this script to test if your Qloo API credentials are working correctly.
"""

import os
import requests
import json
from typing import Dict, Any, Optional

def test_qloo_api():
    """Test Qloo API connectivity and basic functionality"""
    
    print("🔍 Testing Qloo API connectivity...")
    
    # Check environment variables
    api_key = os.getenv("QLOO_API_KEY")
    api_url = os.getenv("QLOO_API_URL")
    
    if not api_key:
        print("❌ ERROR: QLOO_API_KEY environment variable not set")
        print("   Please set your Qloo API key in your environment variables")
        return False
    
    if not api_url:
        print("❌ ERROR: QLOO_API_URL environment variable not set")
        print("   Please set your Qloo API URL in your environment variables")
        return False
    
    print(f"✅ API Key: {'*' * (len(api_key) - 4) + api_key[-4:] if len(api_key) > 4 else '***'}")
    print(f"✅ API URL: {api_url}")
    
    # Test basic search
    test_queries = [
        "restaurant",
        "coffee",
        "museum"
    ]
    
    headers = {'x-api-key': api_key}
    
    for query in test_queries:
        print(f"\n🔍 Testing search for: '{query}'")
        
        try:
            url = f"{api_url}/search"
            params = {'query': query}
            
            print(f"   URL: {url}")
            print(f"   Params: {params}")
            
            response = requests.get(url, headers=headers, params=params, timeout=10)
            
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                print(f"   ✅ Success! Found {len(results)} results")
                
                if results:
                    # Show first result as example with full structure
                    first_result = results[0]
                    print(f"   📍 Example: {first_result.get('name', 'Unknown')}")
                    print(f"   🏷️  Types: {first_result.get('types', [])}")
                    print(f"   📋 Full result structure:")
                    print(f"      {json.dumps(first_result, indent=6)}")
                    
            elif response.status_code == 401:
                print("   ❌ Authentication failed - check your API key")
                return False
            elif response.status_code == 403:
                print("   ❌ Access forbidden - check your API permissions")
                return False
            elif response.status_code == 404:
                print("   ❌ API endpoint not found - check your API URL")
                return False
            else:
                print(f"   ❌ Unexpected status code: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except requests.exceptions.Timeout:
            print("   ❌ Request timed out")
            return False
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Request failed: {e}")
            return False
        except Exception as e:
            print(f"   ❌ Unexpected error: {e}")
            return False
    
    print("\n🎉 All tests passed! Your Qloo API is working correctly.")
    return True

def test_openweather_api():
    """Test OpenWeather API connectivity"""
    
    print("\n🌤️  Testing OpenWeather API connectivity...")
    
    api_key = os.getenv("OPENWEATHER_API_KEY")
    
    if not api_key:
        print("❌ ERROR: OPENWEATHER_API_KEY environment variable not set")
        return False
    
    print(f"✅ API Key: {'*' * (len(api_key) - 4) + api_key[-4:] if len(api_key) > 4 else '***'}")
    
    try:
        # Test geocoding API
        url = "http://api.openweathermap.org/geo/1.0/direct"
        params = {
            "q": "New York,NY,US",
            "limit": 1,
            "appid": api_key
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data:
                print("✅ OpenWeather API is working correctly")
                return True
            else:
                print("❌ No results returned from OpenWeather API")
                return False
        else:
            print(f"❌ OpenWeather API error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ OpenWeather API test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Qloo API Test Suite")
    print("=" * 50)
    
    # Load environment variables from .env file if it exists
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_file):
        print("📁 Loading environment variables from .env file...")
        from dotenv import load_dotenv
        load_dotenv(env_file)
    
    qloo_success = test_qloo_api()
    weather_success = test_openweather_api()
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"   Qloo API: {'✅ PASS' if qloo_success else '❌ FAIL'}")
    print(f"   OpenWeather API: {'✅ PASS' if weather_success else '❌ FAIL'}")
    
    if not qloo_success or not weather_success:
        print("\n🔧 Troubleshooting Tips:")
        print("   1. Check that you have valid API keys")
        print("   2. Ensure your .env file is in the backend directory")
        print("   3. Verify your API keys have the correct permissions")
        print("   4. Check your internet connection")
        print("   5. Review the API documentation for any changes")
    else:
        print("\n🎉 All APIs are working correctly!")