/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let dcanvas = document.createElement("canvas");
dcanvas.width = canvas.width;
dcanvas.height = canvas.height;
let dctx = dcanvas.getContext("2d");

document.querySelector(".game").append(dcanvas);

let scene = "loading";
let imgs = {};

// loading
let loadingAlpha = 1;
let loadingFadeOutSpeed = 0.04;

function draw() {
  clear(ctx);

  if (loadingAlpha >= 0) {
    drawLoading();
  }

  if (scene === "main-menu") {
    // fade out the loading scene
    loadingAlpha -= loadingFadeOutSpeed;
    if (loadingAlpha <= 0) {
      loadingAlpha = 0;
    }

    drawMainBg();
    drawFlags(
      Object.keys(imgs)
        .filter((k) => k.startsWith("fl-"))
        .map((k) => imgs[k])
    );
    drawGoalSides();
  }
}

function drawGoalSides() {
  // left
  let limg = imgs.lgoal;
  let ratio = limg.width / limg.height;
  let w = 100;
  let h = w / ratio;
  ctx.drawImage(limg, 40, 322, w, h);

  // right
  let rimg = imgs.rgoal;
  let rratio = rimg.width / rimg.height;
  let rw = 100;
  let rh = rw / rratio;
  ctx.drawImage(rimg, canvas.width - rw - 45, 322, rw, rh);
}

function drawFlags(flags) {
  let flw = 90;
  let fx = 0;

  // draw flags
  flags.forEach((fl) => {
    ctx.drawImage(fl, fx, 380, flw, 60);
    fx += 90;
  });

  // draw empty space
  if (fx < canvas.width) {
    let n = Math.ceil((canvas.width - fx) / flw);

    for (let i = 0; i < n; i++) {
      ctx.drawImage(flags[i % flags.length], fx, 380, flw, 60);
      fx += 90;
    }
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

loadImages(
  ["bg", "assets/background1.jpg"],
  ["bg2", "assets/background2.jpg"],
  ["lgoal", "assets/lgoal.png"],
  ["rgoal", "assets/rgoal.png"],
  ["ball1", "assets/ball1.png"],
  ["ball2", "assets/ball2.png"],

  // items
  ["it-decrease-ball", "assets/decrease-ball.png"],
  ["it-diamond-ice", "assets/diamond-ice.png"],
  ["it-increase-ball", "assets/increase-ball.png"],

  // flags
  ["fl-bra", "assets/flags/brazil.png"],
  ["fl-eng", "assets/flags/england.png"],
  ["fl-ger", "assets/flags/germany.png"],
  ["fl-ita", "assets/flags/italy.png"],
  ["fl-jpn", "assets/flags/japan.png"],
  ["fl-ned", "assets/flags/netherlands.png"],
  ["fl-por", "assets/flags/portugal.png"],
  ["fl-esp", "assets/flags/spain.png"]
).then(() => (scene = "main-menu"));

update();
