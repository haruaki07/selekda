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

class Tool {
  constructor(name) {
    this.name = name;
  }
}

class BrushTool extends Tool {
  constructor(
    ctx,
    dctx,
    size = 5,
    color = "black",
    shape = "round",
    opacity = 100
  ) {
    super("brush");
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    /** @type {CanvasRenderingContext2D} */
    this.dctx = dctx;
    this.size = size;
    this.color = color;
    this.shape = shape;
    this.opacity = opacity;
  }

  beginDraw(x, y) {
    this.dctx.lineWidth = this.size;
    this.dctx.lineJoin = "round";
    this.dctx.lineCap = this.shape === "round" ? "round" : "square";
    this.dctx.strokeStyle = this.color;
    this.dctx.canvas.style.setProperty("opacity", this.opacity / 100);
    this.dctx.beginPath();
    this.dctx.moveTo(x, y);
  }

  draw(x, y) {
    this.dctx.lineTo(x, y);
    this.dctx.stroke();
  }

  endDraw() {
    let draftCanvas = this.dctx.canvas;
    this.ctx.globalAlpha = this.opacity / 100;
    this.ctx.drawImage(draftCanvas, 0, 0);
    this.dctx.clearRect(0, 0, draftCanvas.width, draftCanvas.height);
    this.ctx.globalAlpha = 1;
  }
}

class EraserTool extends BrushTool {
  constructor(ctx, dctx) {
    super(ctx, dctx, 5, "white", "round", 100);
  }
}

class Editor {
  constructor(width, height) {
    this.container = document.querySelector(".workspace__editor");
    this.width = width;
    this.height = height;
    this.zoom = 1;
    this.initCanvas();
    this.updateStatusBar();
    this.initButtons();
    this.initTools();
  }

  initTools() {
    this.initBrushTool();
    this.initEraserTool();
  }

  initBrushTool() {
    this.brushTool = new BrushTool(this.ctx, this.dctx);
    // size props dom
    document.getElementById("brushSize").value = this.brushTool.size;
    document.getElementById("brushSizeText").innerText = this.brushTool.size;
    document.getElementById("brushSize").addEventListener("input", (e) => {
      let value = e.currentTarget.value;
      this.brushTool.size = value;
      document.getElementById("brushSizeText").innerText = value;
    });

    // color props dom
    document.getElementById("brushColor").value = this.brushTool.color;
    document.getElementById("brushColor").addEventListener("change", (e) => {
      this.brushTool.color = e.currentTarget.value;
    });

    // size props dom
    document.getElementById("brushOpacity").value = this.brushTool.opacity;
    document.getElementById("brushOpacityText").innerText =
      this.brushTool.opacity;
    document.getElementById("brushOpacity").addEventListener("input", (e) => {
      let value = e.currentTarget.value;
      this.brushTool.opacity = value;
      document.getElementById("brushOpacityText").innerText = value;
    });

    // shape props dom
    document.querySelector(
      `input[type=radio][name="brush-shape"][value="${this.brushTool.shape}"]`
    ).checked = true;
    document
      .querySelectorAll(`input[type=radio][name="brush-shape"]`)
      .forEach((el) => {
        el.addEventListener("change", (e) => {
          this.brushTool.shape = e.currentTarget.value;
        });
      });
  }

  initEraserTool() {
    this.eraserTool = new EraserTool(this.ctx, this.dctx);
    // size props dom
    document.getElementById("eraserSize").value = this.eraserTool.size;
    document.getElementById("eraserSizeText").innerText = this.eraserTool.size;
    document.getElementById("eraserSize").addEventListener("input", (e) => {
      let value = e.currentTarget.value;
      this.eraserTool.size = value;
      document.getElementById("eraserSizeText").innerText = value;
    });
  }

  initCanvas() {
    let canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    let draftCanvas = document.createElement("canvas");
    draftCanvas.style =
      "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)";
    draftCanvas.width = this.width;
    draftCanvas.height = this.height;
    this.draftCanvas = draftCanvas;
    this.dctx = this.draftCanvas.getContext("2d");

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

    this.container.append(this.canvas, this.draftCanvas);

    this.draftCanvas.addEventListener("mousedown", this.handleMouseDown);
    this.draftCanvas.addEventListener("mousemove", this.handleMouseMove);
    this.draftCanvas.addEventListener("mouseup", this.handleMouseUp);
  }

  /** @param {MouseEvent} e */
  handleMouseDown = (e) => {
    let { x, y } = this.getMousePos(e);

    if (this.activeTool === "brush") {
      this.brushTool.beginDraw(x, y);
      this.pressing = true;
    } else if (this.activeTool === "eraser") {
      this.eraserTool.beginDraw(x, y);
      this.pressing = true;
    }
  };

  /** @param {MouseEvent} e */
  handleMouseMove = (e) => {
    let { x, y } = this.getMousePos(e);

    if (this.pressing) {
      switch (this.activeTool) {
        case "brush":
          this.brushTool.draw(x, y);
          break;
        case "eraser":
          this.brushTool.draw(x, y);
          break;
      }
    }
  };

  /** @param {MouseEvent} e */
  handleMouseUp = (e) => {
    if (this.pressing) {
      switch (this.activeTool) {
        case "brush":
          this.brushTool.endDraw();
          break;
        case "eraser":
          this.brushTool.endDraw();
          break;
      }

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

    this.draftCanvas.style.transform = `scale(${this.zoom}) translate(-50%, -50%)`;
    this.draftCanvas.style.transformOrigin = `top left`;
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
    document
      .getElementById(this.activeTool + "Props")
      ?.style.setProperty("display", "none");

    // remove active state on dom
    document
      .querySelector(".workspace__toolbar-item--active")
      ?.classList.remove("workspace__toolbar-item--active");

    this.activeTool = tool;

    // set active state on dom
    document
      .getElementById(tool)
      .classList.add("workspace__toolbar-item--active");

    // show tool props
    document
      .getElementById(tool + "Props")
      ?.style.setProperty("display", "flex");
  }
}

let editor = new Editor(1024, 600);
editor.setActiveTool("brush");
