import json
import requests
from google.adk.tools import ToolContext

def sanitize_and_validate_json(data: dict) -> str:
    """Ensure JSON is cleanly serializable with UTF-8 encoding."""
    try:
        json_str = json.dumps(data, ensure_ascii=False)
        json_str.encode('utf-8')
        return json_str
    except Exception as e:
        raise ValueError(f"Invalid JSON data: {e}")

def update_idea(tool_context: ToolContext):
    """Update the Idea in the Database

    Returns:
        dict: A dictionary containing the idea information with a 'status' key ('success' or 'error') and a 'report' key with the idea details if successful, or an 'error_message' if an error occurred.
    """
    try:
        url = "http://localhost:3000/api/ideas"

        idea_payload = tool_context.state['generated_package']

        # Validate JSON before sending
        sanitize_and_validate_json(idea_payload)

        response = requests.put(url, json=idea_payload)

        return response.json()
    except Exception as e:
        print(f"Error updating idea: {e}")
        return {
            "status": "error",
            "error_message": str(e)
        }
