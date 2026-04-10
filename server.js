const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
// Sử dụng cổng 3000 hoặc cổng do môi trường cung cấp
const PORT = process.env.PORT || 3000;

// Cấu hình để server đọc được dữ liệu JSON từ Client gửi lên
app.use(express.json());

// Chỉ định thư mục 'public' là nơi chứa các file giao diện (index.html, css, js)
app.use(express.static(path.join(__dirname, "public")));

// --- ĐỌC DỮ LIỆU TỪ FILE FAQ.JSON ---
const faqPath = path.join(__dirname, "data", "faq.json");
let faqData = [];

try {
    // Đọc file theo định dạng utf-8 để không bị lỗi font tiếng Việt
    const data = fs.readFileSync(faqPath, "utf-8");
    faqData = JSON.parse(data);
    console.log("✅ Đã tải dữ liệu FAQ thành công.");
} catch (err) {
    console.error("❌ Lỗi: Không thể đọc file faq.json. Hãy đảm bảo file nằm trong thư mục 'data'.", err);
}

// --- HÀM TÌM KIẾM CÂU TRẢ LỜI ---
function getReply(message) {
    const msg = message.toLowerCase().trim();

    for (let item of faqData) {
        for (let keyword of item.keywords) {
            // Kiểm tra xem tin nhắn người dùng có chứa từ khóa không
            if (msg.includes(keyword.toLowerCase())) {
                return {
                    text: item.answer,
                    link: item.link || null // Trả về link nếu có, không có thì để null
                };
            }
        }
    }

    // Câu trả lời mặc định nếu không tìm thấy từ khóa phù hợp
    return {
        text: "Xin lỗi, tôi chưa hiểu rõ câu hỏi này 😅. Bạn vui lòng chọn các gợi ý bên dưới hoặc hỏi về: Đăng ký môn, Học phí, Lịch học...",
        link: null
    };
}

// --- API CHATBOT ---
app.post("/chat", (req, res) => {
    const userMessage = req.body.message || "";
    const result = getReply(userMessage);
    
    // Gửi kết quả về cho Client (index.html)
    res.json(result); 
});

// --- ROUTE TRANG CHỦ ---
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- KHỞI CHẠY SERVER ---
app.listen(PORT, () => {
    console.log(`----------------------------------------------`);
    console.log(`🚀 Chatbot đang chạy tại: http://localhost:${PORT}`);
    console.log(`📂 Hãy đảm bảo index.html nằm trong thư mục 'public'`);
    console.log(`📂 Hãy đảm bảo faq.json nằm trong thư mục 'data'`);
    console.log(`----------------------------------------------`);
});