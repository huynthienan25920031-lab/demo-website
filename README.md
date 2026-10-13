# Website demo

Ba website bán hàng demo do Thiên Ân thiết kế (Zalo 0908 706 813), dùng để gửi cho khách xem thử.
HTML, CSS và JavaScript tĩnh: mở thẳng `index.html` bằng trình duyệt là chạy, không cần máy chủ.

| Thư mục | Shop giả định | Phong cách |
|---|---|---|
| `vai-nang-chieu/` | Vải Nắng Chiều (thời trang linen, lụa) | Ấm, thoáng, chữ có chân |
| `nen-lam-khe/` | Nến Lam Khê (nến thơm) | Nền tối, ánh hổ phách, danh sách ngang |
| `mua-rao-thang-sau/` | Mưa Rào Tháng Sáu (sơ mi, áo thun, váy) | Tươi, viền đậm, bóng đổ cứng |

`index.html` ở gốc là trang danh mục liệt kê cả ba.

## Cấu trúc

- `shared/shop.js`: bộ máy chung (trang chủ, catalog có lọc, trang sản phẩm, giỏ hàng, form đặt hàng, trang thành công, chat giả lập).
- `shared/base.css`: khung chung. Mỗi shop có `theme.css` (màu, font, dáng) và `data.js` (sản phẩm, hình vẽ, câu trả lời chat).
- Thêm một shop: chép một thư mục shop, sửa `data.js` và `theme.css`, thêm vào `index.html`.

## Điều cần biết

- **Ba shop là giả định, không bán hàng thật.** Sản phẩm, giá, mô tả chỉ để minh họa.
- **Không gửi dữ liệu đi đâu.** Giỏ hàng và đơn hàng chỉ lưu trong `localStorage` của trình duyệt người xem; không có lệnh gọi mạng nào. Chân trang có nút "Xóa dữ liệu demo".
- **Mã QR là mã MẪU**: ô vuông ngẫu nhiên sinh từ mã đơn, có chữ "MẪU" ở giữa, không quét được.
- **Chat là giả lập**: câu trả lời soạn sẵn theo từ khóa.
- **Phí ship, mã giảm giá, tồn kho, điểm khách quen đều là giả định**: bảng phí theo khu vực và các mã (FREESHIP, KHACHQUEN) nằm trong `shared/shop.js`; số tồn theo size nằm ở trường `stock` trong `data.js`; điểm khách quen lưu trên trình duyệt. Không theo hãng giao hàng hay chương trình nào có thật.
- **Bảng size và đánh giá** (hiện có ở Mưa Rào Tháng Sáu): khai báo `sizeChart` và `reviews` trong `data.js`; tên người đánh giá là tên giả.

## Nguồn hình và font

- Hình sản phẩm: tự vẽ bằng SVG trong `data.js` của từng shop, không dùng ảnh của bên thứ ba.
- Font tiêu đề (trong `shared/fonts/`, kèm file giấy phép): Playfair Display, Oswald, Baloo 2, giấy phép SIL Open Font License 1.1, lấy từ Google Fonts.
- Chữ thường dùng font có sẵn của máy.
