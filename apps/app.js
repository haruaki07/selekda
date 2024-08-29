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
    this.dctx.lineTo(x, y);
    this.dctx.stroke();
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
    this.dctx.canvas.style.setProperty("opacity", 1);
  }
}

class EraserTool extends BrushTool {
  constructor(ctx, dctx) {
    super(ctx, dctx, 5, "white", "round", 100);
    this.name = "eraser";
  }
}

class PickerTool extends Tool {
  constructor(ctx, dctx) {
    super("picker");
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    /** @type {CanvasRenderingContext2D} */
    this.dctx = dctx;
    this.rgba = { r: 255, g: 255, b: 255, a: 1 };
  }

  drawPreview(x, y) {
    let imageData = this.ctx.getImageData(x, y, 1, 1);
    let data = imageData.data;
    this.rgba = { r: data[0], g: data[1], b: data[2], a: data[3] };

    this.dctx.canvas.style.setProperty("opacity", 1);
    this.dctx.clearRect(0, 0, this.dctx.canvas.width, this.dctx.canvas.height);

    let radius = 100 / 2;

    // pick
    this.dctx.strokeStyle = this.getColor();
    this.dctx.lineWidth = 10;
    this.dctx.beginPath();
    this.dctx.arc(x, y, radius, 0, Math.PI * 2, false);
    this.dctx.stroke();
    this.dctx.closePath();

    // border
    this.dctx.strokeStyle = "gray";
    this.dctx.lineWidth = 10;
    this.dctx.beginPath();
    this.dctx.arc(x, y, radius + 10, 0, Math.PI * 2, false);
    this.dctx.stroke();
    this.dctx.closePath();
  }

  getColor() {
    return rgbToHex(this.rgba.r, this.rgba.g, this.rgba.b);
  }

  clearPreview() {
    this.dctx.clearRect(0, 0, this.dctx.canvas.width, this.dctx.canvas.height);
  }
}

class ShapeTool extends Tool {
  constructor(ctx, dctx, shape = "rectangle", color = "black", opacity = 1) {
    super("shape");
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    /** @type {CanvasRenderingContext2D} */
    this.dctx = dctx;
    this.shape = shape;
    this.color = color;
    this.opacity = opacity;
  }

  beginDraw(x, y) {
    this.start = { x, y };
  }

  drawPreview(x, y) {
    this.dctx.clearRect(0, 0, this.dctx.canvas.width, this.dctx.canvas.height);
    this.dctx.canvas.style.setProperty("opacity", this.opacity);

    if (this.shape === "rectangle") {
      this.dctx.fillStyle = this.color;
      this.dctx.fillRect(
        this.start.x,
        this.start.y,
        x - this.start.x,
        y - this.start.y
      );
    } else if (this.shape === "line") {
      this.dctx.strokeStyle = this.color;
      this.dctx.beginPath();
      this.dctx.moveTo(this.start.x, this.start.y);
      this.dctx.lineTo(x, y);
      this.dctx.stroke();
    } else if (this.shape === "square") {
      let w = Math.min(x - this.start.x, y - this.start.y);
      this.dctx.fillStyle = this.color;
      this.dctx.fillRect(this.start.x, this.start.y, w, w);
    } else if (this.shape === "circle") {
      this.dctx.fillStyle = this.color;
      this.dctx.beginPath();
      this.dctx.arc(
        this.start.x,
        this.start.y,
        Math.abs(x - this.start.x),
        0,
        Math.PI * 2
      );
      this.dctx.fill();
      this.dctx.closePath();
    }
  }

  endDraw() {
    let draftCanvas = this.dctx.canvas;
    this.ctx.globalAlpha = this.opacity;
    this.ctx.drawImage(draftCanvas, 0, 0);
    this.dctx.clearRect(0, 0, draftCanvas.width, draftCanvas.height);
    this.ctx.globalAlpha = 1;
    this.dctx.canvas.style.setProperty("opacity", 1);
    this.start = null;
  }
}

class Stack {
  constructor(cb) {
    this.stack = [];
    this.length = 0;
    this._cb = cb;
    this._cb();
  }

  push(items) {
    this.stack.push(items);
    this._cb(this.stack.length);
    this.length++;
  }

  get(i) {
    if (i < 0) {
      return this.stack[this.stack.length + i];
    }

    return this.stack[i];
  }

  pop() {
    let el = this.stack.pop();
    this._cb(this.stack.length);
    this.length--;
    return el;
  }

  clear() {
    this.stack = [];
    this.length = 0;
    this._cb(this.stack.length);
  }
}

class Editor {
  constructor(width, height) {
    this.container = document.querySelector(".workspace__editor");
    this.width = width;
    this.height = height;
    this.zoom = 1;
    this.initCanvas();
    this.initHistory();
    this.updateStatusBar();
    this.initButtons();
    this.initTools();
  }

