# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This is a multi-project workspace with two active projects:

| Directory | Type | Purpose |
|-----------|------|---------|
| `SolSQLD/` | React + TypeScript (Vite) | SQLD exam prep & SQL practice platform |
| `크롤링/` | Python | Web scraper for Korean AI/tech industry company data |
| `PML/` | — | Empty placeholder |

---

## SolSQLD

### Commands

```bash
cd SolSQLD
npm run dev       # Dev server at localhost:3000
npm run build     # Type-check + production build
npm run preview   # Serve production build locally
```

### Architecture

Client-only React app (no backend). Data is entirely mocked — `src/data/mockExam.ts` holds 50 SQLD exam questions.

**Routing (React Router v6):**
- `/` → `MainPage` (landing)
- `/dashboard` → `DashboardPage` (analytics with Recharts)
- `/exams` → `ExamListPage` → `/exams/:id` → `ExamTakingPage` → `/exams/:id/result` → `ExamResultPage`
- `/practice` → `SQLPracticeListPage` → `/practice/:id` → `SQLPracticePage`

**State:** `AuthContext` (`src/contexts/AuthContext.tsx`) is the only global state — handles user session and points.

**Key design constraints:**
- The exam-taking page (`ExamTakingPage`) uses a strict **A4 layout (794px × 1123px)** defined in `tailwind.config.js` (`w-a4`, `h-a4`) and `src/styles/index.css`. This is the highest-priority layout constraint.
- TypeScript strict mode is enabled — all types live in `src/types/index.ts`.
- Path alias `@/*` maps to `src/*`.

**Event logging:** `src/utils/eventLogger.ts` defines 11 event types that must fire at specific UI interactions:
- `user_signup`, `user_login`, `user_first_visit`
- `sql_execute`, `sql_submit`
- `choice_select`, `exam_start`, `exam_submit`
- `notepad_update`, `points_update`, `stats_update`

Every component event handler must call the corresponding logger. Correct answers award +10 points via `points_update`.

**Data model (ERD):** `User`, `Problem`, `Submission`, `Exam`, `ExamSession` — defined in `src/types/index.ts`. State management should mirror this structure.

---

## 크롤링

### Commands

```bash
pip install pandas numpy requests beautifulsoup4 pyarrow python-dateutil

python 크롤링/crawling.py           # Batch scrape company names & homepages
python 크롤링/email_collector.py    # Extract emails from collected homepages
python 크롤링/recrawl.py            # Re-scrape failed/incomplete entries
jupyter notebook                     # Interactive analysis via data/*.ipynb
```

### Architecture

Three-stage pipeline: `crawling.py` → `email_collector.py` → Jupyter notebooks for analysis.

Target associations (25+ domains) are configured in `크롤링/targets.json`.

Output CSVs in `크롤링/data/`: `company_list.csv` → `company_emails.csv` → `company_list_final.csv`.

**Mandatory compliance rules (legal requirement):**
- Always validate `robots.txt` before crawling any domain.
- Before extracting emails, scan page content for Korean refusal keywords (`무단수집거부`, `이메일무단수집`, `Collection Refusal`). If found, log status as `Refused` and skip — **never collect from these pages** (Article 50-2 of the Information and Communications Network Act).
- Use `time.sleep(random.uniform(1, 3))` between all requests.
- Randomize `User-Agent` headers on every request.

**Email extraction status codes:** `Success`, `Refused`, `No_Email`, `Connection_Error`, `Blocked_robots`, `Invalid_URL`.

**Code style:** `snake_case` for all identifiers, `typing` hints required, Python 3.7 compatibility.

All activity is logged to `crawling.log` and `email_collector.log`.
