const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg");

// Gửi bằng Enter
msgInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Hàm hiển thị tin nhắn
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Hàm gửi tin nhắn từ ô nhập
async function sendMessage() {
  const message = msgInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  msgInput.value = "";

  // Bot đang trả lời
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot";
  typingDiv.innerText = "Đang trả lời...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    typingDiv.remove();
    addMessage(data.reply, "bot");
  } catch (error) {
    typingDiv.remove();
    addMessage("Lỗi kết nối đến server 😢", "bot");
  }
}

// Hàm cho nút hỏi nhanh
function quickAsk(question) {
  msgInput.value = question;
  sendMessage();
}