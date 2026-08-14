---
name: ba-ai-danh-gia-chat-luong
description: "Hướng dẫn BA mới dùng AI để rà soát chất lượng đầu ra phân tích nghiệp vụ: yêu cầu, câu chuyện người dùng, tiêu chí chấp nhận, quy tắc nghiệp vụ, sơ đồ quy trình, biên bản họp, danh sách tồn đọng, ma trận quyền, hoặc tài liệu phạm vi. Dùng khi cần phát hiện mơ hồ, thiếu sót, mâu thuẫn, giả định ẩn, rủi ro, thiếu khả năng kiểm thử, hoặc thiếu liên kết với mục tiêu kinh doanh."
---

# BA AI Đánh Giá Chất Lượng

## Mục tiêu

Dùng AI như người rà soát thứ hai để phát hiện lỗi trước khi gửi tài liệu cho bên liên quan hoặc nhóm triển khai.

## Quy trình

1. Cung cấp đầu ra cần rà soát và bối cảnh tối thiểu.
2. Yêu cầu AI kiểm tra theo tiêu chí cụ thể, không chỉ góp ý chung.
3. Bắt AI phân loại phát hiện theo mức độ ảnh hưởng.
4. Yêu cầu đề xuất câu hỏi xác minh hoặc bản viết lại.
5. BA đọc lại, chọn sửa đổi phù hợp, và xác nhận với nguồn nghiệp vụ.

## Danh sách kiểm tra

Kiểm tra các điểm sau:

- Rõ nghĩa và không mơ hồ.
- Không mâu thuẫn với phần khác.
- Có giá trị nghiệp vụ.
- Có thể kiểm thử hoặc xác minh.
- Có phạm vi và ngoại lệ.
- Có vai trò hoặc người dùng rõ.
- Có dữ liệu, quyền, hệ thống, và quy tắc liên quan.
- Có giả định được nêu rõ.
- Có truy vết đến mục tiêu hoặc vấn đề.

## Mẫu nhắc lệnh

```text
Hãy rà soát nội dung sau như một BA cấp cao.
Tạo bảng gồm: mã phát hiện, mức độ, đoạn liên quan, vấn đề, tác động, câu hỏi xác minh, đề xuất sửa.
Tập trung vào mơ hồ, thiếu tiêu chí kiểm thử, mâu thuẫn, ngoại lệ bị bỏ sót, giả định ẩn, và thiếu giá trị nghiệp vụ.

Nội dung:
[dán nội dung]
```

## Mức độ phát hiện

- Nghiêm trọng: có thể làm đội triển khai hiểu sai hoặc xây sai.
- Cao: thiếu thông tin cần thiết để ước lượng, thiết kế, hoặc kiểm thử.
- Trung bình: cần làm rõ để giảm rủi ro.
- Thấp: cải thiện cách viết hoặc cấu trúc.

## Lưu ý

Không nhận mọi góp ý của AI như sự thật. Nếu AI nêu lỗi nhưng không chỉ ra đoạn liên quan hoặc tác động, hãy yêu cầu giải thích lại.
