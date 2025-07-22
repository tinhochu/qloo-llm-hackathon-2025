#!/usr/bin/env python3
"""
Environment setup script for Qloo Travel App
This script helps you set up your environment variables for the application.
"""

import os
import sys

def create_env_file():
    """Create a .env file with placeholder values"""
    
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_file):
        print("⚠️  .env file already exists!")
        response = input("Do you want to overwrite it? (y/N): ")
        if response.lower() != 'y':
            print("Setup cancelled.")
            return False
    
    env_content = """# Qloo API Configuration
QLOO_API_KEY=your_qloo_api_key_here
QLOO_API_URL=https://api.qloo.com/v1

# OpenWeather API Configuration
OPENWEATHER_API_KEY=your_openweather_api_key_here

# TikTok API Configuration (for music trends)
RAPID_API_KEY=your_rapid_api_key_here

# MongoDB Configuration (for frontend)
MONGODB_URI=mongodb://localhost:27017/qloo-travel-app

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
CRON_SECRET=your_cron_secret_here

# Optional: Pusher Configuration (for real-time updates)
# PUSHER_APP_ID=your_pusher_app_id
# PUSHER_KEY=your_pusher_key
# PUSHER_SECRET=your_pusher_secret
"""
    
    try:
        with open(env_file, 'w') as f:
            f.write(env_content)
        print(f"✅ Created {env_file}")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def print_setup_instructions():
    """Print setup instructions"""
    
    print("\n" + "=" * 60)
    print("🚀 Qloo Travel App - Environment Setup")
    print("=" * 60)
    
    print("\n📋 Required API Keys:")
    print("   1. Qloo API Key")
    print("      - Get it from: https://qloo.com/developers")
    print("      - Used for finding cultural entities and venues")
    
    print("\n   2. OpenWeather API Key")
    print("      - Get it from: https://openweathermap.org/api")
    print("      - Used for weather forecasts and geocoding")
    
    print("\n   3. RapidAPI Key (Optional)")
    print("      - Get it from: https://rapidapi.com")
    print("      - Used for TikTok music trends")
    
    print("\n🔧 Setup Steps:")
    print("   1. Edit the .env file that was just created")
    print("   2. Replace the placeholder values with your actual API keys")
    print("   3. Run 'python test_qloo_api.py' to test your setup")
    print("   4. Start your application!")
    
    print("\n💡 Tips:")
    print("   - Keep your API keys secure and never commit them to version control")
    print("   - The .env file is already in .gitignore")
    print("   - You can get free API keys for testing from most providers")
    print("   - Check the README.md for more detailed instructions")

def main():
    """Main setup function"""
    
    print("🔧 Setting up environment for Qloo Travel App...")
    
    # Create .env file
    if create_env_file():
        print_setup_instructions()
        
        # Offer to run the test script
        print("\n" + "=" * 60)
        response = input("Would you like to run the API test now? (y/N): ")
        if response.lower() == 'y':
            print("\n🧪 Running API tests...")
            os.system(f"{sys.executable} test_qloo_api.py")
    else:
        print("❌ Setup failed. Please check the error messages above.")

if __name__ == "__main__":
    main() 