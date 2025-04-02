const button = document.getElementById("toggleButton");
const gridContainer = document.querySelector(".grid-container");

let isAnimating = false;

button.addEventListener("click", function() {
    isAnimating = !isAnimating;
    if (isAnimating) {
        gridContainer.classList.add("animate");
    } else {
        gridContainer.classList.remove("animate");
    }
});