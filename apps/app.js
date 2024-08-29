// class Object {
//   constructor(x, y) {}
// }

// class Brush extends Object {
//   constructor(x, y) {
//     super(x, y);
//   }
// }

// class Image extends Object {
//   constructor(x, y) {
//     super(x, y);
//   }
// }

// class Layer {}

class Editor {
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
    this.ctx = this.canvas.getContext("2d");

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

    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
  }

  /** @param {MouseEvent} e */
  handleMouseDown = (e) => {
    let { x, y } = this.getMousePos(e);

    if (this.activeTool === "brush") {
      this.ctx.lineWidth = 5;
      this.ctx.lineJoin = "round";
      this.ctx.lineCap = "round";
      this.ctx.strokeStyle = "blue";
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.pressing = true;
    }
  };

  /** @param {MouseEvent} e */
  handleMouseMove = (e) => {
    let { x, y } = this.getMousePos(e);

    if (this.activeTool === "brush" && this.pressing) {
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  };

  /** @param {MouseEvent} e */
  handleMouseUp = (e) => {
    if (this.activeTool === "brush" && this.pressing) {
      this.pressing = false;
    }
  };

  /** @param {MouseEvent} e */
  getMousePos(e) {
    let rect = this.canvas.getBoundingClientRect();

    // get the scale factor
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;

    return { x, y };
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

    // tools
    document.getElementById("select").onclick = this.handleSelectSelect;
    document.getElementById("brush").onclick = this.handleBrushSelect;
    document.getElementById("bucket").onclick = this.handleBucketSelect;
    document.getElementById("eraser").onclick = this.handleEraserSelect;
    document.getElementById("text").onclick = this.handleTextSelect;
    document.getElementById("stamp").onclick = this.handleStampSelect;
    document.getElementById("picker").onclick = this.handlePickerSelect;
    document.getElementById("shape").onclick = this.handleShapeSelect;
  }

  handleZoomOut = () => {
    this.setZoom(Math.max(0.05, this.zoom - 0.05));
  };

  handleZoomIn = () => {
    this.setZoom(Math.min(1.5, this.zoom + 0.05));
  };

  handleSelectSelect = () => {
    this.setActiveTool("select");
  };

  handleBrushSelect = () => {
    this.setActiveTool("brush");
  };

  handleBucketSelect = () => {
    this.setActiveTool("bucket");
  };

  handleEraserSelect = () => {
    this.setActiveTool("eraser");
  };

  handleTextSelect = () => {
    this.setActiveTool("text");
  };

  handleStampSelect = () => {
    this.setActiveTool("stamp");
  };

  handlePickerSelect = () => {
    this.setActiveTool("picker");
  };

  handleShapeSelect = () => {
    this.setActiveTool("shape");
  };

  setActiveTool(tool) {
    this.activeTool = tool;

    // remove active state on dom
    document
      .querySelector(".workspace__toolbar-item--active")
      ?.classList.remove("workspace__toolbar-item--active");

    // set active state on dom
    document
      .getElementById(tool)
      .classList.add("workspace__toolbar-item--active");
  }
}

let editor = new Editor(1024, 600);
