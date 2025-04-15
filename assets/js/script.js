// Function to toggle the chat popup visibility
function toggleChat() {
    var chatPopup = document.getElementById("chatPopup");
    chatPopup.style.display = (chatPopup.style.display === "none" || chatPopup.style.display === "") ? "block" : "none";
    chatPopup.classList.toggle("open");
}


// Function to send and display messages as chat bubbles
function sendMessage() {
    var input = document.getElementById("chatInput");
    var message = input.value.trim();
    if (message !== "") {
        var chatBody = document.getElementById("chatBody");

        // Show user message
        var userMsg = document.createElement("p");
        userMsg.textContent = message;
        userMsg.classList.add("user-message");
        chatBody.appendChild(userMsg);

        input.value = "";

        // Show typing indicator
        const typingIndicator = document.createElement("div");
        typingIndicator.className = "bot-message";
        typingIndicator.innerHTML = `<span class="typing-dots"><span></span><span></span><span></span></span>`;
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Send message to Python backend
        fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        })
        .then(res => res.json())
        .then(data => {
            // Remove typing indicator
            chatBody.removeChild(typingIndicator);

            if (data.response) {
                var botReply = document.createElement("p");
                botReply.textContent = data.response;  
                botReply.classList.add("bot-message");
                chatBody.appendChild(botReply);
            } else {
                console.log("No response from backend.");
            }

            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch((error) => {
            console.error('Error:', error);
            // Display error message in case of an issue
            displayChatbotResponse("Sorry, something went wrong. Please try again later.");
        });

        chatBody.scrollTop = chatBody.scrollHeight;
    }
}


// Listen for "Enter" keypress to send the message
document.getElementById("chatInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const slideRightElements = document.querySelectorAll(".slide-in-right");

    function handleScroll() {
        slideRightElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) { // When element is 100px in view
                element.classList.add("animate");
            }
        });
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger on load in case elements are already in view
});
