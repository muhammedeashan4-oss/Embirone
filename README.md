
# Embrione — Team Onboarding & Moderation System

A web-based platform for team registration, application review, and public team discovery, built using Next.js and Supabase.

## Features

- Member registration with 11 fields
- Live profile preview
- Profile photo upload and WebP conversion
- Admin authentication
- Registration approval and rejection workflow
- Public directory of approved team members
- Search and filtering
- Supabase database and storage integration
- Responsive user interface

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
| `/register` | Register as a team member |
| `/admin` | Review and moderate applications |
| `/team` | Browse approved team members |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/embrione-onboarding-system.git
cd embrione-onboarding-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key



### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Security

- Keep private keys and credentials out of the repository.
- Protect database access with Supabase Row Level Security.
- Restrict moderation actions to authorized administrators.
- Expose only approved member profiles publicly.

## Deployment

Deploy the application using Vercel and configure the required environment variables in the project settings.

## Author

YOUR NAME

## License

This project was developed as part of a recruitment challenge.
