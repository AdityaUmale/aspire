This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Variables

Create a `.env` file with the values below before running the app locally:

```bash
MONGODB_URI=...
JWT_SECRET=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
ADMIN_NAME=...
BLOB_READ_WRITE_TOKEN=...
OPENAI_API_KEY=...
OPENAI_VISION_MODEL=gpt-5-mini
```

`BLOB_READ_WRITE_TOKEN` is used to store uploaded images, including admin schedule posters.

`OPENAI_API_KEY` and `OPENAI_VISION_MODEL` are used by the admin poster-import flow that extracts upcoming course rows from uploaded schedule images.

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

## Admin Poster Import Flow

The admin dashboard now supports a review-first upcoming course import flow:

1. Open `/admin/courses`.
2. Upload a schedule poster image.
3. The app uploads the image, sends it to OpenAI vision, and returns editable draft rows.
4. Review the extracted rows, update any titles, dates, times, or descriptions, remove bad rows, and save only the selected items.

The parser is instructed to avoid inventing rows and to prefer omission plus low confidence over guessing. Imported cards are saved as upcoming course entries and rendered on the homepage with an enquiry CTA.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
