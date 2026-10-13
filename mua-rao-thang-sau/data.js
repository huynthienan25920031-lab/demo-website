/* Mưa Rào Tháng Sáu: shop thời trang GIẢ ĐỊNH. Sản phẩm, giá và hình vẽ chỉ để minh họa. */
(function () {
  function color(name, hex, shade) { return { name: name, hex: hex, shade: shade, bg: "#ffffff" }; }
  var WHITE = color("Trắng kem", "#F1EDE2", "#B9B19C"), BLUE = color("Xanh kẻ", "#A9BFD6", "#5F7CA0"), BEIGE = color("Be", "#E3C9A6", "#A8855A"),
    MOSS = color("Xanh rêu", "#93A68B", "#5B6F55"), CLAY = color("Hồng đất", "#DDB0A2", "#A6695A"), BLACK = color("Đen", "#55525C", "#2B2A33"), SUN = color("Vàng nắng", "#F2CF63", "#B8922A");

  var art = {
    shirt: function (c) {
      return '<path d="M70 16 L24 44 L8 96 L42 108 L52 84 L52 198 L148 198 L148 84 L158 108 L192 96 L176 44 L130 16 Q100 44 70 16 Z" fill="' + c.hex + '"/>' +
        '<path d="M70 16 Q100 44 130 16 L118 12 Q100 30 82 12 Z" fill="' + c.shade + '"/><path d="M100 40 L100 198" stroke="' + c.shade + '" stroke-width="4"/>' +
        '<circle cx="100" cy="74" r="5" fill="' + c.shade + '"/><circle cx="100" cy="112" r="5" fill="' + c.shade + '"/><circle cx="100" cy="150" r="5" fill="' + c.shade + '"/>';
    },
    tee: function (c) {
      return '<path d="M70 20 L26 44 L10 92 L44 104 L54 84 L54 198 L146 198 L146 84 L156 104 L190 92 L174 44 L130 20 Q100 50 70 20 Z" fill="' + c.hex + '"/>' +
        '<path d="M70 20 Q100 50 130 20 L122 17 Q100 40 78 17 Z" fill="' + c.shade + '"/><rect x="78" y="96" width="44" height="44" rx="10" fill="' + c.shade + '" opacity="0.55"/>';
    },
    skirt: function (c) {
      return '<rect x="62" y="28" width="76" height="20" rx="6" fill="' + c.shade + '"/><path d="M62 48 L138 48 L176 196 L24 196 Z" fill="' + c.hex + '"/>' +
        '<path d="M86 48 L70 196 M114 48 L130 196 M100 48 L100 196" stroke="' + c.shade + '" stroke-width="4" opacity="0.6"/>';
    },
  };

  window.SHOP = {
    id: "mua-rao-thang-sau",
    name: "Mưa Rào Tháng Sáu",
    brandHtml: "Mưa Rào <span>Tháng Sáu</span>",
    orderPrefix: "MR",
    optionNames: { size: "Size", color: "Màu" },
    hero: { eyebrow: "Sơ mi mặc hằng ngày", title: "Mát như cơn mưa đầu hè", text: "Sơ mi, áo thun và váy dễ mặc, dễ phối, giá ghi rõ từng món.", cta: "Xem hết mẫu" },
    perks: [["Giá công khai", "không cần hỏi"], ["Đặt nhanh", "vài bước"], ["Đổi size", "trong 7 ngày"]],
    categories: [{ id: "so-mi", name: "Sơ mi" }, { id: "ao-thun", name: "Áo thun" }, { id: "vay", name: "Váy" }],
    sizeChart: {
      cols: ["Size", "Cân nặng", "Ngực", "Dài áo"],
      rows: [["S", "45–52 kg", "88 cm", "62 cm"], ["M", "53–60 kg", "92 cm", "64 cm"], ["L", "61–68 kg", "96 cm", "66 cm"], ["XL", "69–76 kg", "100 cm", "68 cm"]],
      note: "Số đo áo sơ mi. Không vừa thì đổi size trong 7 ngày.",
    },
    reviews: [
      { name: "Khách Mẫu A", stars: 5, bought: "Sơ mi linen trắng", text: "Vải mát, mặc đúng size như bảng. Đặt trên web nhanh hơn nhắn tin nhiều." },
      { name: "Trần Thị Ví Dụ", stars: 5, bought: "Sơ mi kẻ xanh", text: "Giá ghi rõ từng món nên khỏi phải hỏi. Giao 3 ngày là tới." },
      { name: "Lê Thử Nghiệm", stars: 4, bought: "Váy xếp ly", text: "Màu be ngoài đời đậm hơn ảnh một chút, form đẹp." },
    ],
    priceRanges: [{ id: "a", label: "Dưới 200k", min: 0, max: 200000 }, { id: "b", label: "200k – 300k", min: 200000, max: 300000 }, { id: "c", label: "Từ 300k", min: 300000, max: Infinity }],
    products: [
      { id: "so-mi-linen-trang", name: "Sơ mi linen trắng", cat: "so-mi", art: "shirt", price: 289000, sizes: ["S", "M", "L"], stock: { S: 2 }, colors: [WHITE, BEIGE], desc: "Linen pha cotton, thoáng, ít nhăn hơn linen thường." },
      { id: "so-mi-ke-xanh", name: "Sơ mi kẻ xanh", cat: "so-mi", art: "shirt", price: 259000, sizes: ["S", "M", "L", "XL"], stock: { M: 3, XL: 0 }, colors: [BLUE, WHITE], desc: "Kẻ sọc mảnh, dáng rộng vừa, mặc khoác ngoài cũng hợp." },
      { id: "so-mi-be-tay-lo", name: "Sơ mi be tay lỡ", cat: "so-mi", art: "shirt", price: 279000, sizes: ["S", "M", "L"], colors: [BEIGE, CLAY], desc: "Tay lỡ, cổ đức, vải đũi mềm." },
      { id: "so-mi-xanh-reu", name: "Sơ mi xanh rêu", cat: "so-mi", art: "shirt", price: 299000, sizes: ["M", "L", "XL"], colors: [MOSS, BLACK], desc: "Màu trầm dễ phối, vải dày vừa, đứng dáng." },
      { id: "so-mi-hong-dat", name: "Sơ mi hồng đất", cat: "so-mi", art: "shirt", price: 269000, sizes: ["S", "M"], colors: [CLAY, WHITE], desc: "Hồng đất tôn da, dáng lửng." },
      { id: "so-mi-den-co-tau", name: "Sơ mi đen cổ tàu", cat: "so-mi", art: "shirt", price: 319000, sizes: ["S", "M", "L", "XL"], colors: [BLACK, MOSS], desc: "Cổ tàu, nút ẩn, mặc đi làm gọn gàng." },
      { id: "ao-thun-tron", name: "Áo thun trơn", cat: "ao-thun", art: "tee", price: 159000, sizes: ["S", "M", "L", "XL"], colors: [WHITE, BLACK, SUN], desc: "Cotton dày vừa, cổ bo không giãn." },
      { id: "ao-thun-tui-nguc", name: "Áo thun túi ngực", cat: "ao-thun", art: "tee", price: 179000, sizes: ["M", "L", "XL"], colors: [MOSS, BEIGE], desc: "Có túi ngực nhỏ, form rộng." },
      { id: "vay-xep-ly", name: "Váy xếp ly", cat: "vay", art: "skirt", price: 249000, sizes: ["S", "M", "L"], colors: [BEIGE, BLACK], desc: "Dài qua gối, cạp chun sau, có lót." },
      { id: "vay-chu-a-vang", name: "Váy chữ A", cat: "vay", art: "skirt", price: 229000, sizes: ["S", "M"], colors: [SUN, BLUE], desc: "Dáng chữ A ngắn, có túi hai bên." },
    ],
    draw: function (p, c, w) {
      return '<svg viewBox="0 0 200 210" width="' + w + '" height="' + Math.round(w * 1.05) + '" role="img" aria-label="' + p.name + ", " + c.name + '">' + art[p.art](c) + "</svg>";
    },
    chat: {
      greeting: "Mưa Rào Tháng Sáu nghe! Bạn cần hỏi size hay mẫu nào?",
      replies: [
        { keys: ["size", "mac vua", "can nang", "chieu cao"], text: "Dưới 52kg mặc S, 53–60kg mặc M, 61–68kg mặc L, trên đó mặc XL. Không vừa thì đổi size trong 7 ngày." },
        { keys: ["gia", "bao nhieu", "tien"], text: "Giá ghi ngay dưới từng món. Sơ mi từ 259.000đ, áo thun từ 159.000đ." },
        { keys: ["ship", "giao", "van chuyen"], text: "Giao toàn quốc 2–4 ngày, được xem hàng trước khi nhận." },
        { keys: ["chuyen khoan", "thanh toan", "qr"], text: "Đặt xong, trang hiện sẵn mã QR đúng số tiền và mã đơn. Bạn cũng có thể trả tiền khi nhận hàng." },
      ],
      fallback: "Shop ghi lại rồi nha. Bạn hỏi thử về size, giá, giao hàng hoặc thanh toán nhé.",
    },
  };
})();
