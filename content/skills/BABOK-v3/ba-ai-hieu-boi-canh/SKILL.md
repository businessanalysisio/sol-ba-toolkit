---
name: ba-ai-hieu-boi-canh
description: "Hướng dẫn BA mới dùng AI để đọc tài liệu, ghi chú, thư điện tử, biên bản họp, mô tả hệ thống, hoặc thông tin rời rạc nhằm tạo bức tranh bối cảnh nghiệp vụ. Dùng khi cần tóm tắt hiện trạng, xác định mục tiêu kinh doanh, bên liên quan, thuật ngữ, quy tắc nghiệp vụ, khoảng trống thông tin, và câu hỏi cần khai thác tiếp."
---

# BA AI Hiểu Bối Cảnh

## Mục tiêu

Biến thông tin thô thành bức tranh nghiệp vụ có cấu trúc. Ưu tiên hiểu đúng vấn đề trước khi viết yêu cầu.

## Quy trình

1. Thu thập đầu vào: tài liệu, ghi chú họp, mô tả quy trình, ảnh chụp màn hình, bảng dữ liệu, hoặc trao đổi với bên liên quan.
2. Yêu cầu AI trích xuất dữ kiện, thuật ngữ, mục tiêu, ràng buộc, quy tắc, hệ thống liên quan, và bên liên quan.
3. Tạo bản tóm tắt theo các mục: bối cảnh, vấn đề, tác động, phạm vi, giả định, câu hỏi mở.
4. Đánh dấu điểm chưa chắc chắn và nguồn cần xác minh.
5. Chuyển kết quả thành danh sách câu hỏi cho phỏng vấn hoặc hội thảo.

## Khung đầu ra

```text
1. Bối cảnh ngắn gọn
2. Mục tiêu kinh doanh
3. Vấn đề hoặc cơ hội
4. Bên liên quan và vai trò
5. Quy trình hoặc hệ thống liên quan
6. Thuật ngữ cần thống nhất
7. Quy tắc nghiệp vụ đã thấy
8. Giả định
9. Câu hỏi cần xác minh
10. Tài liệu hoặc bằng chứng còn thiếu
```

## Mẫu nhắc lệnh

```text
Hãy đọc nội dung sau như một BA.
Chỉ dùng thông tin có trong đầu vào.
Hãy tách dữ kiện, giả định, câu hỏi mở, thuật ngữ, bên liên quan, mục tiêu, ràng buộc và rủi ro.
Sau đó đề xuất 5 câu hỏi quan trọng nhất cần hỏi tiếp.

Nội dung:
[dán nội dung]
```

## Kỹ thuật liên quan

Ưu tiên phân tích tài liệu, bảng thuật ngữ, danh sách bên liên quan, kiến thức tổ chức, kiến thức ngành, phân tích quy tắc nghiệp vụ, và phân tích phạm vi.

## Lưu ý cho BA mới

Không yêu cầu AI viết giải pháp ngay khi chưa hiểu vấn đề. Nếu đầu vào mâu thuẫn, hãy yêu cầu AI tạo bảng mâu thuẫn gồm nội dung, nguồn, tác động, và câu hỏi xác minh.
