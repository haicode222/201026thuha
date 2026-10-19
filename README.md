# 🌸 Trang Web Chúc Mừng 20/10 Dành Riêng Cho Thu Hà 👑

Một trang web tương tác vui nhộn, ngọt ngào và mượt mà, tối ưu 100% cho màn hình điện thoại, sẵn sàng để host qua **GitHub Pages** và gửi link cho bạn Hà mở trên điện thoại.

---

## ✨ Điểm nổi bật của trang web
1. **Màn hình mở đầu (Intro)**:
   - Lời chào dành riêng cho Thu Hà với hiệu ứng lấp lánh và vương miện.
   - Nút **"Bắt đầu khám phá ✨"** kích hoạt nhạc nền hộp nhạc êm dịu và chuyển sang phần câu hỏi.
   - Nút **"Thoát ❌"** thử đóng tab, nếu trình duyệt điện thoại chặn sẽ hiện thông báo trêu chọc hài hước: *"Ủa ai cho thoát? Hôm nay là 20/10, bạn Thu Hà là nhân vật chính..."*.

2. **Mini-game 3 câu hỏi trắc nghiệm**:
   - Gồm 3 câu: *"Ai là người xinh hơn?"*, *"Ai là người cute hơn?"*, *"Ai là người ngầu nhất hôm nay?"*.
   - 2 lựa chọn: **Thu Hà** 👑 vs **Người code** 💻.
   - **Cơ chế lầy lội**: Khi bấm vào nút *"Người code"*:
     - Phát âm thanh nảy vui tai.
     - Hiện câu cà khịa hài hước (*"Ủa bấm nhầm nút hả ba?", "Lêu lêu bắt hụt rồi"...*).
     - Nút *"Người code"* sẽ nhảy lung tung trên màn hình và **nhỏ dần đi sau mỗi lần bấm** cho đến khi biến mất hoàn toàn sau 6 lần bấm!
     - Nút *"Thu Hà"* đồng thời phóng to dần và phát sáng để ép buộc phải chọn Thu Hà.
   - Khi chọn *"Thu Hà"*: Pháo hoa rực rỡ, âm thanh ăn mừng keng keng và chuyển câu tiếp theo.

3. **Màn hình lời chúc 20/10**:
   - Cơn mưa pháo hoa (Confetti) giấy màu rực rỡ.
   - Bức thư thiệp chúc mừng thiết kế trang nhã với con dấu sáp đỏ.
   - Nút **"Thả tim tặng Hà (n)"** tương tác kèm trái tim bay lên và âm thanh pop dễ thương.
   - Nút **"Chơi lại từ đầu 🔄"**.

4. **Hiệu ứng & Âm thanh**:
   - Sử dụng **Web Audio API** tích hợp sẵn trong trình duyệt (tự tổng hợp âm thanh phím đàn hộp nhạc và hiệu ứng vui nhộn, **không sợ lỗi 404 hay mạng chập chờn**).
   - Nền canvas cánh hoa anh đào và trái tim bay lượn 60fps mượt mà.
   - Nút bật/tắt nhạc ở góc trên màn hình.

---

## 🚀 Hướng dẫn đưa lên GitHub Pages (chỉ mất 2 phút)

### Cách 1: Kéo thả trực tiếp trên web GitHub (Dễ nhất, không cần cài Git)
1. Đăng nhập vào [GitHub.com](https://github.com/).
2. Bấm dấu **+** ở góc trên cùng bên phải -> chọn **New repository**.
3. Đặt tên Repo (ví dụ: `chuc-mung-20-10-thu-ha`), chọn chế độ **Public** -> Bấm **Create repository**.
4. Ở trang mới hiện ra, bấm vào dòng chữ **"uploading an existing file"**.
5. Kéo thả cả 3 file: `index.html`, `style.css`, `script.js` vào trình duyệt -> Bấm **Commit changes**.
6. Vào tab **Settings** (Cài đặt) của repository đó:
   - Ở cột bên trái, bấm vào mục **Pages**.
   - Tại phần **Branch**, chọn `main` (hoặc `master`), thư mục giữ nguyên `/ (root)`.
   - Bấm nút **Save**.
7. Chờ khoảng 30 giây - 1 phút, bạn tải lại trang sẽ thấy một đường link màu xanh hiện ra, dạng:
   👉 `https://<tên-tài-khoản-github>.github.io/<tên-repo>/`
8. Copy link đó và gửi qua Zalo/Messenger/SMS cho bạn Hà mở trên điện thoại!

---

### Cách 2: Dùng lệnh Git trong terminal / PowerShell
Mở PowerShell tại thư mục này và chạy các lệnh:
```bash
git init
git add .
git commit -m "Happy 20/10 Thu Ha"
git branch -M main
git remote add origin https://github.com/<tên-tài-khoản>/<tên-repo>.git
git push -u origin main
```
Sau đó vào **Settings -> Pages** trên GitHub và bật Pages từ nhánh `main` như hướng dẫn ở trên.

---

## 🛠️ Tuỳ chỉnh nội dung (nếu muốn)
- **Lời chúc**: Bạn có thể mở file `index.html` tìm đoạn `<div class="letter-content">` để chỉnh sửa lại lời chúc hay tên người gửi `From: ...` theo ý muốn.
- **Thêm bài hát MP3 riêng**: Nếu bạn muốn dùng một bài hát có sẵn thay vì nhạc hộp nhạc tự động, bạn có thể thêm thẻ `<audio id="bgSong" src="link-bai-hat.mp3" loop></audio>` vào `index.html` và gọi `bgSong.play()` khi bấm nút Bắt đầu.
