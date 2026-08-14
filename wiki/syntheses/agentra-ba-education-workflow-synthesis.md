# Synthesis: Agentra BA Education Workflow

Agentra có thể được hiểu như một hệ thống workflow giáo dục được dẫn dắt bởi Business Analysis, không chỉ là một nền tảng AI tạo nội dung.

## Luận điểm chính

[[agentra]] tạo giá trị khi kết hợp ba lớp:

1. **Education workflow**: giáo viên, học sinh, phụ huynh và quản lý học thuật có các quy trình thực tế cần cải thiện.
2. **AI drafting**: AI tạo nháp slide, quiz, lesson plan, question bank hoặc tài liệu học thuật.
3. **BA governance**: [[business-analysis-toolkit]] cung cấp traceability, approval rules, acceptance criteria, risk controls và feedback loops.

## Kết nối sản phẩm

| Sản phẩm | Vai trò trong hệ sinh thái | BA lens |
|---|---|---|
| [[agentra]] | Nền tảng workflow AI giáo dục | Process Modeling + Business Rules |
| [[eduflow]] | Soạn bài STEM từ ma trận | Requirements Traceability + Acceptance Criteria |
| [[openedu]] | Luyện tập mở, riêng tư | Non-Functional Requirements + Data Quality |
| [[business-analysis-toolkit]] | Phương pháp luận | Stakeholder, Risk, Process, Traceability |

## Mẫu workflow chung

```text
Need
-> structured input
-> AI draft or practice artifact
-> human review / community quality loop
-> approved or corrected output
-> export/use
-> performance feedback
```

## Điểm khác biệt chiến lược

Agentra nên tránh định vị là "AI viết giáo án" hoặc "AI chatbot cho giáo dục". Định vị mạnh hơn là:

> Human-approved AI workflows for education documents and practice systems.

Trong tiếng Việt:

> Workflow AI có kiểm duyệt cho tài liệu giáo dục và hệ thống luyện tập.

## Content implications

Các content themes mạnh nhất:

- [[draft-review-approve-export]]: AI tạo nháp, con người duyệt, file xuất sẵn.
- [[curriculum-traceability]]: từ chương trình đến bài giảng, quiz và artifact.
- [[human-approval-business-rule]]: human approval là rule, không phải tùy chọn.
- [[privacy-first-open-practice]]: OpenEdu biến privacy thành yêu cầu sản phẩm.
- [[education-document-automation]]: tự động hóa tài liệu học thuật, không chỉ tạo text.

## Product implications

Product backlog nên ưu tiên:

1. EduFlow matrix-to-lesson generation.
2. STEM diagram rendering.
3. Teacher review workflow.
4. OpenEdu no-login practice.
5. OpenEdu question quality reporting.
6. Agentra export-ready document generation.

## Nguồn

- [Nguồn: Agentra BA Content Bridge](../sources/source-agentra-ba-content-bridge.md)
- [Nguồn: EduFlow Whitepaper](../sources/source-eduflow-whitepaper.md)
- [Nguồn: OpenEdu Whitepaper](../sources/source-openedu-whitepaper.md)
- [Nguồn: Agentra Content System](../sources/source-agentra-content-system.md)

