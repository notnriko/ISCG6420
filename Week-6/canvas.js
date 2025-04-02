window.onload = (event) => {
    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(800, 600);
    ctx.closePath();
    ctx.stroke();
}