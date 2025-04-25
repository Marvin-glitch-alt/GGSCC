const toggler = document.querySelector('.navbar-toggler');
const icon = toggler.querySelector('.custom-toggler-icon');

toggler.addEventListener('click', function () {
  icon.classList.toggle('open');
});

// Optional: Reset to hamburger on nav link click
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const collapseEl = document.getElementById('navbarNav');
const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      bsCollapse.hide();
      icon.classList.remove('open'); // Reset to hamburger
    }
  });
});

// Function to toggle the chat popup visibility
let hasWelcomed = false;  // Track if welcome message has already been shown

function toggleChat() {
    var chatPopup = document.getElementById("chatPopup");
    const isOpening = (chatPopup.style.display === "none" || chatPopup.style.display === "");

    chatPopup.style.display = isOpening ? "block" : "none";
    chatPopup.classList.toggle("open");

    if (isOpening && !hasWelcomed) {
        showWelcomeMessage();
        hasWelcomed = true;
    }
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
        
                // 🔁 Check if consultant was requested
                if (data.response.toLowerCase().includes("consultant")) {
                    launchWhatsAppWorkflow();
                }
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


  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("mainNavbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  function launchWhatsAppWorkflow() {
    const chatBody = document.getElementById("chatBody");

    // Create WhatsApp link/message UI
    const handoffMessage = document.createElement("div");
    handoffMessage.classList.add("bot-message");
    handoffMessage.innerHTML = `
        <p>Or to continue the conversation, please chat with us on WhatsApp:</p>
        <a href="https://wa.me/254703570025" target="_blank" class="whatsapp-link">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="20" style="vertical-align:middle;"> 
            <span style="margin-left:8px;">Open WhatsApp Chat</span>
        </a>
    `;
    
    chatBody.appendChild(handoffMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showWelcomeMessage() {
  const chatBody = document.getElementById("chatBody");

  const welcomeMsg = document.createElement("p");
  welcomeMsg.classList.add("bot-message");
  welcomeMsg.textContent = "👋 Hi there! I'm your assistant from GeoGreat Supply Chain Consultancy. How can I help you today?";

  chatBody.appendChild(welcomeMsg);
  chatBody.scrollTop = chatBody.scrollHeight;
}
