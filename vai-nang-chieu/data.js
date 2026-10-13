/* Vải Nắng Chiều: shop thời trang GIẢ ĐỊNH. Sản phẩm, giá và hình vẽ chỉ để minh họa. */
(function () {
  function color(name, hex, shade) { return { name: name, hex: hex, shade: shade, bg: hex + "26" }; }
  var TERRACOTTA = color("Cam đất", "#C97B4A", "#8E4E2A"), SAGE = color("Xanh rêu", "#7E9A84", "#4E6B56"), SAND = color("Be cát", "#D9B7A0", "#A8785B"),
    SKY = color("Xanh trời", "#8FA6C4", "#5B7397"), ROSE = color("Hồng khói", "#C98A9A", "#96566A"), HONEY = color("Vàng mật", "#E4C16F", "#B08A34");

  var art = {
    dress: function (c) {
      return '<path d="M72 18 L60 50 L40 62 L52 92 L70 84 L62 232 L138 232 L130 84 L148 92 L160 62 L140 50 L128 18 Q100 40 72 18 Z" fill="' + c.hex + '"/>' +
        '<path d="M72 18 Q100 40 128 18 L122 34 Q100 52 78 34 Z" fill="' + c.shade + '"/><path d="M66 150 L134 150 L138 232 L62 232 Z" fill="' + c.shade + '" opacity="0.35"/><rect x="68" y="112" width="64" height="9" rx="4" fill="' + c.shade + '"/>';
    },
    top: function (c) {
      return '<path d="M70 40 L30 62 L14 112 L46 124 L56 100 L56 210 L144 210 L144 100 L154 124 L186 112 L170 62 L130 40 Q100 66 70 40 Z" fill="' + c.hex + '"/>' +
        '<path d="M70 40 Q100 66 130 40 L120 36 Q100 54 80 36 Z" fill="' + c.shade + '"/><path d="M56 186 L144 186 L144 210 L56 210 Z" fill="' + c.shade + '" opacity="0.35"/>';
    },
    pants: function (c) {
      return '<path d="M60 24 L140 24 L150 232 L108 232 L100 96 L92 232 L50 232 Z" fill="' + c.hex + '"/><rect x="60" y="24" width="80" height="16" fill="' + c.shade + '"/>' +
        '<path d="M100 40 L100 96" stroke="' + c.shade + '" stroke-width="4"/>';
    },
  };

  window.SHOP = {
    id: "vai-nang-chieu",
    name: "Vải Nắng Chiều",
    brandHtml: "Vải <span>Nắng Chiều</span>",
    orderPrefix: "VNC",
    optionNames: { size: "Size", color: "Màu" },
    hero: { eyebrow: "Bộ sưu tập thu", title: "Mặc nhẹ như nắng cuối ngày", text: "Linen và lụa may kỹ từng đường kim, cho những ngày thong thả.", cta: "Xem bộ sưu tập" },
    perks: [["Đổi trả", "trong 7 ngày"], ["Giao hàng", "toàn quốc"], ["Kiểm hàng", "trước khi nhận"]],
    categories: [{ id: "dam", name: "Đầm" }, { id: "ao", name: "Áo" }, { id: "quan", name: "Quần" }],
    priceRanges: [{ id: "a", label: "Dưới 350k", min: 0, max: 350000 }, { id: "b", label: "350k – 400k", min: 350000, max: 400001 }, { id: "c", label: "Trên 400k", min: 400001, max: Infinity }],
    products: [
      { id: "dam-linen-co-vuong", name: "Đầm linen cổ vuông", cat: "dam", art: "dress", price: 389000, sizes: ["S", "M", "L", "XL"], stock: { S: 3, XL: 1 }, colors: [TERRACOTTA, SAGE, SKY], desc: "Linen dệt thưa, cổ vuông, có túi hai bên. Dáng suông che bụng, hợp đi làm lẫn đi chơi." },
      { id: "dam-suong-tay-lo", name: "Đầm suông tay lỡ", cat: "dam", art: "dress", price: 349000, sizes: ["S", "M", "L"], stock: { M: 2 }, colors: [SAGE, SAND], desc: "Tay lỡ che bắp tay, vải đũi mềm, ít nhăn." },
      { id: "dam-hai-day-lua", name: "Đầm hai dây lụa", cat: "dam", art: "dress", price: 429000, sizes: ["S", "M", "L"], colors: [SAND, ROSE], desc: "Lụa satin rủ, dây vai chỉnh được độ dài." },
      { id: "dam-so-mi-ke", name: "Đầm sơ mi kẻ", cat: "dam", art: "dress", price: 369000, sizes: ["M", "L", "XL"], colors: [SKY, TERRACOTTA], desc: "Kẻ sọc nhỏ, thắt eo bằng dây rời." },
      { id: "dam-xoe-co-tim", name: "Đầm xòe cổ tim", cat: "dam", art: "dress", price: 399000, sizes: ["S", "M", "L"], colors: [ROSE, HONEY], desc: "Chân váy xòe nhẹ, cổ tim tôn xương quai xanh." },
      { id: "dam-maxi-di-bien", name: "Đầm maxi đi biển", cat: "dam", art: "dress", price: 459000, sizes: ["S", "M", "L", "XL"], colors: [HONEY, SKY, ROSE], desc: "Dài qua mắt cá, vải voan hai lớp, không lộ." },
      { id: "ao-linen-tay-lo", name: "Áo linen tay lỡ", cat: "ao", art: "top", price: 289000, sizes: ["S", "M", "L", "XL"], colors: [SAND, SAGE, TERRACOTTA], desc: "Áo linen cổ tròn, mặc cùng quần suông hay chân váy đều hợp." },
      { id: "ao-lua-co-tru", name: "Áo lụa cổ trụ", cat: "ao", art: "top", price: 319000, sizes: ["S", "M", "L"], colors: [ROSE, SKY], desc: "Lụa mát, cổ trụ kín đáo, hợp mặc đi làm." },
      { id: "quan-suong-linen", name: "Quần suông linen", cat: "quan", art: "pants", price: 329000, sizes: ["S", "M", "L", "XL"], colors: [SAND, SAGE], desc: "Cạp chun sau, ống suông dài, đứng dáng." },
      { id: "quan-lung-ong-rong", name: "Quần lửng ống rộng", cat: "quan", art: "pants", price: 299000, sizes: ["M", "L"], colors: [TERRACOTTA, SKY], desc: "Dài ngang bắp chân, mát và dễ vận động." },
    ],
    draw: function (p, c, w) {
      return '<svg viewBox="0 0 200 250" width="' + w + '" height="' + Math.round(w * 1.25) + '" role="img" aria-label="' + p.name + ", " + c.name + '">' + art[p.art](c) + "</svg>";
    },
    chat: {
      greeting: "Vải Nắng Chiều xin chào! Bạn cần tư vấn size hay mẫu nào ạ?",
      replies: [
        { keys: ["size", "mac vua", "can nang", "chieu cao"], text: "Bạn cho shop chiều cao và cân nặng nhé. Thường 45–52kg mặc S, 53–58kg mặc M, 59–65kg mặc L." },
        { keys: ["gia", "bao nhieu", "tien"], text: "Giá từng mẫu hiện ngay dưới tên sản phẩm bạn nhé. Mẫu đầm từ 349.000đ." },
        { keys: ["ship", "giao", "van chuyen"], text: "Shop giao toàn quốc, thường 2–4 ngày. Bạn được kiểm hàng trước khi nhận." },
        { keys: ["doi", "tra"], text: "Shop nhận đổi trả trong 7 ngày nếu hàng còn nguyên tem." },
      ],
      fallback: "Shop ghi nhận rồi ạ. Bạn có thể bấm Đặt ngay ở mẫu mình thích, hoặc hỏi shop về size, giá, giao hàng.",
    },
  };
})();
