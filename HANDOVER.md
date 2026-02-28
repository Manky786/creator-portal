# Creator Portal - Project Handover Document

## Project Overview
STAGE Creator Portal - A web application for managing creator submissions and content pipeline.

**Tech Stack:**
- Frontend: Next.js 16.1.6 + React 19 + Tailwind CSS 4
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- Export: XLSX library for Excel exports

---

## 1. Repository Access

**GitHub Repository:** https://github.com/Manky786/creator-portal.git

```bash
# Clone the repository
git clone https://github.com/Manky786/creator-portal.git
cd creator-portal

# Install dependencies
npm install
```

---

## 2. Environment Variables

Create `.env.local` file in project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vkzuybzepymofidhufbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrenV5YnplcHltb2ZpZGh1ZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODE2ODIsImV4cCI6MjA4NTc1NzY4Mn0.qbxN4lq9q8mdsNqD7XC4_MJqk67qBRh2oKvRztUG30Y
```

**Note:** For production, also add `SUPABASE_SERVICE_ROLE_KEY` (get from Supabase Dashboard > Settings > API)

---

## 3. Supabase Dashboard Access

**Dashboard URL:** https://supabase.com/dashboard/project/vkzuybzepymofidhufbn

Share Supabase project access:
1. Go to Project Settings > Team
2. Invite colleague via email
3. Assign appropriate role

**Database Tables:**
- `pipeline_projects` - Pipeline management data
- `submissions` - Creator submission data (if exists)

**SQL Setup Files in `/supabase/` folder:**
- `pipeline_complete_setup.sql` - Complete table setup with sample data
- `add_missing_columns.sql` - For adding missing columns

---

## 4. Running the Project

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Local URL:** http://localhost:3000

---

## 5. Project Structure

```
creator-portal/
├── app/
│   ├── page.tsx              # Creator landing page (11-step form)
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard (Submissions + Pipeline tabs)
│   └── api/
│       └── pipeline/
│           ├── route.ts      # GET all, POST new project
│           └── [id]/
│               └── route.ts  # GET, PUT, DELETE single project
├── components/
│   └── PipelineManager.tsx   # Excel-like pipeline interface
├── lib/
│   └── supabase.ts           # Supabase client setup
└── supabase/
    └── *.sql                 # Database setup scripts
```

---

## 6. CRITICAL ISSUES TO FIX (Priority Order)

### P0 - Critical (Fix First)

#### 1. Dual Data Storage Problem
**Issue:** Creator form saves to localStorage, admin page uses hardcoded dummy data
**Location:** `app/page.tsx` (localStorage), `app/admin/page.tsx` (sampleSubmissions array)
**Fix:**
- Create `submissions` table in Supabase
- Update creator form to POST to `/api/submissions`
- Update admin page to fetch from API instead of using sampleSubmissions

#### 2. No Real Authentication
**Issue:** Hardcoded login credentials (`admin`/`admin123`, `creator`/`creator123`)
**Location:** `app/admin/page.tsx` lines 1-30 (approx)
**Fix:**
- Implement Supabase Auth
- Create proper login/signup flow
- Add role-based access control (admin vs creator)

### P1 - High Priority

#### 3. Missing Database Connection for Submissions
**Issue:** Submissions tab shows fake data, not connected to database
**Fix:** Create API routes similar to pipeline (`/api/submissions`)

#### 4. Pipeline Table Missing Columns
**Issue:** Some columns may be missing in Supabase (activity_log, genre, etc.)
**Fix:** Run `supabase/pipeline_complete_setup.sql` in SQL Editor

### P2 - Medium Priority

#### 5. No Image Upload for Budget Docs
**Issue:** Budget document upload mentioned but not implemented
**Fix:** Add Supabase Storage bucket for documents

#### 6. Error Handling Improvements
**Issue:** Generic error messages, no user-friendly feedback
**Fix:** Add toast notifications, better error states

---

## 7. Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Creator Form (11 steps) | ✅ Working | Saves to localStorage only |
| Admin Login | ⚠️ Hardcoded | Uses fake credentials |
| Submissions Tab | ⚠️ Fake Data | Uses hardcoded array |
| Pipeline Tab | ✅ Working | Connected to Supabase |
| Inline Editing | ✅ Working | In Pipeline Manager |
| Budget Breakdown Modal | ✅ Working | Shows JSONB data |
| Excel Export | ✅ Working | Downloads .xlsx |
| POC Tabs | ✅ Working | Filter by POC name |

---

## 8. Database Schema (pipeline_projects)

```sql
CREATE TABLE pipeline_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  creator TEXT,
  culture TEXT,
  format TEXT,
  total_budget DECIMAL(15,2) DEFAULT 0,
  budget_breakdown JSONB DEFAULT '{}',
  episodes INTEGER,
  duration TEXT,
  status TEXT DEFAULT 'pending',
  production_poc TEXT,
  production_poc_phone TEXT,
  production_poc_email TEXT,
  content_poc TEXT,
  content_poc_phone TEXT,
  content_poc_email TEXT,
  production_company TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 9. Deployment

**Current:** Not deployed (local development)

**Recommended:** Vercel (best for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard
```

---

## 10. Quick Start for IT Colleague

1. Clone repo: `git clone https://github.com/Manky786/creator-portal.git`
2. Install: `npm install`
3. Create `.env.local` with credentials above
4. Run: `npm run dev`
5. Open: http://localhost:3000
6. Admin login: `admin` / `admin123`

---

## 11. Contact

For questions about project context, contact Mayank.

---

*Document created: February 2026*
*Last working commit includes: Pipeline Manager, restored Submissions tab, 3 sample projects*
