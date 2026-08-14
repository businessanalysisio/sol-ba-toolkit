# Sol — Hướng dẫn sử dụng

**Second brain for business analysis** — biến kiến thức kinh doanh rời rạc thành quyết định có cấu trúc.

> Phiên bản tài liệu: 1.0 · Áp dụng cho bản build hiện tại (Next.js 15.2.8, React 19)
> Trạng thái sản phẩm: **demo / pre-launch**. Xem [§8 Giới hạn hiện tại](#8-giới-hạn-hiện-tại-cần-biết-trước-khi-dùng-thật) trước khi đưa vào công việc thật.

---

## Mục lục

1. [Sol là gì và dành cho ai](#1-sol-là-gì-và-dành-cho-ai)
2. [Cài đặt và khởi chạy](#2-cài-đặt-và-khởi-chạy)
3. [Đăng nhập](#3-đăng-nhập)
4. [Bản đồ sản phẩm](#4-bản-đồ-sản-phẩm)
5. [Trang công khai (marketing site)](#5-trang-công-khai-marketing-site)
6. [Bên trong ứng dụng (dashboard)](#6-bên-trong-ứng-dụng-dashboard)
7. [Cấu hình đầy đủ](#7-cấu-hình-đầy-đủ)
8. [Giới hạn hiện tại](#8-giới-hạn-hiện-tại-cần-biết-trước-khi-dùng-thật)
9. [Xử lý sự cố](#9-xử-lý-sự-cố)

---

## 1. Sol là gì và dành cho ai

Sol kết hợp **hai lớp giá trị** trong một sản phẩm:

| Lớp | Vai trò | Bạn nhận được gì |
|---|---|---|
| **EdTech** | Dạy tư duy phân tích kinh doanh có cấu trúc | 4 learning path theo persona, thư viện framework, thư viện nội dung từ 9 đầu sách BA |
| **Tooling** | Áp dụng ngay vào công việc thật | AI copilot, requirement register, decision brief builder, daily workflow, schema reference |

**Đối tượng mục tiêu:** business analyst, product manager, founder giai đoạn đầu, tech entrepreneur — những người cần tư duy BA có hệ thống nhưng không có background BABOK chính quy.

**Nguyên tắc thiết kế:** học một framework ở lớp EdTech → áp dụng ngay ở lớp Tooling trên chính công việc đang làm.

---

## 2. Cài đặt và khởi chạy

### Yêu cầu hệ thống

Khai báo trong `package.json`:

- **Node.js** ≥ 20.0.0
- **pnpm** ≥ 9.0.0

Kiểm tra:

```bash
node -v
pnpm -v
```

### Các bước

```bash
# 1. Vào thư mục dự án
cd BA-Toolkit-v0-main

# 2. Cài dependencies
pnpm install

# 3. Chạy dev server
pnpm dev
```

Sau khoảng 6–10 giây bạn sẽ thấy:

```
▲ Next.js 15.2.8
- Local:   http://localhost:3000
✓ Ready in 6.4s
```

Mở **http://localhost:3000**.

> **Lưu ý:** khi cài đặt, pnpm sẽ cảnh báo `Ignored build scripts: sharp`. Đây là cảnh báo bình thường, không ảnh hưởng đến việc chạy app. Nếu muốn xử lý triệt để, chạy `pnpm approve-builds`.

### Các lệnh khác

| Lệnh | Tác dụng |
|---|---|
| `pnpm dev` | Chạy dev server (hot reload) |
| `pnpm build` | Build bản production |
| `pnpm start` | Chạy bản production đã build |
| `pnpm typecheck` | Kiểm tra TypeScript, không xuất file |
| `pnpm check` | Chạy `typecheck` rồi `build` — dùng trước khi commit |

---

## 3. Đăng nhập

Sol có hai chế độ đăng nhập, tự động chuyển đổi tuỳ theo bạn đã cấu hình Supabase hay chưa.

### Chế độ Demo (mặc định — khi chưa có Supabase)

Nếu chưa khai báo `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`, trang `/login` sẽ hiện thông báo:

> *Demo mode: Supabase isn't configured, so any credentials will take you straight to the sample dashboard.*

Khi đó **mọi thông tin đăng nhập đều được chấp nhận**:

- **Email:** bất kỳ chuỗi nào đúng định dạng email — ví dụ `demo@sol.app`
- **Password:** bất kỳ chuỗi nào **từ 6 ký tự trở lên** — ví dụ `demo123`

Hệ thống bỏ qua hoàn toàn bước xác thực, ghi một user giả (`id: "demo-user"`, role `Business Analyst`) vào `localStorage` của trình duyệt, rồi chuyển tới `/dashboard`. Không có dữ liệu nào được gửi đi đâu cả.

Ràng buộc duy nhất là validation của trình duyệt: trường password có `required` và `minLength={6}`.

### Chế độ thật (khi đã cấu hình Supabase)

Khi đã có key Supabase hợp lệ, nhánh demo ngừng hoạt động và bạn cần **tài khoản thật**. Form hỗ trợ cả đăng ký (sign up) lẫn đăng nhập (sign in). Xem [§7 Cấu hình đầy đủ](#7-cấu-hình-đầy-đủ).

### Đăng nhập nhanh

Truy cập thẳng `/dashboard` khi chưa đăng nhập sẽ tự động chuyển hướng về `/login`.

---

## 4. Bản đồ sản phẩm

Sol gồm hai vùng: **trang công khai** (bán hàng, học tập) và **dashboard** (làm việc).

```
TRANG CÔNG KHAI                     DASHBOARD (sau đăng nhập)
├─ /                 Landing        ├─ /dashboard              Home
├─ /paths            Learning paths ├─ /dashboard/ai-assistant AI Copilot
├─ /frameworks       Framework lib  ├─ /dashboard/ai-workspace AI Workspace
├─ /skills           Thư viện skill ├─ /dashboard/requirements Requirements
├─ /knowledge-base   Kiến thức      ├─ /dashboard/daily-workflow Daily workflow
├─ /brief-builder    Decision brief ├─ /dashboard/data-analysis Evidence analysis
├─ /workspaces/[id]  Workspace      └─ /dashboard/partners     Partners
├─ /partners         Đối tác
├─ /events/[id]      Sự kiện
└─ /login            Đăng nhập
```

---

## 5. Trang công khai (marketing site)

### 5.1 Trang chủ `/`

Cuộn từ trên xuống bạn sẽ gặp: Hero → Features → Learning paths → Frameworks → Testimonials → Pricing → FAQ → Footer (kèm form đăng ký newsletter).

**Bốn năng lực cốt lõi** giới thiệu ở mục Features:

| Năng lực | Mô tả | Chỉ số quảng bá |
|---|---|---|
| Knowledge capture | Biến ghi chú, bài báo, tài liệu BA thành các khái niệm liên kết, giữ nguyên ngữ cảnh nguồn | 4x faster retrieval |
| Analysis frameworks | Template có cấu trúc cho discovery, strategy, requirements, process design, validation | 30+ tools |
| AI insight synthesis | So sánh tín hiệu, phát hiện giả định ẩn, biến nghiên cứu rời rạc thành brief | Minutes to brief |
| Progress tracking | Lộ trình học theo vai trò, bản đồ kỹ năng theo thời gian thực | Live skill map |

> Các chỉ số này là **thông điệp marketing**, chưa phải số đo thực tế từ hệ thống.

### 5.2 Learning paths `/paths`

Bốn lộ trình, mỗi lộ trình gắn với một persona:

| Lộ trình | Cấp độ | Thời lượng | Dành cho | Module |
|---|---|---|---|---|
| **Founder Discovery System** | Foundation | 3 tuần | Startup founder | Problem framing · JTBD interviews · Opportunity sizing · MVP requirement cuts |
| **Product Requirements Mastery** | Applied | 4 tuần | Product manager | Stakeholder maps · User stories · Acceptance criteria · Traceability |
| **Business Analysis Consulting** | Advanced | 5 tuần | Business analyst | Elicitation · Current-state analysis · Future-state design · Executive synthesis |
| **Tech Operator Playbook** | Applied | 3 tuần | Tech entrepreneur | Process mapping · KPI trees · Root cause analysis · Automation backlog |

Mỗi thẻ có thanh tiến độ. **Lưu ý:** giá trị tiến độ hiện tại (42%, 64%, 28%, 53%) là dữ liệu mẫu cố định, chưa phản ánh tiến độ thật của bạn.

**Nên bắt đầu từ đâu:**
- Đang tìm product-market fit → *Founder Discovery System*
- Cần viết PRD tốt hơn → *Product Requirements Mastery*
- Muốn làm BA chuyên nghiệp/tư vấn → *Business Analysis Consulting*
- Đang vận hành và muốn tối ưu quy trình → *Tech Operator Playbook*

### 5.3 Framework library `/frameworks`

Kho các mô hình phân tích kinh điển. Bản build hiện tại ship **8 framework** trên lưới trang chủ:

SWOT · Porter's 5 Forces · Jobs To Be Done · MoSCoW · BPMN Lite · Kano Model · PESTLE · Traceability Matrix

Nhấp vào một framework để xem chi tiết. Mỗi framework mô tả ba điều — đây là cách dùng đúng của trang này:

1. **Signal** — dấu hiệu cho biết khi nào nên dùng framework này
2. **Use cases** — tình huống điển hình (ví dụ SWOT: market entry, product repositioning)
3. **Artifact** — sản phẩm đầu ra kỳ vọng (ví dụ SWOT → *one-page strategy brief*)

> Đừng chọn framework theo độ quen thuộc. Đọc **Signal** trước, chọn framework khớp với tình huống, rồi làm việc ngược từ **Artifact** bạn cần giao.

### 5.4 Thư viện nội dung `/skills`

Đây là tài sản lớn nhất của Sol mà giao diện chưa làm nổi bật: **662 file markdown, khoảng 125.000 từ**, chắt lọc từ 9 đầu sách BA:

| Nguồn | Số bài |
|---|---|
| The Personal MBA | 203 |
| Business Analysis Techniques | 96 |
| How to Start Your Own Business | 86 |
| BABOK Guide v3 | 84 |
| Seven Steps to Mastering Business Analysis | 40 |
| Business Analysis Handbook | 38 |
| Guide to Product Ownership Analysis | 36 |
| Introduction to Business Data Analytics | 36 |
| PMI Business Analysis for Practitioners | 32 |

Mỗi bài có `title`, `source`, `category` và `tags` để tra cứu. Dùng thư viện này khi cần tra nhanh một khái niệm hoặc kỹ thuật cụ thể.

### 5.5 Decision Brief Builder `/brief-builder`

Công cụ dựng **decision brief** một trang. Nhập bốn thông tin:

| Trường | Nội dung cần điền |
|---|---|
| **Problem type** | Chọn 1 trong 6: Customer discovery · Requirements conflict · Market strategy · Process bottleneck · MVP scope · Stakeholder alignment |
| **Problem** | Mô tả bài toán kinh doanh — càng cụ thể, gợi ý framework càng sát |
| **Audience** | Ai là người ra quyết định và ai bị ảnh hưởng |
| **Constraints** | Ràng buộc về thời gian, nguồn lực, chỉ số không được đánh đổi |
| **Evidence** | Bằng chứng đang có: ticket, phỏng vấn, số liệu analytics |

Kết quả trả về gồm: **decision question**, situation, recommendation, **3 framework phù hợp nhất**, assumptions, risks và next actions. Có nút copy để dán sang tài liệu khác.

Công cụ này chạy ở **hai chế độ**, và đây là điểm quan trọng nhất cần hiểu:

| | Structural draft *(mặc định)* | AI-generated brief |
|---|---|---|
| **Kích hoạt** | Tự động, ngay khi bạn gõ | Bấm nút **Generate with AI** |
| **Cách hoạt động** | Luật từ khoá xác định trên `problemType` + `evidence` | Gemini, có kiểm soát cấu trúc đầu ra |
| **Cần API key** | Không | Có |
| **Tốc độ** | Tức thì | ~10–30 giây, hiện dần theo luồng |
| **Chất lượng** | Đúng cấu trúc, nội dung khái quát | Suy luận trên chính bài toán của bạn |

**Chế độ AI khác biệt ở đâu:**

- **Framework có lý do.** Thay vì hiển thị mô tả chung của framework, AI giải thích vì sao framework đó hợp với *tình huống cụ thể này*.
- **Assumption có thể kiểm chứng.** AI được yêu cầu chỉ viết những giả định *có thể sai* và nếu sai thì đổi kết luận — không viết câu sáo rỗng.
- **Risk gắn với hậu quả.** Mỗi rủi ro phải nêu cái giá phải trả, không chỉ nêu mối nguy.
- **Next action giao được cho người.** Mỗi việc phải làm được trong hai tuần và chỉ định được người chịu trách nhiệm.

> **Ràng buộc quan trọng:** AI **chỉ được đề xuất framework có trong thư viện của Sol** — danh mục 13 framework được nạp thẳng vào prompt. Nó không thể bịa ra framework nghe có vẻ hợp lý nhưng sản phẩm không có. AI cũng không được bịa số liệu; khi cần một con số nó trả về placeholder dạng `[current activation rate]`.

**Nếu AI lỗi, bản structural draft vẫn còn nguyên.** Đây là chủ ý thiết kế: mất API key, hết quota, hay mất mạng đều không làm bạn mất công cụ. Thông báo lỗi sẽ nói rõ nguyên nhân và nhắc rằng bản draft vẫn dùng được.

Form được điền sẵn một ví dụ mẫu về xung đột giữa tốc độ onboarding và chất lượng lead — xoá đi và thay bằng bài toán của bạn.

---

## 6. Bên trong ứng dụng (dashboard)

### 6.1 Home `/dashboard`

Hiển thị **Workspace Pulse** với ba lối tắt:

- **Capture requirements** → Requirements
- **Draft a decision brief** → Decision Brief Builder
- **Open AI workspace** → AI Workspace

Kèm tiến độ học tập và chỉ số cải thiện (mặc định: 2 module hoàn thành, điểm trung bình 90%). Đây là **số liệu mẫu**.

### 6.2 AI Copilot `/dashboard/ai-assistant`

**Đây là tính năng AI thật duy nhất trong bản build hiện tại.**

Chat trực tiếp với một trợ lý BA chạy trên **Google Gemini 1.5 Pro** (qua Vercel AI SDK, phản hồi dạng streaming). System prompt định hướng trợ lý vào 7 lĩnh vực:

- Requirements gathering và documentation
- Stakeholder analysis và management
- Process modeling và improvement
- User story creation và backlog refinement
- Phương pháp luận BA (BABOK, Agile BA…)
- AI adoption trong quy trình nghiệp vụ
- Tạo template và best practices

**Điều kiện:** phải khai báo `GOOGLE_GENERATIVE_AI_API_KEY`. Nếu thiếu, API trả về `503 AI service is not configured`.

**Giới hạn kỹ thuật:** tối đa 50 tin nhắn mỗi request, mỗi tin tối đa 20.000 ký tự, timeout 30 giây.

**Dùng sao cho hiệu quả:** đưa ngữ cảnh trước, yêu cầu sau. Ví dụ — *“Đây là 5 ghi chú phỏng vấn khách hàng [dán vào]. Hãy rút ra các giả định ẩn và đề xuất 3 câu hỏi cần kiểm chứng tiếp.”*

### 6.3 AI Workspace `/dashboard/ai-workspace`

Gồm 4 công cụ: **AI Copilot**, **Generate Requirements**, **BA Method Advisor**, **Analysis Templates** (SWOT, PESTLE, Impact Analysis, Stakeholder Analysis).

Cả ba công cụ sinh nội dung đều gọi AI thật qua `/api/generate`, kết quả **stream theo thời gian thực**. Mỗi loại artifact có prompt riêng viết theo chuẩn BA — ví dụ *User Story* luôn trả về Given/When/Then kèm Definition of Done và ít nhất hai edge case; *Stakeholder Analysis* luôn trả về bảng power/interest kèm RACI.

**Ba nguyên tắc chung của mọi output:**

- AI không được bịa số liệu. Khi cần một con số, nó trả về placeholder dạng `[baseline conversion %]` để bạn tự điền.
- Khi input quá mỏng, AI ghi rõ giả định đã dùng trong mục **Assumptions** thay vì âm thầm bịa.
- Mọi artifact kết thúc bằng mục **Open questions** — danh sách câu hỏi nên hỏi stakeholder tiếp theo.

Nút **Copy** chép toàn bộ nội dung; nút **Export** tải về file `.md`. Trong lúc đang sinh, nút **Stop** dừng luồng ngay lập tức.

> **Điều kiện:** cần `GOOGLE_GENERATIVE_AI_API_KEY`. Nút Generate bị vô hiệu hoá khi bạn chưa nhập gì — đây là chủ ý, vì chất lượng output phụ thuộc trực tiếp vào độ chi tiết của input.

### 6.4 Requirements `/dashboard/requirements`

Tạo workspace và quản lý một **requirement register** có thể truy vết.

> **Lưu trữ:** ở chế độ demo, dữ liệu chỉ nằm trong `localStorage` của trình duyệt. **Xoá cache trình duyệt = mất dữ liệu.** Muốn lưu trữ thật và chia sẻ cho team, phải cấu hình Supabase. Các API route (`/api/workspaces`, `/api/workspaces/[id]/requirements`) đã sẵn sàng cho việc này.

### 6.5 Decision briefs

Dẫn tới Decision Brief Builder — xem [§5.5](#55-decision-brief-builder-brief-builder).

### 6.6 Daily workflow `/dashboard/daily-workflow`

Mô phỏng một ngày làm việc của BA theo persona demo (**"Sarah"**): priority task, thông báo, lịch họp trong ngày (có nút *Join*), cùng 4 chỉ số hiệu suất:

- Requirements Velocity
- Stakeholder Satisfaction
- Project Health Score
- Completion Rate

Đây là **bản mô phỏng tham chiếu** — hữu ích để hình dung Sol sẽ vận hành thế nào khi kết nối dữ liệu thật, hoặc để thiết kế quy trình làm việc hàng ngày cho team BA của bạn. Chưa nối vào dữ liệu của bạn.

### 6.7 Evidence analysis `/dashboard/data-analysis`

Tên gọi hơi gây nhầm — thực chất đây là một **Database Schema Reference** hoàn chỉnh, và là một trong những phần được xây dựng công phu nhất của sản phẩm.

**15 bảng dữ liệu** của một hệ thống nghiệp vụ BA điển hình (`users`, `projects`, `requirements`, `backlog_items`, `meetings`…), phân theo 8 nhóm: **Core · Requirements · Agile · Collaboration · Documentation · Design · Organization · Stakeholder · Business**.

Mỗi bảng có 4 tab:

| Tab | Nội dung |
|---|---|
| **Columns** | Danh sách cột, kiểu dữ liệu, ràng buộc |
| **Relationships** | Quan hệ khoá ngoại với các bảng khác |
| **SQL** | Câu lệnh DDL, có thể xuất ra |
| **Analysis** | Gợi ý câu truy vấn phân tích cho bảng đó |

**Dùng khi nào:** khi bạn cần hiểu hoặc tài liệu hoá cấu trúc dữ liệu của một hệ thống nghiệp vụ, thiết kế data model cho dự án mới, hoặc chuẩn bị câu hỏi cho team kỹ thuật.

### 6.8 Partners `/dashboard/partners`

Danh mục đối tác, có trang chi tiết cho từng đối tác.

---

## 7. Cấu hình đầy đủ

Để chuyển từ demo sang dùng thật, tạo file **`.env.local`** ở thư mục gốc (copy từ `.env.example`):

```bash
cp .env.example .env.local
```

Điền các giá trị:

```bash
# Supabase — công khai (client)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase — chỉ dùng phía server
SUPABASE_SERVICE_ROLE_KEY=

# AI provider — chỉ dùng phía server
GOOGLE_GENERATIVE_AI_API_KEY=

# Jira — chỉ dùng phía server
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=
JIRA_API_TOKEN=
JIRA_PROJECT_KEY=
```

### Mỗi biến mở khoá điều gì

| Biến | Mở khoá |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Đăng nhập thật, lưu trữ bền vững, đồng bộ cho team. Learning paths / frameworks / testimonials sẽ đọc từ database thay vì dữ liệu mẫu |
| `SUPABASE_SERVICE_ROLE_KEY` | Ghi từ phía server — ví dụ lưu email đăng ký newsletter vào bảng `email_signups` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | AI Copilot **và** cả ba công cụ sinh nội dung trong AI Workspace. Thiếu key → API trả `503` |
| `GOOGLE_GENERATIVE_AI_MODEL` | *(tuỳ chọn)* Đổi model. Mặc định `gemini-2.5-flash` |
| `JIRA_*` | Đọc và tạo issue trên Jira (REST API v3). Thiếu cấu hình → hệ thống tự động dùng dữ liệu mẫu và báo *"Using mock data - JIRA API not configured"* |

### Khởi tạo database

Thư mục `supabase/` có sẵn `schema.sql` và migration `202607100001_canonical_workspace.sql`. Chạy các file này trên project Supabase của bạn trước khi dùng.

> **Bảo mật:** `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY` và `JIRA_API_TOKEN` **chỉ được dùng ở phía server** — tuyệt đối không thêm tiền tố `NEXT_PUBLIC_` vào chúng, vì mọi biến `NEXT_PUBLIC_*` đều bị đưa xuống trình duyệt và ai cũng đọc được.

Sau khi sửa `.env.local`, **khởi động lại dev server** để Next.js nạp biến mới.

---

## 8. Giới hạn hiện tại (cần biết trước khi dùng thật)

Bản build hiện tại là **demo / pre-launch**. Tổng hợp trung thực trạng thái từng phần:

| Tính năng | Trạng thái |
|---|---|
| Landing, learning paths, frameworks | ✅ Hoạt động đầy đủ |
| Thư viện nội dung (662 file → 651 trang tĩnh) | ✅ Đầy đủ |
| Database Schema Reference (15 bảng) | ✅ Đầy đủ |
| AI Copilot | ✅ Thật — cần API key Gemini |
| AI Workspace (Requirements · Advisor · Templates) | ✅ Thật — cần API key Gemini |
| Decision Brief Builder | ✅ Hai chế độ — structural draft (không cần key) + AI brief (cần key) |
| Tích hợp Jira | ✅ Thật — cần cấu hình, có fallback dữ liệu mẫu |
| Requirements register | ⚠️ Chạy được nhưng lưu ở `localStorage` — cần Supabase để lưu thật |
| Daily workflow | ⚠️ Dữ liệu mô phỏng theo persona demo |
| Tiến độ học tập | ⚠️ Số liệu mẫu cố định |

**Ba điều dễ hiểu nhầm nhất:**

1. **"30+ tools"** trên trang chủ là thông điệp marketing. Thực tế bản build ship **8 framework** trên lưới trang chủ và **13 framework** trong thư viện của Decision Brief Builder.
2. **Decision Brief Builder mặc định chưa gọi AI.** Bản draft hiện ra ngay khi bạn gõ là bản dựng theo luật. Phải bấm **Generate with AI** mới có brief do AI suy luận.
3. **Dữ liệu demo không bền.** Trước khi nhập requirement thật cho một dự án thật, hãy cấu hình Supabase.

---

## 9. Xử lý sự cố

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `pnpm dev` báo lỗi thiếu module | Chưa cài dependencies | Chạy `pnpm install` |
| Cổng 3000 đã bị chiếm | Tiến trình khác đang chạy | `pnpm dev -- -p 3001` hoặc tắt tiến trình cũ |
| Trang login vẫn hiện "Demo mode" dù đã có key | Server chưa nạp biến mới | Khởi động lại `pnpm dev`. Kiểm tra file tên đúng là `.env.local` |
| AI Copilot trả `503` | Thiếu `GOOGLE_GENERATIVE_AI_API_KEY` | Thêm key rồi khởi động lại server |
| AI Copilot trả `400` | Request sai định dạng — vượt 50 tin nhắn hoặc tin nhắn rỗng | Bắt đầu hội thoại mới |
| AI Copilot trả `413` | Hội thoại quá dài (>200.000 ký tự) | Bắt đầu hội thoại mới |
| Nút Generate bị mờ, bấm không được | Chưa nhập nội dung vào ô mô tả | Nhập mô tả trước — output phụ thuộc vào input |
| Báo *"The model returned nothing"* | API key sai, hoặc model cấu hình không khả dụng cho project của bạn | Kiểm tra key; thử đặt `GOOGLE_GENERATIVE_AI_MODEL` sang model bạn có quyền dùng |
| Mất hết requirement đã nhập | Dữ liệu ở `localStorage`, đã bị xoá cache | Cấu hình Supabase để lưu bền vững |
| Jira báo "Using mock data" | Thiếu biến `JIRA_*` | Điền đủ 4 biến Jira trong `.env.local` |
| Cảnh báo `Ignored build scripts: sharp` | Hành vi mặc định của pnpm | Bỏ qua, hoặc chạy `pnpm approve-builds` |

---

## Phụ lục — Lộ trình 15 phút đầu tiên

1. `pnpm install && pnpm dev` → mở http://localhost:3000
2. Cuộn hết trang chủ để nắm định vị sản phẩm
3. Vào `/frameworks`, mở **SWOT**, đọc kỹ ba mục *Signal / Use cases / Artifact* — đây là cách Sol muốn bạn tư duy
4. Vào `/brief-builder`, thay ví dụ mẫu bằng một bài toán thật của bạn. Xem bản structural draft hiện ngay, rồi bấm **Generate with AI** để so sánh hai bản
5. Đăng nhập demo (`demo@sol.app` / `demo123`)
6. Vào **Evidence analysis** → mở bảng `requirements` → xem tab *Relationships* và *SQL*
7. Nếu đã có API key Gemini: vào **AI Copilot**, dán một đoạn ghi chú họp và yêu cầu rút ra giả định ẩn

---

*Tài liệu này mô tả trạng thái thực tế của bản build hiện tại, bao gồm cả những phần chưa hoàn thiện. Khi sản phẩm cập nhật, hãy cập nhật lại §8.*
