## Current State
- No existing Next.js/Tailwind/Prisma/NextAuth files detected; we will bootstrap a fresh project.

## Foundation Setup
- Initialize a Next.js 14 App Router project and set up `app/` directory.
- Add dependencies: `next`, `react`, `tailwindcss`, `postcss`, `autoprefixer`, `@prisma/client`, `prisma`, `next-auth`, `bcrypt`, `zod`, `@aws-sdk/client-s3`, `openai`, `lucide-react`, `@radix-ui/react-*`.
- Configure Tailwind (`tailwind.config.js`, `postcss.config.js`) and global CSS with `@tailwind` directives.
- Install Shadcn/UI and scaffold base components (button, input, card, table, dialog, toast, sidebar).
- Establish `.env` with `DATABASE_URL`, `NEXTAUTH_SECRET`, `OPENAI_API_KEY`, `S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`.

## Database & Prisma
- Use PlanetScale (preferred) or standard MySQL; set Prisma `datasource` to MySQL and `relationMode = "prisma"` for PlanetScale.
- Implement models: `User`, `ClassAudio`, `Attendance`, `LessonAnalysis`, `StudentWork`, `MonthlyReport` exactly as specified, plus helpful indexes on `teacherId`, `date`, `schoolId`.
- Generate Prisma client; for dev use `prisma db push`; for production use `prisma migrate deploy` (PlanetScale with a shadow DB if needed).

## Authentication & Authorization
- Use NextAuth Credentials Provider with bcrypt password hashing.
- Add `app/api/auth/[...nextauth]/route.ts` with callbacks to include `role` and `schoolId` in session token.
- Create `middleware.ts` to protect role-based routes and enforce redirects:
  - `teacher` → `/teacher/dashboard`
  - `admin` → `/admin/dashboard`
  - `gov` → `/gov/dashboard`
- Build login page and a lightweight user seeding utility for initial accounts.

## File Storage
- Development: store uploads under `public/uploads/audio` and `public/uploads/student-work`.
- Production: upload to S3 via server-side route; store `audioUrl`/`fileUrl` in MySQL.
- Enforce file type/size limits: audio (`.mp3/.wav/.m4a`), images (`.jpg/.png`), video (`.mp4`).

## AI Analysis Workflow
- Create `app/api/process-audio/route.ts`:
  - Accept `audioId`/file reference; mark attendance (`status: present`).
  - Transcribe with Whisper (`openai.audio.transcriptions.create`).
  - Analyze transcript with GPT-4o-mini (or GPT-5) using a deterministic JSON prompt returning:
    `{ syllabus_match, repetition_detected, strengths[], improvements[], summary, feedback }`.
  - Persist to `LessonAnalysis` linked to `User` and `ClassAudio`.
- Add robust JSON parsing with fallback and store raw transcript for traceability.

## Monthly Reports & Cron
- Create `app/api/generate-reports/route.ts` to compute monthly aggregates:
  - Teacher Report: attendance, teaching quality, improvement trends, welfare eligibility.
  - Student Progress Report: uploads, evidence, learning summaries.
  - Impact Report: school-wide improvement, curriculum suggestions, trend metrics.
- Store reports in `MonthlyReport` as JSON; provide download endpoints returning JSON and simple printable HTML.
- Schedule via Vercel Cron or external cron hitting the API monthly.

## Dashboards & Pages (App Router)
- Teacher: `/teacher/dashboard`, `/teacher/upload-audio`, `/teacher/upload-student`, `/teacher/feedback`.
- Admin: `/admin/dashboard`, `/admin/teachers`, `/admin/reports`, `/admin/student-work`.
- Government: `/gov/dashboard`, `/gov/reports`.
- Use Shadcn components for a professional layout with sidebar navigation and KPI cards.

## Access Control & Data Fetching
- Server components fetch with Prisma using `getServerSession` for role checks.
- Shared utilities under `lib/db` (Prisma client), `lib/auth` (NextAuth config), `lib/ai` (OpenAI helpers).

## Validation, Observability, and UX
- Input validation with Zod in forms and API routes; friendly error toasts.
- Basic request logging; guardrails for timeouts and rate limits on AI endpoints.
- Progress indicators on uploads; success/failure states; accessible forms.

## Testing & Verification
- Seed dev data; manually verify flows: auth, audio upload, AI analysis, feedback, student work.
- Add unit tests for auth callbacks and AI JSON parsing; integration tests for `/api/process-audio` happy-path.

## Deployment
- Host on Vercel; database on PlanetScale; S3 for storage.
- Configure environment variables in Vercel; set Vercel Cron for monthly report generation.
- Add minimal `README` for environment setup (if requested).

## Security & Compliance
- Hash passwords with bcrypt; never store plaintext.
- Validate file types; restrict sizes; scan uploads optionally.
- Protect API routes by role; avoid exposing transcripts publicly.
- Handle PII carefully; limit logs; use HTTPS-only URLs.

## Implementation Sequence
1) Bootstrap project + Tailwind + Shadcn.
2) Prisma schema + database connection.
3) NextAuth credentials + role-based middleware + login.
4) Upload routes (audio, student work) with local/S3 storage.
5) `/api/process-audio` Whisper + GPT analysis + attendance.
6) Teacher feedback UI wired to `LessonAnalysis`.
7) Admin dashboards for teachers, attendance, analysis, student work, reports.
8) Government dashboards for trends and impact summary.
9) `/api/generate-reports` + cron scheduling.
10) Tests, polish, deployment.

## Assumptions
- PlanetScale is available; otherwise switch to standard MySQL.
- GPT-4o-mini and Whisper API access are available.
- S3 credentials provisioned for production; local storage acceptable for MVP in dev.
