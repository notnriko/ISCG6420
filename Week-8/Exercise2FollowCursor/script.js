const canvas = document.querySelector("#myCanvas");
const context = canvas.getContext("2d");

let canvasPos = getPosition(canvas);
let mouseX = 0;
let mouseY = 0;

// Update mouse position relative to the canvas
canvas.addEventListener("mousemove", setMousePosition, false);

function setMousePosition(e) {
  mouseX = e.clientX - canvasPos.x;
  mouseY = e.clientY - canvasPos.y;
}

// Draw and animate the circle following the mouse
function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.arc(mouseX, mouseY, 50, 0, 2 * Math.PI, true);
  context.fillStyle = "#FF6A6A";
  context.fill();

  requestAnimationFrame(update);
}
update();

// Helper to get canvas position relative to the document
function getPosition(el) {
  let xPosition = 0;
  let yPosition = 0;

  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }

  return { x: xPosition, y: yPosition };
}