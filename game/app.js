/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let dcanvas = document.createElement("canvas");
dcanvas.width = canvas.width;
dcanvas.height = canvas.height;
let dctx = dcanvas.getContext("2d");

document.querySelector(".game").append(dcanvas);

let scenee = "loading";
let imgs = {};

// loading
let loadingAlpha = 1;
let loadingFadeOutSpeed = 0.04;

function draw() {
  clear(ctx);

  if (loadingAlpha >= 0) {
    drawLoading();
  }

  if (scenee === "main-menu") {
    // fade out the loading scene
    loadingAlpha -= loadingFadeOutSpeed;
    if (loadingAlpha <= 0) {
      loadingAlpha = 0;
    }

    drawMainBg();
  }
}

function drawMainBg() {
  ctx.drawImage(imgs.bg, 0, 0, canvas.width, canvas.height);
}

function drawLoading() {
  // draw background
  dctx.fillStyle = `rgba(0,0,0,${loadingAlpha})`;
  dctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw loading text
  dctx.textBaseline = "middle";
  dctx.textAlign = "center";
  dctx.font = "50px Arial";
  dctx.fillStyle = "#FFFFFF";
  dctx.fillText("Loading...", canvas.width / 2, canvas.height / 2);

  dcanvas.style.opacity = loadingAlpha;
}

function clear(_ctx) {
  _ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  draw();
  requestAnimationFrame(update);
}

async function loadImages(...images) {
  for (const [key, src] of images) {
    await new Promise((resolve, reject) => {
      var img = new Image();
      img.src = src;
      img.onload = () => {
        imgs[key] = img;
        resolve();
      };
      img.onerror = reject;
    });
  }
}

loadImages(["bg", "assets/background1.jpg"]).then(() => (scenee = "main-menu"));

update();
