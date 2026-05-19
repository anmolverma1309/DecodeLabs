# AI Recommendation Logic Engine

This project is a full-stack AI Recommendation System built for the DecodeLabs Week 3 project. It demonstrates how to build a personalized content recommendation engine using Next.js, MongoDB, and a hybrid recommendation algorithm (Content-Based + Collaborative Filtering concepts).

## Features

- **Dynamic Recommendation Engine**: Uses Jaccard Similarity and custom weighting based on user interaction history to score and rank content.
- **Personalized Onboarding**: Users select initial preferences which form the baseline for their recommendation profile.
- **Adaptive Learning**: As users interact with items (View, Like, Dislike, Favorite), the algorithm dynamically adjusts their preference profile weights.
- **Interactive Dashboard**: Modern, glassmorphism-inspired UI built with Tailwind CSS, shadcn/ui, and Framer Motion for smooth animations.
- **Admin Analytics Panel**: Visualizes user interaction metrics and platform data using Recharts.
- **Authentication**: Secure credential-based authentication using NextAuth.js and bcrypt.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB & Mongoose
- **Styling**: Tailwind CSS v4, shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas)

### Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd d:\internship\DecodeLabs\week-3\ai-recommendation-logic
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory based on `.env.example`:
   ```env
   MONGODB_URI="mongodb://localhost:27017/ai_recommendations"
   NEXTAUTH_SECRET="your_secure_random_string"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Seed the Database**:
   Populate the database with sample items, a demo user, and initial interactions:
   ```bash
   npm run build # if using TS compiler, but usually ts-node is better.
   # For Next.js, you can run the seed script directly if you have ts-node installed globally,
   # or run the following command to execute the seed script using node:
   npx tsx utils/seed.ts
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

6. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   - **Demo User Login**: `demo@example.com` / `password`

## API Documentation

### `/api/recommendations` (GET)
Returns a list of personalized recommendations for the authenticated user.
- **Query Params**: `limit` (optional, default 10)
- **Response**: Array of `ScoredItem` objects.

### `/api/interactions` (POST)
Records a user interaction with an item.
- **Body**: `{ itemId: string, type: 'VIEW' | 'LIKE' | 'DISLIKE' | 'FAVORITE', weight: number }`

### `/api/users` (PUT)
Updates the authenticated user's profile (e.g., preferences).
- **Body**: `{ preferences: string[] }`

### `/api/items` (GET, POST)
Fetches or creates items in the catalog.

## Architecture & Algorithm

The recommendation engine uses a hybrid scoring system:
1. **Base Profile**: User's explicitly chosen tags get a high initial weight.
2. **Interaction Adjustments**: Actions like 'LIKE' increase the weight of an item's tags in the user's effective profile.
3. **Scoring**: Items are scored using **Jaccard Similarity** against the effective profile, plus boosts for overall item rating and popularity.
4. **Decay/Penalties**: Previously interacted items receive a penalty to encourage new content discovery.
