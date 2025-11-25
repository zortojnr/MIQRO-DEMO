# MIQRO — Education Monitoring MVP

MIQRO helps schools and governments monitor teaching, track student progress, and generate monthly impact reports.

## Features
- Teacher audio upload (.mp3/.wav/.m4a)
- Automatic attendance on audio upload
- AI lesson analysis (Whisper transcript + GPT summary/feedback)
- Daily teacher feedback view
- Student work uploads (images/videos)
- Monthly reports (Teacher, Student Progress, Impact)
- Role-based dashboards for Teachers, Admin, Government

## Tech Stack
- Next.js 14 (App Router)
- TailwindCSS
- Prisma ORM + MySQL (PlanetScale or standard MySQL)
- NextAuth.js (Credentials Provider)
- OpenAI (Whisper + GPT-4o-mini)
- Shadcn-style UI primitives

## Requirements
- Node.js 18+
- A MySQL-compatible database (`DATABASE_URL`)
- OpenAI API key

## Environment Variables
Create `.env.local` with:
```
DATABASE_URL="mysql://user:pass@host:port/db"
NEXTAUTH_SECRET="generated-secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
# Optional (for S3 production storage)
S3_BUCKET="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."
```

## Install & Bootstrap
```
npm install
npm run prisma:generate
npm run prisma:push
```

## Development
```
npm run dev
# open http://localhost:3000
```

## Build & Start
```
npm run build
npm start
```

## File Storage
- Development: files are saved to `public/uploads/audio` and `public/uploads/student-work`.
- Production: switch to S3 by replacing local writes in upload APIs with S3 uploads and set S3 env vars.

## Authentication & Roles
- NextAuth Credentials with bcrypt password hashing.
- Role-based redirects via middleware:
  - teacher → `/teacher/dashboard`
  - admin → `/admin/dashboard`
  - gov → `/gov/dashboard`

## Route Map
- Teacher: `/teacher/dashboard`, `/teacher/upload-audio`, `/teacher/upload-student`, `/teacher/feedback`
- Admin: `/admin/dashboard`, `/admin/teachers`, `/admin/student-work`, `/admin/reports`
- Government: `/gov/dashboard`, `/gov/reports`
- APIs: `/api/upload-audio`, `/api/upload-student`, `/api/process-audio`, `/api/generate-reports`, `/api/reports/[id]/teacher|student|impact`, `/api/cron/monthly`

## AI Analysis Workflow
1. Teacher uploads audio via `/api/upload-audio`.
2. Attendance is marked present automatically.
3. Call `/api/process-audio` with `{ audioId }`.
4. Whisper transcribes; GPT-4o-mini analyzes and returns JSON:
```
{
  "syllabus_match": boolean,
  "repetition_detected": boolean,
  "strengths": string[],
  "improvements": string[],
  "summary": string,
  "feedback": string
}
```
5. Result saved to `LessonAnalysis`; teacher sees feedback at `/teacher/feedback`.

## Monthly Reports & Scheduling
- Generate via `POST /api/generate-reports` with `{ schoolId, month: "YYYY-MM" }`.
- Download via `/api/reports/[id]/teacher|student|impact`.
- Cron: `vercel.json` schedules `/api/cron/monthly` on the 1st of each month; or use an external cron hitting that endpoint.

## Database Schema (Prisma)
Models: `User`, `ClassAudio`, `Attendance`, `LessonAnalysis`, `StudentWork`, `MonthlyReport` (see `prisma/schema.prisma`).

## Security Notes
- Passwords hashed with bcrypt.
- Validate file types and sizes; avoid exposing transcripts publicly.
- Keep secrets in environment variables; do not commit `.env` files.

## Troubleshooting
- Dev-mode aborted prefetch logs (`net::ERR_ABORTED`) are normal with Next.js App Router.
- Ensure `DATABASE_URL`, `OPENAI_API_KEY`, and `NEXTAUTH_SECRET` are set before running analysis/auth flows.
- If using PlanetScale, `relationMode = "prisma"` is configured in `schema.prisma`.

## License
Proprietary — internal MVP demo.
