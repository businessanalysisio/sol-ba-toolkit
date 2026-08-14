# OpenEdu Content Database Structure

Use this structure in Notion, Airtable, Google Sheets, or a simple markdown-backed content tracker.

## Database: Content Pipeline

| Field | Type | Purpose |
|---|---|---|
| Content ID | Text | Unique ID, e.g. `OE-BLOG-001`, `OE-FB-001` |
| Campaign | Select | Launch, Privacy, Parent Trust, Teacher Support, Community, Curriculum |
| Source Insight | Long text | Research signal, audience phrase, objection, or community request |
| Audience Persona | Select | Student, Parent, Teacher, School Leader, Contributor |
| Pain Point | Long text | Specific barrier or concern |
| Topic | Text | Main topic |
| Content Idea | Long text | Proposed angle |
| Hook Type | Select | Privacy, Access, Trust, Number, Community, Curriculum |
| Hook | Text | Final selected hook |
| Format | Select | Blog, Facebook, LinkedIn, Carousel, Reel, Newsletter, Guide |
| Funnel Stage | Select | Awareness, Trust, Use, Contribute |
| Draft Status | Select | Idea, Briefed, Drafted, Rewritten, Approved, Scheduled, Published |
| Reviewer | Text | Olivia or assigned reviewer |
| Channel | Select | Website, Facebook, LinkedIn, YouTube, Community, Newsletter |
| CTA | Text | Practice, Read, Share, Report Error, Suggest Topic, Contribute |
| Publish Date | Date | Scheduled date |
| Reach | Number | Views/impressions |
| Clicks | Number | Website or practice clicks |
| Practice Starts | Number | Sessions started from content |
| Shares | Number | Share count |
| Comments | Number | Comments/replies |
| Reported Issues | Number | Question/content issues reported |
| Learning | Long text | What worked or failed |
| Next Action | Select | Repeat, Rewrite, Repurpose, Stop, Test Again |

## Database: Question Quality Signals

| Field | Type | Purpose |
|---|---|---|
| Signal ID | Text | Unique ID, e.g. `OE-QA-001` |
| Question ID | Text | Linked question if available |
| Subject | Select | Math, Vietnamese/Literature, Physics, Chemistry, Informatics |
| Grade | Select | Grade 1-12 |
| Topic | Text | Curriculum topic |
| Issue Type | Select | Wrong Answer, Ambiguous Wording, Formatting, Not Aligned, Duplicate, Missing Explanation |
| Reported By | Text | Optional, only if contributor chooses to share |
| Report Date | Date | Date received |
| Status | Select | New, Reviewing, Fixed, Rejected, Needs Expert Review |
| Reviewer Notes | Long text | Review decision |
| Fix Summary | Long text | What changed |

## Database: Community Contributions

| Field | Type | Purpose |
|---|---|---|
| Contribution ID | Text | Unique ID, e.g. `OE-CONTRIB-001` |
| Contributor Type | Select | Teacher, Parent, Student, Developer, Reviewer |
| Contribution Type | Select | Question, Correction, Topic Request, Translation, Code, Design, Documentation |
| Subject | Select | Math, Vietnamese/Literature, Physics, Chemistry, Informatics, General |
| Grade | Select | Grade 1-12, General |
| Description | Long text | Contribution summary |
| Status | Select | Submitted, Reviewing, Accepted, Needs Revision, Rejected, Published |
| Reviewer | Text | Assigned reviewer |
| Notes | Long text | Review or publication notes |

