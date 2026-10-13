/*
 * Bộ máy chung của các website demo: trang chủ, catalog có lọc, trang sản phẩm, giỏ hàng,
 * form đặt hàng, trang đặt hàng thành công có mã QR MẪU, và khung "Chat với shop" giả lập.
 * Mỗi demo khai báo window.SHOP trong data.js và có theme.css riêng.
 * KHÔNG gửi dữ liệu đi đâu: giỏ hàng và đơn hàng chỉ lưu trong localStorage của trình duyệt.
 */
(function () {
  "use strict";
  var S = window.SHOP;
  var app = document.getElementById("app");
  var DESIGNER = { name: "Thiên Ân", zalo: "0908 706 813", zaloUrl: "https://zalo.me/0908706813" };

  // ── Tiện ích ──────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function money(n) { return n.toLocaleString("vi-VN") + "đ"; }
  function byId(id) { return S.products.filter(function (p) { return p.id === id; })[0]; }
  function priceOf(p, size) { return (p.sizePrice && p.sizePrice[size]) || p.price; }

  // localStorage có thể bị chặn (chế độ ẩn danh, cài đặt riêng tư): khi đó giữ tạm trong bộ nhớ.
  var memory = {};
  function load(key, fallback) {
    try { var v = localStorage.getItem("demo-" + S.id + "-" + key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return key in memory ? memory[key] : fallback; }
  }
  function save(key, value) {
    memory[key] = value;
    try { localStorage.setItem("demo-" + S.id + "-" + key, JSON.stringify(value)); } catch (e) { /* giữ trong bộ nhớ */ }
  }

  var cart = load("cart", []);
  function cartCount() { return cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (n, l) { var p = byId(l.id); return n + (p ? priceOf(p, l.size) * l.qty : 0); }, 0); }
  function setCart(next) { cart = next.filter(function (l) { return l.qty > 0 && byId(l.id); }); save("cart", cart); paintCount(); }
  function paintCount() {
    var n = cartCount();
    Array.prototype.forEach.call(document.querySelectorAll("[data-cart-count]"), function (el) { el.textContent = n; el.hidden = n === 0; });
  }

  function art(p, colorIndex, w) {
    var c = p.colors[colorIndex || 0];
    return S.draw(p, c, w);
  }

  // ── Khung trang ───────────────────────────────────────────────────────────
  function shell() {
    document.body.insertAdjacentHTML("afterbegin",
      '<div class="sticky"><div class="demo-strip">Đây là website demo do ' + esc(DESIGNER.name) + ' thiết kế · <a href="' + DESIGNER.zaloUrl + '" target="_blank" rel="noopener">Zalo ' + DESIGNER.zalo + "</a></div>" +
      '<header class="top"><a class="logo" href="#/">' + S.brandHtml + "</a>" +
      '<nav><a href="#/catalog">Sản phẩm</a><a class="cart-link" href="#/cart" aria-label="Giỏ hàng">Giỏ hàng <b data-cart-count hidden>0</b></a></nav></header></div>');
    document.body.insertAdjacentHTML("beforeend",
      '<footer class="foot"><p><b>' + esc(S.name) + "</b> là shop giả định, không bán hàng thật. Sản phẩm, giá, mô tả và đánh giá chỉ để minh họa.</p>" +
      "<p>Hình sản phẩm là hình tự vẽ. Thông tin bạn nhập chỉ lưu tạm trên trình duyệt này, không gửi đi đâu. " +
      '<button type="button" class="linkish" id="wipe">Xóa dữ liệu demo</button></p>' +
      '<p>Website demo do ' + esc(DESIGNER.name) + ' thiết kế · <a href="' + DESIGNER.zaloUrl + '" target="_blank" rel="noopener">Zalo ' + DESIGNER.zalo + '</a> · <a href="#/khach-quen">Khách quen</a> · <a href="../">Xem các demo khác</a></p></footer>' +
      '<button type="button" class="chat-fab" id="chat-open">Chat với shop</button>' +
      '<section class="chat" id="chat" hidden aria-label="Chat với shop"><header><b>Chat với shop</b><span>Giả lập · trả lời tự động</span><button type="button" id="chat-close" aria-label="Đóng">×</button></header>' +
      '<div class="chat-log" id="chat-log"></div><form id="chat-form"><input id="chat-input" autocomplete="off" placeholder="Nhập câu hỏi…" aria-label="Tin nhắn"><button>Gửi</button></form></section>');
    document.getElementById("wipe").addEventListener("click", function () {
      ["cart", "orders", "points"].forEach(function (k) { delete memory[k]; try { localStorage.removeItem("demo-" + S.id + "-" + k); } catch (e) { /* bỏ qua */ } });
      cart = []; paintCount(); location.hash = "#/"; route(); toast("Đã xóa dữ liệu demo trên trình duyệt này");
    });
    chat();
  }

  function toast(text) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = text; t.setAttribute("role", "status");
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  function card(p) {
    return '<a class="card" href="#/p/' + p.id + '"><div class="pic" style="background:' + p.colors[0].bg + '">' + art(p, 0, 160) + "</div>" +
      '<div class="meta"><span class="cat">' + esc(catName(p.cat)) + "</span><b>" + esc(p.name) + "</b><i>" + (p.sizePrice ? "Từ " : "") + money(p.price) + "</i></div></a>";
  }
  function catName(id) { var c = S.categories.filter(function (x) { return x.id === id; })[0]; return c ? c.name : ""; }

  // ── Trang chủ ─────────────────────────────────────────────────────────────
  function home() {
    var featured = S.products.slice(0, 4);
    app.innerHTML =
      '<section class="hero"><div class="hero-text"><small>' + esc(S.hero.eyebrow) + "</small><h1>" + esc(S.hero.title) + "</h1><p>" + esc(S.hero.text) + '</p><a class="btn" href="#/catalog">' + esc(S.hero.cta) + "</a></div>" +
      '<div class="hero-art">' + art(featured[0], 0, 260) + "</div></section>" +
      '<section class="perks">' + S.perks.map(function (k) { return "<div><b>" + esc(k[0]) + "</b><span>" + esc(k[1]) + "</span></div>"; }).join("") + "</section>" +
      '<section class="block"><div class="block-head"><h2>Được chọn nhiều</h2><a href="#/catalog">Xem tất cả →</a></div><div class="grid">' + featured.map(card).join("") + "</div></section>" +
      sizeChart() + reviews() +
      '<section class="block"><div class="loyal-teaser"><div><h2>Khách quen tích điểm</h2><p>Mỗi ' + money(POINT_EVERY) + ' trong đơn được 1 điểm. Đủ điểm là lên hạng, có ưu đãi riêng.</p></div><a class="btn ghost" href="#/khach-quen">Xem điểm</a></div></section>' +
      '<section class="block cats"><h2>Tìm theo loại</h2><div class="chips">' + S.categories.map(function (c) { return '<a class="chip" href="#/catalog?cat=' + c.id + '">' + esc(c.name) + "</a>"; }).join("") + "</div></section>";
  }

  // Bảng size và đánh giá: shop nào khai báo trong data.js thì trang chủ mới hiện.
  function sizeChart() {
    var c = S.sizeChart;
    if (!c) return "";
    return '<section class="block" id="bang-size"><h2>Bảng size</h2><div class="table-wrap"><table class="size-table"><thead><tr>' + c.cols.map(function (h) { return '<th scope="col">' + esc(h) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      c.rows.map(function (r) { return "<tr>" + r.map(function (v, i) { return i === 0 ? '<th scope="row">' + esc(v) + "</th>" : "<td>" + esc(v) + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div>" + (c.note ? '<p class="fine">' + esc(c.note) + "</p>" : "") + "</section>";
  }
  function reviews() {
    if (!S.reviews) return "";
    return '<section class="block" id="danh-gia"><h2>Khách nói gì</h2><p class="fine">Đánh giá minh họa của website demo; tên khách là tên giả.</p><div class="reviews">' +
      S.reviews.map(function (r) {
        return '<figure class="review"><div class="stars" role="img" aria-label="' + r.stars + ' trên 5 sao">' + "★★★★★".slice(0, r.stars) + '</div><blockquote>' + esc(r.text) + "</blockquote><figcaption>" + esc(r.name) + " · " + esc(r.bought) + "</figcaption></figure>";
      }).join("") + "</div></section>";
  }

  // ── Catalog có lọc ────────────────────────────────────────────────────────
  var filter = { cat: "", size: "", price: "" };
  function catalog(query) {
    if (query && query.cat !== undefined) filter.cat = query.cat;
    var sizes = [];
    S.products.forEach(function (p) { p.sizes.forEach(function (s) { if (sizes.indexOf(s) < 0) sizes.push(s); }); });
    function group(key, label, options) {
      return '<fieldset class="filter"><legend>' + esc(label) + '</legend><div class="chips">' +
        [["", "Tất cả"]].concat(options).map(function (o) {
          return '<button type="button" class="chip' + (filter[key] === o[0] ? " on" : "") + '" data-filter="' + key + '" data-value="' + esc(o[0]) + '" aria-pressed="' + (filter[key] === o[0]) + '">' + esc(o[1]) + "</button>";
        }).join("") + "</div></fieldset>";
    }
    var range = S.priceRanges.filter(function (r) { return r.id === filter.price; })[0];
    var list = S.products.filter(function (p) {
      return (!filter.cat || p.cat === filter.cat) && (!filter.size || p.sizes.indexOf(filter.size) >= 0) && (!range || (p.price >= range.min && p.price < range.max));
    });
    app.innerHTML = '<section class="block"><h1 class="page-title">Sản phẩm</h1>' +
      group("cat", "Loại", S.categories.map(function (c) { return [c.id, c.name]; })) +
      group("size", S.optionNames.size, sizes.map(function (s) { return [s, s]; })) +
      group("price", "Giá", S.priceRanges.map(function (r) { return [r.id, r.label]; })) +
      '<p class="count" role="status">' + list.length + " sản phẩm</p>" +
      (list.length ? '<div class="grid">' + list.map(card).join("") + "</div>" : '<p class="empty">Không có sản phẩm nào khớp bộ lọc. <button type="button" class="linkish" data-reset>Bỏ lọc</button></p>') + "</section>";
  }

  // ── Trang sản phẩm ────────────────────────────────────────────────────────
  var pick = { size: "", color: 0 };
  function product(id) {
    var p = byId(id);
    if (!p) { app.innerHTML = '<section class="block"><p class="empty">Không tìm thấy sản phẩm. <a href="#/catalog">Về trang sản phẩm</a></p></section>'; return; }
    if (pick.id !== id) pick = { id: id, size: p.sizes.length === 1 ? p.sizes[0] : "", color: 0 };
    var c = p.colors[pick.color];
    app.innerHTML = '<section class="product"><a class="back" href="#/catalog">← Sản phẩm</a>' +
      '<div class="product-pic" style="background:' + c.bg + '">' + art(p, pick.color, 300) + "</div>" +
      '<div class="product-info"><span class="cat">' + esc(catName(p.cat)) + "</span><h1>" + esc(p.name) + '</h1><div class="price">' + money(priceOf(p, pick.size)) + "</div><p>" + esc(p.desc) + "</p>" +
      '<fieldset class="opt"><legend>' + esc(S.optionNames.size) + '</legend><div class="chips">' + p.sizes.map(function (s) {
        var left = leftOf(p, s);
        return '<button type="button" class="chip' + (pick.size === s ? " on" : "") + (left <= LOW_STOCK ? " low" : "") + '" data-size="' + esc(s) + '" aria-pressed="' + (pick.size === s) + '"' + (left === 0 ? " disabled" : "") + ">" + esc(s) + "</button>";
      }).join("") + "</div>" + stockLine(p) + "</fieldset>" +
      '<fieldset class="opt"><legend>' + esc(S.optionNames.color) + ": <b>" + esc(c.name) + '</b></legend><div class="swatches">' + p.colors.map(function (k, i) {
        return '<button type="button" class="swatch' + (pick.color === i ? " on" : "") + '" data-color="' + i + '" style="background:' + k.hex + '" aria-label="' + esc(k.name) + '" aria-pressed="' + (pick.color === i) + '"></button>';
      }).join("") + "</div></fieldset>" +
      '<p class="hint" id="size-hint" role="alert" hidden>Chọn ' + esc(S.optionNames.size.toLowerCase()) + " trước khi thêm vào giỏ.</p>" +
      '<div class="buybar"><button type="button" class="btn ghost" data-add>Thêm vào giỏ</button><button type="button" class="btn" data-buy>Đặt ngay</button></div></div></section>';
  }
  // Tồn kho theo từng size (số giả định trong data.js): không ghi thì coi như còn nhiều; từ 3 trở xuống là "Sắp hết"; 0 là hết.
  var LOW_STOCK = 3;
  function leftOf(p, size) { return p.stock && size in p.stock ? p.stock[size] : 99; }
  function stockLine(p) {
    var name = S.optionNames.size;
    if (!pick.size) return '<p class="stock" role="status">Chọn ' + esc(name.toLowerCase()) + " để xem còn hàng không.</p>";
    var left = leftOf(p, pick.size);
    return left <= LOW_STOCK
      ? '<p class="stock stock-low" role="status">' + esc(name) + " " + esc(pick.size) + ": <b>Sắp hết</b>, còn " + left + "</p>"
      : '<p class="stock stock-ok" role="status">' + esc(name) + " " + esc(pick.size) + ": <b>Còn hàng</b></p>";
  }
  function addToCart(goCheckout) {
    var p = byId(pick.id);
    if (!pick.size) { var h = document.getElementById("size-hint"); h.hidden = false; h.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    var color = p.colors[pick.color].name;
    var line = cart.filter(function (l) { return l.id === p.id && l.size === pick.size && l.color === color; })[0];
    if (line) line.qty += 1; else cart.push({ id: p.id, size: pick.size, color: color, colorIndex: pick.color, qty: 1 });
    setCart(cart);
    if (goCheckout) location.hash = "#/checkout"; else toast("Đã thêm vào giỏ hàng");
  }

  // ── Giỏ hàng ──────────────────────────────────────────────────────────────
  function lines(editable) {
    return cart.map(function (l, i) {
      var p = byId(l.id);
      return '<div class="line"><div class="pic" style="background:' + p.colors[l.colorIndex || 0].bg + '">' + art(p, l.colorIndex, 70) + "</div>" +
        '<div class="line-info"><b>' + esc(p.name) + "</b><span>" + esc(l.size) + " · " + esc(l.color) + "</span><i>" + money(priceOf(p, l.size)) + "</i></div>" +
        (editable ? '<div class="qty"><button type="button" data-qty="' + i + '" data-step="-1" aria-label="Bớt một">−</button><span>' + l.qty + '</span><button type="button" data-qty="' + i + '" data-step="1" aria-label="Thêm một">+</button></div>' : '<div class="qty"><span>× ' + l.qty + "</span></div>") + "</div>";
    }).join("");
  }
  function cartPage() {
    if (!cart.length) { app.innerHTML = '<section class="block"><h1 class="page-title">Giỏ hàng</h1><p class="empty">Giỏ hàng đang trống. <a href="#/catalog">Xem sản phẩm</a></p></section>'; return; }
    app.innerHTML = '<section class="block narrow"><h1 class="page-title">Giỏ hàng</h1>' + lines(true) +
      '<div class="total"><span>Tạm tính</span><b>' + money(cartTotal()) + '</b></div><a class="btn wide" href="#/checkout">Đặt hàng</a><a class="back center" href="#/catalog">Mua thêm</a></section>';
  }

  // ── Form đặt hàng ─────────────────────────────────────────────────────────
  // Phí ship theo khu vực và mã giảm giá: bảng phí và mã đều là GIẢ ĐỊNH của website demo, không theo hãng giao hàng nào.
  var AREAS = [
    { name: "TP. Hồ Chí Minh", fee: 18000, districts: ["Quận 1", "Quận 7", "Bình Thạnh", "TP. Thủ Đức"] },
    { name: "Hà Nội", fee: 30000, districts: ["Ba Đình", "Cầu Giấy", "Hà Đông"] },
    { name: "Đà Nẵng", fee: 30000, districts: ["Hải Châu", "Sơn Trà"] },
    { name: "Cần Thơ", fee: 28000, districts: ["Ninh Kiều", "Cái Răng"] },
    { name: "Tỉnh, thành khác", fee: 38000, districts: ["Trung tâm tỉnh, thành", "Huyện, xã"] },
  ];
  var COUPONS = {
    FREESHIP: { label: "Miễn phí ship, tối đa 30.000đ", off: function (sub, ship) { return Math.min(ship, 30000); } },
    KHACHQUEN: { label: "Giảm 5% cho khách quen", off: function (sub) { return Math.round((sub * 0.05) / 1000) * 1000; } },
  };
  var SUGGESTED = "FREESHIP";
  // `auto`: mã gợi ý tự áp ngay khi biết phí ship, trừ khi khách đã tự gỡ mã.
  var draft = { province: "", district: "", coupon: "", auto: true };
  function areaOf(name) { return AREAS.filter(function (a) { return a.name === name; })[0]; }
  function quote() {
    var sub = cartTotal(), area = areaOf(draft.province), known = Boolean(area && draft.district), ship = known ? area.fee : 0;
    var c = COUPONS[draft.coupon], off = c ? c.off(sub, ship) : 0;
    return { sub: sub, ship: ship, known: known, off: off, total: sub + ship - off };
  }
  function paintQuote(flash) {
    var box = document.getElementById("quote");
    if (!box) return;
    var q = quote();
    box.innerHTML = '<div><span>Tạm tính</span><b>' + money(q.sub) + "</b></div>" +
      '<div><span>Phí ship' + (q.known ? " · " + esc(draft.province) : "") + "</span><b>" + (q.known ? money(q.ship) : "Chọn khu vực để tính") + "</b></div>" +
      (draft.coupon ? '<div class="quote-off"><span>Mã ' + esc(draft.coupon) + ' <button type="button" class="linkish" data-uncoupon>Gỡ</button></span><b>' + (q.off ? "−" + money(q.off) : "Chọn khu vực để áp") + "</b></div>" : "") +
      '<div class="quote-total"><span>Tổng tiền</span><b>' + money(q.total) + "</b></div>";
    if (flash) { box.classList.remove("flash"); void box.offsetWidth; box.classList.add("flash"); }
  }
  function option(value, label, selected) { return '<option value="' + esc(value) + '"' + (selected ? " selected" : "") + ">" + esc(label) + "</option>"; }
  function districtOptions() {
    var area = areaOf(draft.province);
    return option("", area ? "Chọn quận, huyện" : "Chọn tỉnh, thành trước", !draft.district) + (area ? area.districts.map(function (d) { return option(d, d, d === draft.district); }).join("") : "");
  }
  function select(name, label, optionsHtml, disabled) {
    return '<label class="field"><span>' + label + '</span><select name="' + name + '" aria-describedby="err-' + name + '"' + (disabled ? " disabled" : "") + ">" + optionsHtml + '</select><em id="err-' + name + '" role="alert"></em></label>';
  }
  function applyCoupon(code, byHand) {
    var form = document.getElementById("order"), err = document.getElementById("err-coupon");
    code = code.trim().toUpperCase();
    if (!COUPONS[code]) { err.textContent = code ? "Mã không hợp lệ. Thử mã gợi ý " + SUGGESTED + "." : "Nhập mã giảm giá."; return; }
    err.textContent = "";
    draft.coupon = code;
    if (byHand) draft.auto = false;
    form.coupon.value = code;
    paintQuote(true);
    toast((byHand ? "Đã áp mã " : "Đã tự áp mã ") + code + ": " + COUPONS[code].label);
  }
  function checkout() {
    if (!cart.length) { location.hash = "#/cart"; return; }
    app.innerHTML = '<section class="block narrow"><h1 class="page-title">Đặt hàng</h1>' + lines(false) +
      '<form id="order" novalidate>' +
      field("name", "Họ và tên", "text", "name", "Ví dụ: Trần Thị Ví Dụ") +
      field("phone", "Số điện thoại", "tel", "tel", "Ví dụ: 0901234567") +
      field("address", "Số nhà, tên đường", "text", "street-address", "Ví dụ: 12 Đường Mẫu") +
      // Khu vực nằm ngay trên bảng tiền: chọn xong là thấy phí ship, mã giảm giá và tổng tiền đổi trong cùng một màn hình.
      '<div class="two">' +
      select("province", "Tỉnh, thành", option("", "Chọn tỉnh, thành", !draft.province) + AREAS.map(function (a) { return option(a.name, a.name, a.name === draft.province); }).join(""), false) +
      select("district", "Quận, huyện", districtOptions(), !draft.province) +
      "</div>" +
      '<div class="quote" id="quote" aria-live="polite"></div>' +
      '<div class="field"><label for="coupon"><span>Mã giảm giá</span></label><div class="coupon-row"><input id="coupon" name="coupon" autocomplete="off" autocapitalize="characters" placeholder="Nhập mã" value="' + esc(draft.coupon) + '" aria-describedby="err-coupon"><button type="button" class="btn ghost" data-coupon>Áp dụng</button></div><em id="err-coupon" role="alert"></em>' +
      '<p class="fine">Mã gợi ý <button type="button" class="chip mini" data-suggest>' + SUGGESTED + "</button> tự áp khi đã chọn khu vực. Bảng phí ship và mã giảm giá là giả định.</p></div>" +
      '<label class="check"><input type="checkbox" name="consent"><span>Tôi đồng ý nhận tin ưu đãi từ ' + esc(S.name) + " qua số điện thoại này (không bắt buộc)</span></label>" +
      '<p class="privacy">Đây là website demo: thông tin bạn nhập chỉ lưu tạm trên trình duyệt này để mô phỏng, không gửi cho ai.</p>' +
      '<button class="btn wide">Xác nhận đặt hàng</button></form>' +
      '<p class="ask">Cần hỏi thêm trước khi đặt? <button type="button" class="linkish" data-chat>Chat với shop</button></p></section>';
    paintQuote(false);
  }
  /** Khách đổi tỉnh hoặc quận: phí ship hiện ngay, mã gợi ý tự áp lần đầu biết phí ship. */
  function areaChanged(target) {
    var form = document.getElementById("order");
    if (target.name === "province") {
      draft.province = target.value; draft.district = "";
      form.district.innerHTML = districtOptions();
      form.district.disabled = !draft.province;
    } else {
      draft.district = target.value;
    }
    paintQuote(true);
    // Phí ship hiện trước; một nhịp sau mã gợi ý mới tự áp, để khách kịp thấy tổng tiền thay đổi.
    if (quote().known && draft.auto && !draft.coupon) setTimeout(function () { if (document.getElementById("order") && quote().known && draft.auto && !draft.coupon) applyCoupon(SUGGESTED, false); }, 700);
  }
  function field(name, label, type, auto, placeholder) {
    return '<label class="field"><span>' + label + '</span><input name="' + name + '" type="' + type + '" autocomplete="' + auto + '" placeholder="' + esc(placeholder) + '" aria-describedby="err-' + name + '"><em id="err-' + name + '" role="alert"></em></label>';
  }
  function submitOrder(form) {
    var street = form.address.value.trim();
    var data = { name: form.name.value.trim(), phone: form.phone.value.replace(/[\s.\-]/g, ""), address: [street, form.district.value, form.province.value].filter(Boolean).join(", "), consent: form.consent.checked };
    var errors = {
      name: data.name.length < 2 ? "Nhập họ và tên." : "",
      phone: /^(0|\+84)\d{9}$/.test(data.phone) ? "" : "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.",
      province: form.province.value ? "" : "Chọn tỉnh, thành để tính phí ship.",
      district: form.district.value ? "" : "Chọn quận, huyện.",
      address: street.length < 4 ? "Nhập số nhà, tên đường." : "",
    };
    var first = null;
    Object.keys(errors).forEach(function (k) {
      document.getElementById("err-" + k).textContent = errors[k];
      form[k].setAttribute("aria-invalid", errors[k] ? "true" : "false");
      if (errors[k] && !first) first = form[k];
    });
    if (first) { first.focus(); return; }
    var orders = load("orders", []);
    var code = S.orderPrefix + String(1001 + orders.length);
    var q = quote(), earned = Math.floor(q.total / POINT_EVERY);
    orders.push({ code: code, at: new Date().toISOString(), subtotal: q.sub, shipping: q.ship, discount: q.off, coupon: q.off ? draft.coupon : "", total: q.total, points: earned, items: cart.slice(), customer: data });
    save("orders", orders);
    save("points", load("points", 0) + earned);
    draft.coupon = ""; draft.auto = true;
    setCart([]);
    location.hash = "#/success/" + code;
  }

  // ── Đặt hàng thành công + mã QR MẪU ───────────────────────────────────────
  /** Hình giống mã QR nhưng là ô vuông ngẫu nhiên theo mã đơn, có chữ "MẪU" ở giữa: không quét được. */
  function fakeQr(seedText, size) {
    var n = 25, c = size / n, s = 7;
    for (var i = 0; i < seedText.length; i++) s = (s * 31 + seedText.charCodeAt(i)) & 0x7fffffff;
    function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }
    function inFinder(x, y) { return (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9); }
    var cells = "";
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      if (inFinder(x, y) || (x > 7 && x < 17 && y > 9 && y < 15) || rnd() < 0.52) continue;
      cells += '<rect x="' + (x * c) + '" y="' + (y * c) + '" width="' + c + '" height="' + c + '"/>';
    }
    function finder(fx, fy) {
      return '<rect x="' + fx * c + '" y="' + fy * c + '" width="' + 7 * c + '" height="' + 7 * c + '" rx="' + c + '"/><rect x="' + (fx + 1) * c + '" y="' + (fy + 1) * c + '" width="' + 5 * c + '" height="' + 5 * c + '" rx="' + c * 0.6 + '" fill="#fff"/><rect x="' + (fx + 2) * c + '" y="' + (fy + 2) * c + '" width="' + 3 * c + '" height="' + 3 * c + '" rx="' + c * 0.4 + '"/>';
    }
    return '<svg viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '" fill="#222" role="img" aria-label="Mã QR mẫu, không quét được">' + cells + finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7) +
      '<rect x="' + 8.4 * c + '" y="' + 10.3 * c + '" width="' + 8.2 * c + '" height="' + 4.4 * c + '" rx="' + c + '" fill="#C0392B"/><text x="' + size / 2 + '" y="' + 13.5 * c + '" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="' + 2.9 * c + '" fill="#fff">MẪU</text></svg>';
  }
  function success(code) {
    var order = load("orders", []).filter(function (o) { return o.code === code; })[0];
    if (!order) { app.innerHTML = '<section class="block"><p class="empty">Không tìm thấy đơn này trên trình duyệt. <a href="#/catalog">Xem sản phẩm</a></p></section>'; return; }
    app.innerHTML = '<section class="block narrow success"><div class="ok"><b>Đặt hàng thành công</b><span>Mã đơn ' + esc(order.code) + "</span></div>" +
      // Mã QR, số tiền và nội dung chuyển khoản nằm liền nhau, vừa một màn hình điện thoại.
      '<div class="qr">' + fakeQr(order.code, 220) + "</div>" +
      '<div class="due"><b class="sum">' + money(order.total) + '</b><span>Nội dung chuyển khoản: <b>' + esc(order.code) + "</b></span></div>" +
      '<p class="qr-note">Mã QR <b>MẪU</b>, không quét được. Trên website thật, mã này mở sẵn chuyển khoản đúng số tiền và nội dung ở trên.</p>' +
      (order.points ? '<p class="earned">+' + order.points + ' điểm khách quen · <a href="#/khach-quen">Xem điểm của bạn</a></p>' : "") +
      '<dl class="pay">' +
      (order.subtotal !== undefined ? "<div><dt>Tạm tính</dt><dd>" + money(order.subtotal) + "</dd></div><div><dt>Phí ship</dt><dd>" + money(order.shipping) + "</dd></div>" +
        (order.discount ? "<div><dt>Mã " + esc(order.coupon) + "</dt><dd>−" + money(order.discount) + "</dd></div>" : "") : "") +
      "<div><dt>Người nhận</dt><dd>" + esc(order.customer.name) + " · " + esc(order.customer.phone) + "</dd></div><div><dt>Giao tới</dt><dd>" + esc(order.customer.address) + "</dd></div>" +
      "<div><dt>Nhận tin ưu đãi</dt><dd>" + (order.customer.consent ? "Đã đồng ý" : "Không") + "</dd></div></dl>" +
      '<p class="privacy">Đơn này chỉ nằm trên trình duyệt của bạn. Không có hàng nào được giao và không ai nhận được thông tin này.</p>' +
      '<a class="btn wide" href="#/catalog">Tiếp tục xem sản phẩm</a></section>';
  }

  // ── Khách quen tích điểm (mô phỏng: điểm lưu trên trình duyệt) ────────────
  var POINT_EVERY = 10000;
  var TIERS = [{ name: "Khách mới", from: 0 }, { name: "Thân thiết", from: 50 }, { name: "VIP", from: 150 }];
  function loyalty() {
    var points = load("points", 0), orders = load("orders", []);
    var tier = TIERS.filter(function (t) { return points >= t.from; }).pop(), next = TIERS[TIERS.indexOf(tier) + 1];
    var pct = next ? Math.round(((points - tier.from) / (next.from - tier.from)) * 100) : 100;
    app.innerHTML = '<section class="block narrow"><h1 class="page-title">Khách quen</h1>' +
      '<div class="loyal"><small>Hạng của bạn</small><b>' + esc(tier.name) + '</b><span class="pts">' + points + ' điểm</span>' +
      '<div class="loyal-bar" role="img" aria-label="' + pct + ' phần trăm tới hạng kế tiếp"><i style="width:' + pct + '%"></i></div>' +
      "<span>" + (next ? "Còn " + (next.from - points) + " điểm nữa lên hạng " + esc(next.name) : "Bạn đang ở hạng cao nhất") + "</span></div>" +
      '<h2 class="sub-h">Quyền lợi</h2><ul class="plain"><li>Mỗi ' + money(POINT_EVERY) + " trong đơn được 1 điểm</li><li>Khách quen dùng mã <b>KHACHQUEN</b> giảm 5%</li><li>Từ " + TIERS[2].from + " điểm lên hạng VIP</li><li>Bấm <b>Mua lại</b> ở đơn cũ để đặt lại trong vài chạm</li></ul>" +
      '<h2 class="sub-h">Đơn đã đặt</h2>' + (orders.length
        ? orders.slice().reverse().map(function (o) { return '<div class="past"><span><b>' + esc(o.code) + "</b> · " + new Date(o.at).toLocaleDateString("vi-VN") + "<br>" + money(o.total) + (o.points ? " · +" + o.points + " điểm" : "") + '</span><button type="button" class="btn ghost" data-reorder="' + esc(o.code) + '">Mua lại</button></div>'; }).join("")
        : '<p class="empty">Chưa có đơn nào trên trình duyệt này. <a href="#/catalog">Xem sản phẩm</a></p>') +
      '<p class="privacy">Điểm và hạng là mô phỏng của website demo, chỉ lưu trên trình duyệt này.</p></section>';
  }

  // ── Chat giả lập ──────────────────────────────────────────────────────────
  function chat() {
    var box = document.getElementById("chat"), log = document.getElementById("chat-log"), opened = false;
    function say(who, text) {
      var b = document.createElement("div");
      b.className = "bubble " + who; b.textContent = text;
      log.appendChild(b); log.scrollTop = log.scrollHeight;
    }
    function fold(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d"); }
    document.getElementById("chat-open").addEventListener("click", function () {
      box.hidden = false;
      if (!opened) { opened = true; say("shop", S.chat.greeting); say("shop", "Đây là chat giả lập của website demo, câu trả lời được soạn sẵn."); }
      document.getElementById("chat-input").focus();
    });
    document.getElementById("chat-close").addEventListener("click", function () { box.hidden = true; document.getElementById("chat-open").focus(); });
    document.getElementById("chat-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("chat-input"), text = input.value.trim();
      if (!text) return;
      input.value = ""; say("me", text);
      var q = fold(text);
      var hit = S.chat.replies.filter(function (r) { return r.keys.some(function (k) { return q.indexOf(k) >= 0; }); })[0];
      setTimeout(function () { say("shop", hit ? hit.text : S.chat.fallback); }, 600);
    });
  }

  // ── Điều hướng ────────────────────────────────────────────────────────────
  function route() {
    var raw = location.hash.replace(/^#\/?/, ""), parts = raw.split("?"), path = parts[0].split("/"), query = null;
    if (parts[1]) { query = {}; parts[1].split("&").forEach(function (kv) { var p = kv.split("="); query[p[0]] = decodeURIComponent(p[1] || ""); }); }
    if (path[0] === "catalog") catalog(query);
    else if (path[0] === "p") product(path[1]);
    else if (path[0] === "cart") cartPage();
    else if (path[0] === "checkout") checkout();
    else if (path[0] === "success") success(path[1]);
    else if (path[0] === "khach-quen") loyalty();
    else home();
    // Trang đặt hàng ẩn nút chat nổi (nó che nút "Xác nhận đặt hàng"); thay bằng dòng "Chat với shop" ngay dưới form.
    document.body.dataset.route = path[0] || "home";
    paintCount();
    document.title = S.name + " · Website demo";
    window.scrollTo(0, 0);
  }

  app.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.filter) { filter[t.dataset.filter] = t.dataset.value; catalog(); }
    else if ("reset" in t.dataset) { filter = { cat: "", size: "", price: "" }; catalog(); }
    else if (t.dataset.size) { pick.size = t.dataset.size; product(pick.id); }
    else if (t.dataset.color) { pick.color = Number(t.dataset.color); product(pick.id); }
    else if ("chat" in t.dataset) document.getElementById("chat-open").click();
    else if (t.dataset.reorder) {
      // Mua lại: bỏ đúng các món của đơn cũ vào giỏ rồi sang thẳng trang đặt hàng.
      var old = load("orders", []).filter(function (o) { return o.code === t.dataset.reorder; })[0];
      if (old) { setCart(old.items.map(function (l) { return { id: l.id, size: l.size, color: l.color, colorIndex: l.colorIndex, qty: l.qty }; })); location.hash = "#/checkout"; }
    }
    else if ("coupon" in t.dataset) applyCoupon(document.getElementById("coupon").value, true);
    else if ("suggest" in t.dataset) applyCoupon(SUGGESTED, true);
    else if ("uncoupon" in t.dataset) { draft.coupon = ""; draft.auto = false; document.getElementById("coupon").value = ""; paintQuote(true); }
    else if ("add" in t.dataset) addToCart(false);
    else if ("buy" in t.dataset) addToCart(true);
    else if (t.dataset.qty) { cart[Number(t.dataset.qty)].qty += Number(t.dataset.step); setCart(cart); cartPage(); }
  });
  // Người dùng sửa ô nào thì bỏ báo lỗi của ô đó.
  app.addEventListener("input", function (e) {
    var err = e.target.name && document.getElementById("err-" + e.target.name);
    if (err && err.textContent) { err.textContent = ""; e.target.setAttribute("aria-invalid", "false"); }
  });
  app.addEventListener("change", function (e) { if (e.target.name === "province" || e.target.name === "district") areaChanged(e.target); });
  app.addEventListener("submit", function (e) { if (e.target.id === "order") { e.preventDefault(); submitOrder(e.target); } });
  window.addEventListener("hashchange", route);

  shell();
  setCart(cart);
  route();
})();
