document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.getElementById("chatIcon");
  const chatBox = document.getElementById("chatBox");
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  
  const responses = {
      "who are you?": "I'm Alesh, a professional frontend developer specializing in creating stunning and functional websites!",
      "what do you do?": "I offer web development, branding, SEO, and e-commerce solutions to help businesses grow online.",
      "what service do you offer?": "I offer web development, branding, SEO, and e-commerce solutions to help businesses grow online.",
      "How can i contact you?": "You can email me at toheebopeyemi870@gmail.com or call me at +234 8138195156.",
      "thank you": "You're welcome! Feel free to ask anything. 😊"
  };

  chatIcon.addEventListener("click", function () {
      chatBox.classList.toggle("active");
  });
  
  chatSend.addEventListener("click", async function () {
      const userMessage = chatInput.value.trim();
      if (userMessage === "") return;
      
      appendMessage("You", userMessage);
      chatInput.value = "";

      
      if (responses[userMessage.toLowerCase()]) {
          setTimeout(() => {
              appendMessage("Bot", responses[userMessage.toLowerCase()]);
          }, 1000);
      } else {
          try {
              const response = await fetch("http://localhost:5000/chat", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ message: userMessage })
              });
              
              const data = await response.json();
              appendMessage("Bot", data.reply || "I'm not sure about that. Can you ask something else? 🤔");
          } catch (error) {
              console.error("Chatbot Error:", error);
              appendMessage("Bot", "There was an error. Please try again later.");
          }
      }
  });
  
  function appendMessage(sender, message) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", sender.toLowerCase());
      messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
