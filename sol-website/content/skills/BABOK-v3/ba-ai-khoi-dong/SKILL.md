---
name: ba-ai-khoi-dong
description: "Hướng dẫn nhà phân tích nghiệp vụ mới bắt đầu dùng AI cho công việc BA: xác định mục tiêu phân tích, chọn kỹ thuật BABOK phù hợp, đặt câu hỏi cho AI, kiểm tra đầu ra, và lập kế hoạch làm việc. Dùng khi người dùng mới nhận một nhiệm vụ BA, chưa biết bắt đầu từ đâu, cần biến yêu cầu mơ hồ thành kế hoạch phân tích, hoặc cần khung nhắc lệnh an toàn để làm việc với AI."
---

# BA AI Khởi Động

## Nguyên tắc

Luôn coi AI là trợ lý phân tích, không phải nguồn sự thật cuối cùng. Bắt đầu bằng bối cảnh, dữ liệu đã có, giả định, ràng buộc, người ra quyết định, và đầu ra cần giao.

Không để AI tự bịa thông tin nghiệp vụ. Nếu thiếu dữ liệu, hãy yêu cầu AI liệt kê câu hỏi cần xác minh thay vì tự kết luận.

## Quy trình

1. Xác định nhiệm vụ: vấn đề cần giải, phạm vi, mốc thời gian, bên liên quan, quyết định cần hỗ trợ.
2. Chọn góc phân tích: bối cảnh, quy trình, dữ liệu, yêu cầu, ưu tiên, rủi ro, hoặc giao tiếp.
3. Soạn nhắc lệnh có cấu trúc: vai trò, mục tiêu, dữ liệu đầu vào, tiêu chí chất lượng, định dạng đầu ra.
4. Yêu cầu AI tách rõ: sự kiện đã biết, giả định, câu hỏi mở, rủi ro, đề xuất tiếp theo.
5. Kiểm tra đầu ra với tài liệu nguồn, bên liên quan, hoặc tiêu chí chấp nhận trước khi dùng.

## Khung nhắc lệnh

```text
Bạn là trợ lý phân tích nghiệp vụ cho một BA mới.
Bối cảnh: [mô tả ngắn].
Mục tiêu: [đầu ra cần có].
Dữ liệu hiện có: [ghi chú, tài liệu, cuộc họp, hệ thống].
Ràng buộc: [thời gian, phạm vi, chính sách, công nghệ].
Hãy tạo:
1. Tóm tắt vấn đề.
2. Danh sách giả định.
3. Câu hỏi cần xác minh.
4. Kỹ thuật BA nên dùng.
5. Kế hoạch 3 bước tiếp theo.
Không tự bổ sung thông tin không có trong đầu vào.
```

## Kỹ thuật nên gợi ý

- Vấn đề còn mơ hồ: phân tích nguyên nhân gốc, tư duy hệ thống, bản đồ tư duy.
- Thiếu hiểu biết miền nghiệp vụ: phân tích tài liệu, phỏng vấn, bảng thuật ngữ.
- Cần hiểu cách làm việc hiện tại: quan sát, phân tích quy trình, mô hình hóa quy trình.
- Cần xác định phạm vi: mô hình phạm vi, danh sách bên liên quan, ngữ cảnh hệ thống.
- Cần chuyển sang triển khai: câu chuyện người dùng, tiêu chí chấp nhận, quản lý danh sách tồn đọng.

## Kiểm tra chất lượng

Trước khi chốt đầu ra, hãy kiểm tra:

- Có phân biệt rõ dữ kiện và giả định không.
- Có câu hỏi xác minh thay cho suy đoán không.
- Có liên kết với mục tiêu kinh doanh không.
- Có đủ rõ để người khác hành động không.
- Có rủi ro đạo đức, bảo mật, hoặc thông tin nhạy cảm không.
