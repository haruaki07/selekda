class Editor {
  /** @type {HTMLCanvasElement} */
  canvas;
  /** @type {HTMLDivElement} */
  container;

  constructor(width, height) {
    this.container = document.querySelector(".workspace__editor");
    this.width = width;
    this.height = height;
    this.zoom = 1;
    this.initCanvas();
    this.updateStatusBar();
    this.initButtons();
  }

  initCanvas() {
    let canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.canvas = canvas;

    // make sure the canvas is visible, not overflowing the container
    if (
      this.width > this.container.clientWidth ||
      this.height > this.container.clientHeight
    ) {
      let zoom =
        Math.round(
          Math.min(
            (this.container.clientWidth - 40) / canvas.width,
            (this.container.clientHeight - 40) / canvas.height
          ) / 0.05
        ) * 0.05;
      this.setZoom(zoom);
    }

    this.container.append(this.canvas);
  }

  setZoom(zoom) {
    this.zoom = zoom;
    this.canvas.style.transform = `scale(${this.zoom}) translate(-50%, -50%)`;
    this.canvas.style.transformOrigin = `top left`;
    this.updateStatusBar();
  }

  updateStatusBar() {
    document.getElementById(
      "statusSize"
    ).innerText = `${this.width}x${this.height}`;
    document.getElementById("statusZoom").innerText = `${Math.round(
      this.zoom * 100
    )}%`;
  }

  initButtons() {
    document.getElementById("zoomout").onclick = this.handleZoomOut;
    document.getElementById("zoomin").onclick = this.handleZoomIn;
  }

  handleZoomOut = () => {
    this.setZoom(Math.max(0.05, this.zoom - 0.05));
  };

  handleZoomIn = () => {
    this.setZoom(Math.min(1.5, this.zoom + 0.05));
  };
}

let editor = new Editor(1024, 600);
