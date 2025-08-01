![License](https://img.shields.io/github/license/tinhochu/qloo-llm-hackathon-2025) ![Last Commit](https://img.shields.io/github/last-commit/tinhochu/qloo-llm-hackathon-2025) [![Website](https://img.shields.io/website?url=https%3A%2F%2Fappmuseme.vercel.app)](https://appmuseme.vercel.app) ![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Vercel](https://img.shields.io/badge/Hosting-Vercel-blue) ![Next.js](https://img.shields.io/badge/Framework-Next.js-000?logo=next.js) ![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css) [![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/) ![Clerk](https://img.shields.io/badge/Authentication-Clerk-blue?logo=clerk) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-blue?logo=mongodb) ![Mongoose](https://img.shields.io/badge/Database-Mongoose-blue?logo=mongoose) ![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-blue?logo=google-gemini)

![Banner Image](https://github.com/user-attachments/assets/7104e150-eaf6-4d8b-aabe-a6ba614a6810)

# Appmuseme – Qloo LLM Hackathon

## Author

![Tin Ho Chu](https://github.com/tinhochu.png?size=50)

**Tin Ho Chu**  
[![GitHub](https://img.shields.io/badge/GitHub-@tinhochu-181717?logo=github)](https://github.com/tinhochu)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Tin_Ho_Chu-blue?logo=linkedIn)](https://linkedin.com/in/tinhochu)  
[![Twitter](https://img.shields.io/badge/@tinhochu-000000?logo=x)](https://x.com/tinhochu)

## 🎥 Demo Video

[![Appmuseme Demo](https://img.youtube.com/vi/8hdmUwOEAWM/maxresdefault.jpg)](https://youtu.be/8hdmUwOEAWM)

Watch the full demo: [https://youtu.be/8hdmUwOEAWM](https://youtu.be/8hdmUwOEAWM)

## 🚀 Project Overview

**Appmuseme** is a culturally intelligent travel assistant that helps users plan unforgettable trips based on their unique tastes in music, food, books, fashion, and more — not just social media trends.

By combining Qloo’s Taste AI with Google Gemini and a lightweight frontend architecture, Appmuseme builds day-by-day itineraries aligned with who you are, not just where you’re going.

## 🧠 Features & Functionality

- ✈️ Taste-powered travel itinerary builder
- 🧬 AI parses your input into structured cultural preferences
- 🌐 Uses Qloo’s cross-domain taste graph to fetch experiences
- 📍 Suggests hyper-personalized venues, neighborhoods, and events
- 🎶 Generates playlists, reading lists, and city vibe maps
- ⚡ Fast, single-layer architecture using only frontend + LLM

## 🛠️ Technology Stack

### Frontend

- [Next.js](https://nextjs.org)
- [TailwindCSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Vercel AI SDK](https://vercel.com/blog/introducing-the-vercel-ai-sdk)

### APIs & AI Models

- [Google Gemini](https://developers.google.com/gemini)
- [Qloo Taste AI](https://qloo.com/)
- Optional: [OpenWeather API](https://openweathermap.org/) for weather-based day planning

## 📡 Installation & Setup

1. Clone the repo

2. Set up your environment variables:

   ```bash
   cp .env.example .env

   # Add your API keys:
   # - QLOO_API_KEY
   # - QLOO_API_URL
   # - GEMINI_API_KEY
   ```

3. Install dependencies and run:
   ```bash
   pnpm install
   pnpm dev
   ```

## 🧠 Inspiration

We wanted to reimagine how people travel — not by search trends or tourist traps, but by what they actually love. Our inspiration came from the question:

_"What if you could plan a trip based on your taste in music, books, and style — instead of Tripadvisor rankings?"_

**With Qloo's cultural graph and modern LLMs, that vision became real.**

## ⚙️ How I Built It

Built entirely in Next.js using Vercel AI SDK to interface directly with Google Gemini

Custom prompts parse user taste input and call the Qloo API for culturally-aligned discovery

Results are synthesized into a structured itinerary based on user intent and taste

## ❗ Challenges We Ran Into

- Tuning prompts to extract structured cultural preferences from freeform input

- Mapping broad Qloo recommendations into localized, day-by-day suggestions

- Handling edge cases where user tastes or destinations lacked direct Qloo matches

- Designing a frontend that feels personal, smart, and easy to use

## ✅ Accomplishments That I'm Proud Of

Designed a taste-first travel planning experience using just frontend and LLMs

Integrated real cultural intelligence from Qloo into a production-grade app

Delivered a complete end-to-end travel planner powered by AI and taste graphs

Created a UX that helps users feel seen — not just served generic suggestions

## 📚 What I Learned

- How to design LLM prompts that reflect taste, mood, and personality

- How Qloo’s API works across domains (e.g. music to food to neighborhoods)

- Why simplicity in architecture (LLM + frontend) can outperform full backend systems for certain flows

- How to fuse design + data for culturally meaningful results

## 🔮 What's Next for Appmuseme

- 👫 Group trip planning (merge tastes from multiple users)

- 🧳 Taste-based destination suggestions: “Where should I go based on who I am?”

- 🌐 Add neighborhood intelligence with Mapbox or Google Places

- 📱 Launch iOS/Android PWA version

- 💼 Explore partnerships with travel apps or cultural brands

## 🔧 Troubleshooting

### Common Issues

Qloo API returning empty results:

- Check that QLOO_API_KEY and QLOO_API_URL are correct

- Confirm that your taste terms exist within Qloo’s domain taxonomy

Gemini failing to return structured results:

- Review and refine your system prompt

- Ensure inputs are clearly separating destination, tastes, and mood

### Getting Help

1. Review prompt logs (if debugging is enabled)

1. Check browser console logs for API response issues

1. Ensure API keys are valid and active

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
