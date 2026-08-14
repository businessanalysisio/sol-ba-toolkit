# OpenEdu Use Case Brief

## 1. Use Case Name

Privacy-First No-Login Student Practice

## 2. Product Area

OpenEdu

## 3. Primary Persona

Student

Secondary personas:

- Parent
- Teacher
- Community Contributor

## 4. Problem Statement

Students need quick access to curriculum-aligned practice questions, but many learning platforms require account registration and personal data collection before use. This creates access friction and privacy concerns for parents, teachers, and schools.

## 5. Current Workflow

1. Student wants to practice a topic.
2. Student searches online.
3. Platform asks for account registration.
4. Student or parent enters personal data.
5. Student navigates to content.
6. Content may or may not align with GDPT 2018.
7. Progress is stored on a central platform profile.

## 6. Pain Points

- Account creation slows down quick practice.
- Parents worry about student data collection.
- Teachers cannot easily trust random question sources.
- Students need topic-based practice, not full course enrollment.
- Question accuracy may be inconsistent.
- There is often no transparent issue-reporting mechanism.

## 7. Future Workflow

1. Student opens OpenEdu.
2. Student selects grade.
3. Student selects subject.
4. Student selects topic.
5. Student practices immediately.
6. Progress is stored locally on the browser.
7. Parent or teacher can guide follow-up.
8. Community can report question issues or suggest topics.

## 8. Technology Role

OpenEdu provides:

- grade/subject/topic navigation
- curriculum-aligned question bank
- answer checking
- local progress storage
- issue reporting
- open-format content structure

## 9. Human Guidance Role

Teachers and parents remain responsible for:

- explanation
- feedback
- motivation
- learning strategy
- reviewing difficult topics
- reporting content issues

## 10. Exportable Artifact

- Browser-based practice session
- Local progress state
- QIF/open question format
- Issue report record
- Topic request record

## 11. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| OE-FR-001 | Student can practice without login | Must |
| OE-FR-002 | Student can select grade, subject, and topic | Must |
| OE-FR-003 | System displays questions and answer choices | Must |
| OE-FR-004 | System checks answers | Must |
| OE-FR-005 | System stores progress locally in browser | Must |
| OE-FR-006 | User can report a question issue | Should |
| OE-FR-007 | Community can suggest new topics | Should |
| OE-FR-008 | Question bank supports open format such as QIF | Should |

## 12. Non-Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| OE-NFR-001 | No personal data collection is required for practice | Must |
| OE-NFR-002 | No login is required for practice | Must |
| OE-NFR-003 | Progress data remains local to the browser | Must |
| OE-NFR-004 | Content should align with GDPT 2018 | Must |
| OE-NFR-005 | Interface should be simple for students | Must |
| OE-NFR-006 | Privacy model must be explained clearly | Must |

## 13. Acceptance Criteria

- A student can start a practice session without creating an account.
- The platform does not require email, phone number, or student profile.
- Progress is saved locally and not sent to a central user profile.
- Questions are organized by grade, subject, and topic.
- Users can understand the privacy model from public documentation.
- OpenEdu clearly states that it supports practice and does not replace teachers or parents.

## 14. Risks And Controls

| Risk | Control |
|---|---|
| Users misunderstand local storage | Explain privacy trade-off clearly |
| Question contains an error | Add issue reporting and review workflow |
| Parents expect full tutoring | Position OpenEdu as practice support |
| No login reduces sync convenience | Communicate privacy-first trade-off |
| Content becomes outdated | Maintain content review and contribution process |

## 15. Success Metrics

- Practice starts
- Completed practice sessions
- Return usage on same browser
- Question issue reports
- Fixed question issues
- Topic suggestions
- Parent/teacher trust feedback
- Content coverage by grade and subject

## 16. Content Angles

- Why OpenEdu does not ask students to log in
- Practice first, account never
- Privacy-first learning as a product requirement
- How teachers can use OpenEdu without replacing their role
- Why local storage is a deliberate privacy choice
- How community reporting improves question quality