  initHistory() {
    this.history = new Stack(
      (c) =>
        (document.getElementById("undoCount").innerText = c > 0 ? `(${c})` : "")
    );
    this.redoHistory = new Stack(
      (c) =>
        (document.getElementById("redoCount").innerText = c > 0 ? `(${c})` : "")
    );
  }

  initTools() {
    this.initBrushTool();
    this.initEraserTool();
    this.initPickerTool();
    this.initShapeTool();
  }

  initShapeTool() {
    this.shapeTool = new ShapeTool(this.ctx, this.dctx);

    // color props dom
    document.getElementById("shapeColor").value = this.shapeTool.color;
    document.getElementById("shapeColor").addEventListener("change", (e) => {
      this.shapeTool.color = e.currentTarget.value;
    });

    // opacity props dom
    document.getElementById("shapeOpacity").value =
      this.shapeTool.opacity * 100;
    document.getElementById("shapeOpacityText").innerText =
      this.shapeTool.opacity * 100;
    document.getElementById("shapeOpacity").addEventListener("input", (e) => {
      let value = e.currentTarget.value;
      this.shapeTool.opacity = value / 100;
      document.getElementById("shapeOpacityText").innerText = value;
    });

    // shape props dom
    document.querySelector(
      `input[type=radio][name="shape-shape"][value="${this.shapeTool.shape}"]`
    ).checked = true;
    document
      .querySelectorAll(`input[type=radio][name="shape-shape"]`)
      .forEach((el) => {
        el.addEventListener("change", (e) => {
          this.shapeTool.shape = e.currentTarget.value;
        });
      });
  }

  initPickerTool() {
    this.pickerTool = new PickerTool(this.ctx, this.dctx);
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

    // opacity props dom
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
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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

    this.pressing = true;

    if (this.activeTool === "brush") {
      this.brushTool.beginDraw(x, y);
    } else if (this.activeTool === "eraser") {
      this.eraserTool.beginDraw(x, y);
    } else if (this.activeTool === "shape") {
      this.shapeTool.beginDraw(x, y);
    }
  };

  /** @param {MouseEvent} e */
  handleMouseMove = (e) => {
    let { x, y } = this.getMousePos(e);

    switch (this.activeTool) {
      case "brush":
        if (this.pressing) {
          this.brushTool.draw(x, y);
        }
        break;
      case "eraser":
        if (this.pressing) {
          this.brushTool.draw(x, y);
        }
        break;
      case "picker":
        if (this.pressing) {
          this.pickerTool.drawPreview(x, y);
        }
        break;
      case "shape":
        if (this.pressing) {
          this.shapeTool.drawPreview(x, y);
        }
        break;
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
          this.eraserTool.endDraw();
          break;
        case "picker":
          let color = this.pickerTool.getColor();
          this.pickerTool.clearPreview();
          navigator.clipboard
            .writeText(color)
            .then(() => alert(`${color} copied to clipboard!`));
          break;
        case "shape":
          this.shapeTool.endDraw();
          break;
      }

      this.pressing = false;

      this.history.push(
        this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      );
      if (this.redoHistory.length > 0) {
        this.redoHistory.clear();
      }
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
    document.getElementById("move").onclick = this.handleMoveSelect;
    document.getElementById("brush").onclick = this.handleBrushSelect;
    document.getElementById("bucket").onclick = this.handleBucketSelect;
    document.getElementById("eraser").onclick = this.handleEraserSelect;
    document.getElementById("text").onclick = this.handleTextSelect;
    document.getElementById("stamp").onclick = this.handleStampSelect;
    document.getElementById("picker").onclick = this.handlePickerSelect;
    document.getElementById("shape").onclick = this.handleShapeSelect;

    document.getElementById("export").onclick = this.exportJpg;
    document.getElementById("undo").onclick = this.handleUndo;
    document.getElementById("redo").onclick = this.handleRedo;
  }

  handleUndo = (e) => {
    let last = this.history.get(-2);

    if (last) {
      this.ctx.putImageData(last, 0, 0);
      this.redoHistory.push(this.history.pop());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.history.length > 0) {
        this.redoHistory.push(this.history.get(-1));
      }
      this.history.clear();
    }
  };

  handleRedo = (e) => {
    let data = this.redoHistory.pop();

    if (data) {
      this.ctx.putImageData(data, 0, 0);
      this.history.push(data);
    } else {
      this.redoHistory.clear();
    }
  };

  exportJpg = (e) => {
    let link = document.createElement("a");
    link.download = "output.jpg";
    link.href = this.canvas.toDataURL();
    link.click();
  };

  handleZoomOut = () => {
    this.setZoom(Math.max(0.05, this.zoom - 0.05));
  };

  handleZoomIn = () => {
    this.setZoom(Math.min(1.5, this.zoom + 0.05));
  };

  handleMoveSelect = () => {
    this.setActiveTool("move");
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

function rgbToHex(r, g, b) {
  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));

  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
}

let editor = new Editor(1024, 600);
editor.setActiveTool("brush");
