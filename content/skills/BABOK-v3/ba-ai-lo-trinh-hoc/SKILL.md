---
name: ba-ai-lo-trinh-hoc
description: "Hướng dẫn nhà phân tích nghiệp vụ mới học và thực hành BA với AI theo lộ trình có cấu trúc. Dùng khi người dùng là BA mới, thực tập sinh BA, người chuyển nghề sang BA, hoặc người hướng dẫn cần kế hoạch học theo tuần, bài tập thực hành, tiêu chí đánh giá, cách dùng AI an toàn, và cách kết hợp các kỹ năng BA AI như hiểu bối cảnh, khai thác yêu cầu, phân tích quy trình, viết yêu cầu, ưu tiên, rà soát chất lượng, và giao tiếp với bên liên quan."
---

# BA AI Lộ Trình Học

## Mục tiêu

Giúp BA mới học theo hướng thực hành: hiểu vấn đề, hỏi đúng câu hỏi, viết yêu cầu rõ ràng, kiểm tra chất lượng, và giao tiếp tốt với bên liên quan. AI được dùng như huấn luyện viên, người phản biện, và trợ lý soạn thảo.

## Nguyên tắc học

- Học qua tình huống thật hoặc giả lập gần thật.
- Luôn tách dữ kiện, giả định, câu hỏi mở, và kết luận.
- Không để AI tự quyết định thay bên liên quan.
- Mỗi bài tập phải có đầu ra cụ thể và tiêu chí tự đánh giá.
- Sau mỗi tuần, yêu cầu AI phản biện điểm yếu trong cách phân tích.

## Lộ trình 4 tuần

### Tuần 1: Nền tảng và bối cảnh

Mục tiêu: biết cách nhận một nhiệm vụ BA mơ hồ và biến thành kế hoạch phân tích.

Thực hành:

- Dùng `$ba-ai-khoi-dong` để lập kế hoạch cho một bài toán nghiệp vụ.
- Dùng `$ba-ai-hieu-boi-canh` để tóm tắt tài liệu hoặc ghi chú họp.
- Tạo bảng gồm mục tiêu, bên liên quan, phạm vi, giả định, câu hỏi mở.

Đầu ra cần có:

- Tóm tắt bối cảnh 1 trang.
- Danh sách thuật ngữ.
- 10 câu hỏi cần xác minh.
- Kế hoạch 3 bước tiếp theo.

Tiêu chí đạt:

- Không lẫn dữ kiện với giả định.
- Nêu được vấn đề kinh doanh thay vì chỉ nêu yêu cầu hệ thống.
- Biết cần hỏi ai và hỏi gì tiếp theo.

### Tuần 2: Khai thác yêu cầu

Mục tiêu: chuẩn bị và xử lý phiên trao đổi với bên liên quan.

Thực hành:

- Dùng `$ba-ai-khai-thac-yeu-cau` để tạo kịch bản phỏng vấn hoặc hội thảo.
- Chuyển ghi chú sau phiên thành yêu cầu thô, quy tắc nghiệp vụ, quyết định, và câu hỏi mở.
- Soạn biên bản bằng `$ba-ai-giao-tiep-stakeholder`.

Đầu ra cần có:

- Mục tiêu phiên làm việc.
- Bộ câu hỏi mở và câu hỏi đào sâu.
- Biên bản sau phiên.
- Danh sách hành động tiếp theo.

Tiêu chí đạt:

- Câu hỏi không dẫn dắt.
- Có câu hỏi về ngoại lệ, dữ liệu, vai trò, và tiêu chí thành công.
- Biên bản phân biệt quyết định, giả định, và việc cần làm.

### Tuần 3: Phân tích và viết yêu cầu

Mục tiêu: biến thông tin thu thập được thành yêu cầu rõ ràng và kiểm thử được.

Thực hành:

