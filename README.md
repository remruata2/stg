# Standard Treatment Guidelines Wiki

A comprehensive wiki-style application for medical professionals to access evidence-based treatment guidelines. Built with Next.js 15, PostgreSQL, and Tailwind CSS.

## Features

- **Wikipedia-style Navigation**: Hierarchical browsing through categories and guidelines
- **Markdown Support**: Guidelines content uses Markdown for rich formatting
- **Tag System**: Organize and find guidelines by relevant tags
- **Revision History**: Tracks changes to guidelines over time
- **Search Functionality**: Allows users to search across all content
- **References Section**: Provides citations and external links for each guideline
- **Toast Notifications**: User-friendly feedback for important actions

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Setup

This project uses PostgreSQL with Prisma ORM. To set up the database:

1. Create a PostgreSQL database
2. Copy the `.env.example` file to `.env` and update the `DATABASE_URL` with your database connection string
3. Run the following commands to set up the database schema and seed initial data:

```bash
npx prisma migrate dev
npx prisma generate
npm run prisma:seed
```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://username:password@localhost:5432/stg_wiki`)
- `NEXTAUTH_SECRET`: A secret key for JWT encryption (you can generate one with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: The base URL of your application (e.g., `http://localhost:3000`)

Store these in a `.env` file at the root of the project (this file is gitignored for security).

## Authentication

This application uses NextAuth.js for authentication. Only administrators can create, edit, or delete content. The database is seeded with an admin user:

- Email: `admin@stgwiki.com`
- Password: `Admin@123`

You can use these credentials to log in to the admin dashboard at `/auth/login`.
# stg
