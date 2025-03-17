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
