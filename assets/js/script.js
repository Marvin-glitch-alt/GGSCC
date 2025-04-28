const toggler = document.querySelector('.navbar-toggler');
const icon = toggler.querySelector('.custom-toggler-icon');

toggler.addEventListener('click', function () {
  icon.classList.toggle('open');
});


const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const collapseEl = document.getElementById('navbarNav');
const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      bsCollapse.hide();
      icon.classList.remove('open'); 
    }
  });
});


let hasWelcomed = false;  

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




function sendMessage() {
    var input = document.getElementById("chatInput");
    var message = input.value.trim();
    if (message !== "") {
        var chatBody = document.getElementById("chatBody");

        var userMsg = document.createElement("p");
        userMsg.textContent = message;
        userMsg.classList.add("user-message");
        chatBody.appendChild(userMsg);

        input.value = "";

      
        const typingIndicator = document.createElement("div");
        typingIndicator.className = "bot-message";
        typingIndicator.innerHTML = `<span class="typing-dots"><span></span><span></span><span></span></span>`;
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;

     
        fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        })
        .then(res => res.json())
        .then(data => {
          
            chatBody.removeChild(typingIndicator);
        
            if (data.response) {
                var botReply = document.createElement("p");
                botReply.textContent = data.response;
                botReply.classList.add("bot-message");
                chatBody.appendChild(botReply);
        
              
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
           
            displayChatbotResponse("Sorry, something went wrong. Please try again later.");
        });

        chatBody.scrollTop = chatBody.scrollHeight;
    }
}



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

            if (elementTop < windowHeight - 100) { 
                element.classList.add("animate");
            }
        });
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
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
