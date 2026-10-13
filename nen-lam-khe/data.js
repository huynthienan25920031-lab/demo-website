/* Nến Lam Khê: shop nến thơm GIẢ ĐỊNH. Sản phẩm, giá và hình vẽ chỉ để minh họa. */
(function () {
  function color(name, hex, shade) { return { name: name, hex: hex, shade: shade, bg: "#2a2536" }; }
  var IVORY = color("Trắng ngà", "#EFE6D2", "#B9A988"), LAVENDER = color("Tím oải hương", "#B9A3DA", "#6C4E9A"), MOSS = color("Xanh rêu", "#93A68B", "#56694F"),
    AMBER = color("Hổ phách", "#E2A24C", "#9A6420"), ROSE = color("Hồng đất", "#D9A79B", "#9C5F52"), SLATE = color("Xám đá", "#8E94A3", "#555B6B");

  function flame(x, y) {
    return '<path d="M' + x + " " + y + " c-16 28 -12 44 0 56 c12 -12 16 -28 0 -56 Z" + '" fill="#F2A33A"/><path d="M' + x + " " + (y + 24) + ' c-7 13 -5 22 0 28 c5 -6 7 -15 0 -28 Z" fill="#FFE08A"/><rect x="' + (x - 3) + '" y="' + (y + 54) + '" width="6" height="20" rx="3" fill="#2b2118"/>';
  }
  var art = {
    jar: function (c) {
      return flame(100, 22) + '<rect x="40" y="96" width="120" height="140" rx="20" fill="' + c.hex + '"/><rect x="40" y="96" width="120" height="22" rx="11" fill="#fff" opacity="0.4"/>' +
        '<rect x="58" y="146" width="84" height="54" rx="8" fill="' + c.shade + '"/><rect x="70" y="162" width="60" height="7" rx="3" fill="#fff" opacity="0.85"/><rect x="80" y="178" width="40" height="6" rx="3" fill="#fff" opacity="0.6"/>';
    },
    pillar: function (c) {
      return flame(100, 14) + '<rect x="64" y="88" width="72" height="150" rx="10" fill="' + c.hex + '"/><path d="M64 110 q18 14 36 0 t36 0 v-12 a10 10 0 0 0 -10 -10 h-52 a10 10 0 0 0 -10 10 Z" fill="' + c.shade + '" opacity="0.55"/>';
    },
    set: function (c) {
      return flame(62, 60) + flame(138, 40) + '<rect x="24" y="134" width="76" height="100" rx="14" fill="' + c.hex + '"/><rect x="38" y="166" width="48" height="34" rx="6" fill="' + c.shade + '"/>' +
        '<rect x="104" y="114" width="72" height="120" rx="14" fill="' + c.shade + '"/><rect x="116" y="150" width="48" height="40" rx="6" fill="' + c.hex + '"/><path d="M20 236 h160" stroke="' + c.hex + '" stroke-width="6" stroke-linecap="round"/>';
    },
  };

  window.SHOP = {
    id: "nen-lam-khe",
    name: "Nến Lam Khê",
    brandHtml: "Nến <span>Lam Khê</span>",
    orderPrefix: "NLK",
    optionNames: { size: "Dung tích", color: "Màu sáp" },
    hero: { eyebrow: "Nến thơm thủ công", title: "Một góc nhà bình yên", text: "Sáp đậu nành, tinh dầu thiên nhiên, đổ tay từng mẻ nhỏ.", cta: "Chọn mùi hương" },
    perks: [["Sáp đậu nành", "ít khói"], ["Bấc cotton", "cháy đều"], ["Gói quà", "theo yêu cầu"]],
    categories: [{ id: "hu", name: "Nến hũ" }, { id: "tru", name: "Nến trụ" }, { id: "qua", name: "Bộ quà tặng" }],
    priceRanges: [{ id: "a", label: "Dưới 150k", min: 0, max: 150000 }, { id: "b", label: "150k – 300k", min: 150000, max: 300001 }, { id: "c", label: "Trên 300k", min: 300001, max: Infinity }],
    products: [
      { id: "oai-huong-diu", name: "Oải hương dịu", cat: "hu", art: "jar", price: 129000, sizePrice: { "100g": 129000, "200g": 219000, "300g": 299000 }, sizes: ["100g", "200g", "300g"], stock: { "300g": 2 }, colors: [LAVENDER, IVORY], desc: "Oải hương pha chút vani. Hợp thắp trước giờ ngủ." },
      { id: "go-tuyet-tung", name: "Gỗ tuyết tùng", cat: "hu", art: "jar", price: 139000, sizePrice: { "100g": 139000, "200g": 239000, "300g": 319000 }, sizes: ["100g", "200g", "300g"], stock: { "100g": 3, "300g": 0 }, colors: [MOSS, SLATE], desc: "Mùi gỗ ấm, trầm. Hợp phòng làm việc." },
      { id: "cam-que-am", name: "Cam quế ấm", cat: "hu", art: "jar", price: 129000, sizePrice: { "100g": 129000, "200g": 219000 }, sizes: ["100g", "200g"], colors: [AMBER, IVORY], desc: "Vỏ cam và quế. Hợp những ngày se lạnh." },
      { id: "tra-trang-som", name: "Trà trắng sớm", cat: "hu", art: "jar", price: 149000, sizePrice: { "200g": 249000, "300g": 329000 }, sizes: ["200g", "300g"], colors: [IVORY, MOSS], desc: "Trà trắng thanh, nhẹ. Hợp phòng khách." },
      { id: "tru-moc-nho", name: "Nến trụ mộc nhỏ", cat: "tru", art: "pillar", price: 89000, sizes: ["100g", "200g"], sizePrice: { "100g": 89000, "200g": 139000 }, colors: [IVORY, ROSE, SLATE], desc: "Nến trụ không mùi, để bàn ăn hoặc trang trí." },
      { id: "tru-hoa-hong-kho", name: "Nến trụ hoa hồng khô", cat: "tru", art: "pillar", price: 159000, sizes: ["200g", "300g"], sizePrice: { "200g": 159000, "300g": 219000 }, colors: [ROSE, IVORY], desc: "Thoảng mùi hoa hồng khô, thân nến có vân tay đổ." },
      { id: "bo-qua-doi", name: "Bộ quà đôi", cat: "qua", art: "set", price: 349000, sizes: ["100g", "200g"], sizePrice: { "100g": 349000, "200g": 459000 }, colors: [LAVENDER, AMBER], desc: "Hai hũ nến cùng dung tích bạn chọn, hộp giấy cứng và thiệp viết tay." },
      { id: "bo-qua-tan-gia", name: "Bộ quà tân gia", cat: "qua", art: "set", price: 489000, sizes: ["200g"], colors: [MOSS, IVORY], desc: "Một hũ nến 200g, một nến trụ và hộp diêm dài." },
    ],
    draw: function (p, c, w) {
      return '<svg viewBox="0 0 200 250" width="' + w + '" height="' + Math.round(w * 1.25) + '" role="img" aria-label="' + p.name + ", " + c.name + '">' + art[p.art](c) + "</svg>";
    },
    chat: {
      greeting: "Lam Khê chào bạn. Bạn thích mùi hương nhẹ hay ấm ạ?",
      replies: [
        { keys: ["mui", "huong", "thom"], text: "Mùi nhẹ thì bạn thử Trà trắng sớm hoặc Oải hương dịu. Thích ấm thì Gỗ tuyết tùng, Cam quế ấm." },
        { keys: ["gia", "bao nhieu", "tien"], text: "Nến hũ 100g từ 129.000đ. Giá theo dung tích hiện ngay khi bạn chọn." },
        { keys: ["ship", "giao", "van chuyen"], text: "Shop giao toàn quốc, bọc chống sốc. Thường 2–4 ngày." },
        { keys: ["qua", "tang", "goi"], text: "Shop có bộ quà đôi và bộ tân gia, kèm thiệp viết tay theo lời bạn nhắn." },
      ],
      fallback: "Lam Khê ghi nhận rồi ạ. Bạn có thể hỏi về mùi hương, giá, giao hàng hoặc gói quà.",
    },
  };
})();
