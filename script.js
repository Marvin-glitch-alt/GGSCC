
document.addEventListener("DOMContentLoaded", function () {
    function revealOnScroll() {
        let elements = document.querySelectorAll('.about-card, .service-card, .box, .img-fluid, .contact-section svg:not(.footer-content svg)');
        let windowHeight = window.innerHeight;

        elements.forEach(element => {
            let position = element.getBoundingClientRect().top;
            if (position < windowHeight - 50) {
                element.classList.add("reveal");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger on page load
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