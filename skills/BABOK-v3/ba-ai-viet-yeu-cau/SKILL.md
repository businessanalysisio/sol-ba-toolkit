---
name: ba-ai-viet-yeu-cau
description: "Hướng dẫn BA mới dùng AI để chuyển ghi chú, nhu cầu, vấn đề, hoặc ý tưởng thành yêu cầu rõ ràng, kiểm thử được: yêu cầu chức năng, yêu cầu phi chức năng, câu chuyện người dùng, kịch bản sử dụng, tiêu chí chấp nhận, quy tắc nghiệp vụ, và yêu cầu dữ liệu. Dùng khi cần soạn, tách nhỏ, làm rõ, hoặc chuẩn hóa yêu cầu trước khi gửi cho nhóm triển khai."
---

# BA AI Viết Yêu Cầu

## Nguyên tắc

Yêu cầu tốt phải rõ, có giá trị, nhất quán, kiểm thử được, và có phạm vi. AI có thể giúp viết lại, tách nhỏ, tìm lỗ hổng, nhưng BA phải xác minh với bên liên quan.

## Quy trình

1. Cung cấp mục tiêu kinh doanh, người dùng, vấn đề, quy trình liên quan, ràng buộc, và ghi chú thô.
2. Yêu cầu AI tách nhu cầu thành yêu cầu, quy tắc nghiệp vụ, câu hỏi mở, và giả định.
3. Chọn dạng phù hợp: câu chuyện người dùng, kịch bản sử dụng, bảng quy tắc, hoặc yêu cầu phi chức năng.
4. Thêm tiêu chí chấp nhận ở dạng có thể kiểm thử.
5. Rà soát tính độc lập, giá trị, kích thước, khả năng ước lượng, và khả năng kiểm thử.

## Mẫu câu chuyện người dùng

```text
Là [vai trò],
tôi muốn [mục tiêu],
để [lợi ích nghiệp vụ].

Tiêu chí chấp nhận:
Cho trước [bối cảnh],
khi [hành động],
thì [kết quả quan sát được].
```

## Mẫu nhắc lệnh

```text
Hãy chuyển ghi chú sau thành yêu cầu nghiệp vụ rõ ràng.
Tạo:
1. Danh sách câu chuyện người dùng.
2. Tiêu chí chấp nhận cho từng câu chuyện.
3. Quy tắc nghiệp vụ.
4. Yêu cầu phi chức năng nếu có dấu hiệu liên quan.
5. Câu hỏi cần xác minh.
6. Điểm mơ hồ hoặc mâu thuẫn.

Ghi chú:
[dán nội dung]
```

## Kiểm tra chất lượng

Với mỗi yêu cầu, hỏi:

- Ai cần điều này.
- Giá trị kinh doanh là gì.
- Điều kiện thành công đo được là gì.
- Có ngoại lệ nào chưa nêu không.
- Có phụ thuộc dữ liệu, vai trò, quyền, hoặc hệ thống nào không.
- Có thể kiểm thử mà không hỏi lại người viết không.

## Kỹ thuật liên quan

Dùng câu chuyện người dùng, tiêu chí chấp nhận, kịch bản sử dụng, phân tích yêu cầu phi chức năng, phân tích quy tắc nghiệp vụ, mô hình dữ liệu, phân tích giao diện, và ma trận vai trò quyền hạn.
