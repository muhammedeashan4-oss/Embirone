
# Embrione — Team Onboarding & Moderation System

A full-stack platform for team registration, application moderation, and public team discovery, built for the Embrione recruitment challenge.

## Features

- Member registration with 11 fields
- Live profile preview
- Client-side profile photo conversion to WebP
- Supabase Storage photo uploads
- Admin authentication
- Application approval and rejection workflow
- Public directory of approved members
- Domain and position filtering
- Responsive user interface
- Supabase database integration

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/register` | Register as a team member |
| `/admin` | Review and moderate applications |
| `/team` | Browse approved team members |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/muhammedeashan4-oss/Embirone.git
cd Embirone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root with your Supabase project URL and public anonymous key:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholders with the corresponding values from your Supabase project settings. Never commit `.env.local` or expose your Supabase service-role key.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create a production build

```bash
npm run build
```

## Supabase Setup

Configure the `members` table, the `admins` table, appropriate Row Level Security policies, and the `member-photos` Storage bucket in your Supabase project.

Ensure that only approved member profiles are publicly readable and that moderation actions are restricted to authorized administrators.

## Deployment

Deploy the project through [Vercel](https://vercel.com/). Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the project's environment variables before deploying.

## Author

Muhammed Eashan

## License

Developed as part of the Embrione recruitment challenge.