- Dùng `$ba-ai-phan-tich-quy-trinh` để phân tích quy trình hiện tại.
- Dùng `$ba-ai-viet-yeu-cau` để viết câu chuyện người dùng, tiêu chí chấp nhận, quy tắc nghiệp vụ, và yêu cầu phi chức năng.
- Dùng `$ba-ai-danh-gia-chat-luong` để rà soát bản nháp.

Đầu ra cần có:

- Bảng bước quy trình, vai trò, hệ thống, đầu vào, đầu ra, vấn đề.
- 5 đến 10 câu chuyện người dùng.
- Tiêu chí chấp nhận cho từng câu chuyện.
- Danh sách lỗi chất lượng và bản sửa.

Tiêu chí đạt:

- Yêu cầu có người dùng, mục tiêu, giá trị, điều kiện thành công.
- Tiêu chí chấp nhận có thể kiểm thử.
- Có xử lý ngoại lệ và ràng buộc.

### Tuần 4: Ưu tiên, giao tiếp, và hoàn thiện

Mục tiêu: biết trình bày phân tích, hỗ trợ ra quyết định, và hoàn thiện đầu ra.

Thực hành:

- Dùng `$ba-ai-uu-tien-backlog` để ưu tiên danh sách tồn đọng.
- Dùng `$ba-ai-giao-tiep-stakeholder` để soạn cập nhật trạng thái hoặc yêu cầu ra quyết định.
- Dùng `$ba-ai-danh-gia-chat-luong` để rà soát toàn bộ gói đầu ra.

Đầu ra cần có:

- Bảng ưu tiên có tiêu chí và lý do.
- Tóm tắt quyết định cần bên liên quan xác nhận.
- Bản cập nhật trạng thái ngắn.
- Danh sách rủi ro, phụ thuộc, và câu hỏi mở.

Tiêu chí đạt:

- Có lý do ưu tiên minh bạch.
- Nêu rõ tác động nếu trì hoãn.
- Giao tiếp ngắn gọn, có hành động mong muốn và hạn phản hồi.

## Bài tập tổng hợp

Khi người dùng cần một bài tập hoàn chỉnh, tạo tình huống gồm:

1. Bối cảnh công ty và vấn đề.
2. Ghi chú họp thô.
3. Mô tả quy trình hiện tại.
4. Danh sách yêu cầu mơ hồ.
5. Ràng buộc và xung đột ưu tiên.

Sau đó yêu cầu người học tạo:

- Tóm tắt bối cảnh.
- Câu hỏi khai thác.
- Phân tích quy trình.
- Câu chuyện người dùng và tiêu chí chấp nhận.
- Bảng ưu tiên.
- Thông điệp gửi bên liên quan.

## Mẫu nhắc lệnh cho huấn luyện viên AI

```text
Bạn là huấn luyện viên BA cho người mới.
Hãy tạo lộ trình học [số tuần] dựa trên mục tiêu sau: [mục tiêu].
Mỗi tuần cần có:
1. Mục tiêu học.
2. Bài tập thực hành.
3. Đầu ra cần nộp.
4. Tiêu chí tự đánh giá.
5. Câu hỏi phản tư.
Hãy ưu tiên thực hành với tình huống nghiệp vụ gần thực tế.
```

## Câu hỏi phản tư cuối tuần

- Tôi đã hiểu vấn đề kinh doanh hay mới hiểu yêu cầu bề mặt?
- Tôi đã xác minh giả định nào?
- Câu hỏi nào của tôi tạo ra thông tin hữu ích nhất?
- Yêu cầu nào còn mơ hồ hoặc khó kiểm thử?
- Tôi sẽ làm gì khác trong lần khai thác tiếp theo?

## Lưu ý bảo mật

Không đưa dữ liệu cá nhân, dữ liệu khách hàng, hợp đồng, tài chính nhạy cảm, mã nguồn, hoặc thông tin nội bộ chưa được phép vào AI. Khi cần luyện tập, hãy ẩn danh hoặc tạo dữ liệu giả lập.
