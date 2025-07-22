![Banner Image](https://github.com/user-attachments/assets/7104e150-eaf6-4d8b-aabe-a6ba614a6810)

# Qloo LLM Hackathon

## Author

![Tin Ho Chu](https://github.com/tinhochu.png?size=50)

**Tin Ho Chu**  
[![GitHub](https://img.shields.io/badge/GitHub-@tinhochu-181717?logo=github)](https://github.com/tinhochu)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Tin_Ho_Chu-blue?logo=linkedIn)](https://linkedin.com/in/tinhochu)  
[![Twitter](https://img.shields.io/badge/@tinhochu-000000?logo=x)](https://x.com/tinhochu)

---

## 🎥 Demo Video

---

## 🚀 Project Overview

---

## 🧠 Features & Functionality

---

## 🛠️ Technology Stack

### Frontend

- [Next.js](https://nextjs.org)
- [TailwindCSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)

### Backend

- [MongoDB](https://www.mongodb.com/)
- [Google ADK (Agent Development Kit)](https://github.com/google/agent-development-kit)

### APIs & AI Models

- [Google Gemini](https://developers.google.com/gemini)

---

## 📡 Installation & Setup

1. Clone the repo
2. Set up your environment variables:

   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env

   # Edit the .env file with your API keys
   # You'll need:
   # - QLOO_API_KEY: Your Qloo API key
   # - QLOO_API_URL: Qloo API base URL (usually https://api.qloo.com/v1)
   # - OPENWEATHER_API_KEY: Your OpenWeather API key
   # - RAPID_API_KEY: Your RapidAPI key (for TikTok music trends)

   ```

3. Test your API connections:

   ```bash
   cd backend
   python test_qloo_api.py
   ```

4. Install dependencies:

   ```bash
   # Backend dependencies
   cd backend
   pip install -r requirements.txt

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

---

## 🧠 Inspiration

Creators are overwhelmed by the daily pressure to ideate, write, and stay on-trend. I wanted to build an AI-powered team that could take care of everything before hitting record.

---

## ⚙️ How I Built It

- Multi-agent architecture using Google ADK primitives
- Frontend interface built in Next.js with Tailwind and Shadcn UI

---

## ❗ Challenges I Ran Into

---

## ✅ Accomplishments That I'm Proud Of

---

## 📚 What I Learned

---

## 🔮 What's Next for Appmuseme

---

## 🔧 Troubleshooting

### Common Issues

**Qloo API returning empty results:**

- Check that `QLOO_API_KEY` and `QLOO_API_URL` are set correctly
- Verify your API key has the necessary permissions
- Run `python test_qloo_api.py` to test connectivity
- Check the API documentation for any recent changes

**OpenTelemetry context errors:**

- These are usually harmless and related to the Google ADK framework
- They don't affect the core functionality of the application
- Can be ignored unless they're causing other issues

**Agent not finding entities:**

- Ensure cultural preferences are being passed correctly
- Check that the destination is valid and geocodable
- Verify that the Qloo API is returning results for your test queries

### Getting Help

1. Run the test script: `python test_qloo_api.py`
2. Check the debug logs in your console
3. Verify your environment variables are set correctly
4. Ensure you have valid API keys with proper permissions

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
