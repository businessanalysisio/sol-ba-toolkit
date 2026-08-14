# Agentra Content Database Structure

Use Notion or Airtable as the operating database.

## Database: Content Pipeline

| Field | Type | Description |
|---|---|---|
| Content ID | Text | Unique ID, e.g. `AGT-LI-001`, `AGT-BLOG-001` |
| Source | Select | Reddit, LinkedIn, YouTube, Search, Competitor, Community, Internal |
| Research Insight | Long text | Market signal, quote, trend, or observation |
| Audience Persona | Select | Teacher, Lecturer, Academic Manager, Vice Dean, Operator |
| Pain Point | Long text | Specific audience problem |
| Topic | Text | Content theme |
| Content Idea | Long text | Proposed angle |
| Hook Type | Select | Problem, Promise, Curiosity, Number, Urgency |
| Hook | Text | Final selected hook |
| Format | Select | LinkedIn, Carousel, Reel, Blog, Newsletter, YouTube, Lead Magnet |
| Funnel Stage | Select | Awareness, Consideration, Conversion |
| Draft Status | Select | Idea, Briefed, Drafted, Rewritten, Approved, Scheduled, Published |
| Reviewer | Person/Text | Olivia or assigned reviewer |
| Channel | Select | LinkedIn, Instagram, Facebook, YouTube, Blog, Newsletter, Website |
| CTA | Text | Demo, download, comment, subscribe, book call |
| Lead Magnet | Text/Relation | Related offer |
| Publish Date | Date | Scheduled publish date |
| Reach | Number | Total impressions/views |
| Saves | Number | Saved/bookmarked count |
| Shares | Number | Share count |
| Clicks | Number | Link clicks |
| CTR | Number | Click-through rate |
| Leads | Number | Leads generated |
| Learning | Long text | What worked or failed |
| Next Action | Select | Repeat, Rewrite, Repurpose, Stop, Test Again |

## Database: Research Signals

| Field | Type | Description |
|---|---|---|
| Signal ID | Text | Unique ID, e.g. `SIG-001` |
| Source | Select | Reddit, X, YouTube, Instagram, Google, Competitor, Community |
| Raw Signal | Long text | Exact market language or observation |
| Audience | Select | Teacher, Lecturer, Academic Manager, Vice Dean, Operator |
| Pain Point | Long text | Problem extracted from signal |
| Objection | Long text | Concern about AI, workflow, trust, quality, privacy |
| Keyword | Text | Search phrase or recurring language |
| Frequency | Select | One-off, Repeated, Common, High-volume |
| Agentra Opportunity | Long text | How Agentra can respond |
| Content Potential | Select | Low, Medium, High |
| Added Date | Date | Date captured |

## Database: Lead Magnets

| Field | Type | Description |
|---|---|---|
| Lead Magnet ID | Text | Unique ID, e.g. `LM-001` |
| Title | Text | Name of offer |
| Persona | Select | Teacher, Lecturer, Academic Manager, Vice Dean, Operator |
| Problem Solved | Long text | Specific pain point |
| Format | Select | PDF, DOCX, XLSX, PPTX, Folder, Checklist, Template |
| Funnel Stage | Select | Awareness, Consideration, Conversion |
| Landing Page CTA | Text | Primary call to action |
| Follow-Up Sequence | Long text | Email sequence outline |
| Conversion Goal | Select | Newsletter Signup, Demo Request, Discovery Call, Trial |
| Status | Select | Idea, Drafting, Approved, Live, Retired |
| Performance Notes | Long text | Conversion learnings |

