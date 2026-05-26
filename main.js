// main.js - Patched version for JoshwynParekh.me

// Grab the canvas (ensure the HTML has <canvas id="gl"></canvas>)
const canvas = document.getElementById("gl");
const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: false });

if (!gl) {
  alert("WebGL not supported");
  throw new Error("WebGL not supported");
}

// Helpers to compile/link shaders
function compileShader(type, source) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    throw new Error("Shader compile failed");
  }
  return sh;
}

function createProgram(vsSource, fsSource) {
  const vs = compileShader(gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    throw new Error("Program link failed");
  }
  return prog;
}

// Load shader text
async function loadText(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const text = await res.text();
    console.log(`Loaded ${url} (first 50 chars):`, text.substring(0, 50));
    return text;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// State
let program;
let timeLoc, resLoc, mouseLoc, foldLoc, lastMoveLoc;
let lastMove = 0;
let start = performance.now();
let lastMouseMove = Date.now();
let foldIntensity = 1.0;

// Mouse state
const mouse = { x: 0, y: 0, nx: 0.5, ny: 0.5 };

// Resize handling
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  gl.viewport(0, 0, canvas.width, canvas.height);

  mouse.x = mouse.nx * canvas.width;
  mouse.y = mouse.ny * canvas.height;
}
window.addEventListener("resize", setCanvasSize);

// Mouse mapping
function handlePointer(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const yTop = clientY - rect.top;
  const y = rect.height - yTop;
  mouse.x = Math.max(0, Math.min(rect.width, x));
  mouse.y = Math.max(0, Math.min(rect.height, y));
  mouse.nx = mouse.x / rect.width;
  mouse.ny = mouse.y / rect.height;
  lastMouseMove = Date.now();
  foldIntensity = 1.0;
  lastMove = performance.now() / 1000;
}
window.addEventListener("mousemove", (e) => handlePointer(e.clientX, e.clientY), { passive: true });
window.addEventListener("touchmove", (e) => {
  if (e.touches && e.touches.length) {
    const t = e.touches[0];
    handlePointer(t.clientX, t.clientY);
  }
}, { passive: true });

// Main init
async function init() {
  // Load shaders via relative paths (HTTPS-safe)
  const vsSource = await loadText("./shader.vert");
  const fsSource = await loadText("./shader.frag");

  program = createProgram(vsSource, fsSource);
  gl.useProgram(program);

  // Fullscreen quad
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]),
    gl.STATIC_DRAW
  );
  const aPos = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  timeLoc = gl.getUniformLocation(program, "u_time");
  resLoc  = gl.getUniformLocation(program, "u_resolution");
  mouseLoc = gl.getUniformLocation(program, "u_mouse");
  foldLoc  = gl.getUniformLocation(program, "uFoldIntensity");
  lastMoveLoc = gl.getUniformLocation(program, "u_lastMove");

  setCanvasSize();

  // Initialize mouse to center
  mouse.x = canvas.width * 0.5;
  mouse.y = canvas.height * 0.5;
  mouse.nx = 0.5;
  mouse.ny = 0.5;

  // All heavy setup is done. Fade in the canvas.
  canvas.style.opacity = '1';

  requestAnimationFrame(render);
}

// Wait for all initial resources (HTML, CSS, images) to load before
// starting the heavy WebGL initialization and render loop.
window.addEventListener('load', init);

// Render loop
function render() {
  const t = (performance.now() - start) * 0.001;

  // Clear the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Fade folds when idle
  const idle = Date.now() - lastMouseMove;
  foldIntensity = Math.max(0.0, 1.0 - idle / 2000.0);

  gl.useProgram(program);
  gl.uniform1f(timeLoc, t);
  gl.uniform2f(resLoc, canvas.width, canvas.height);
  gl.uniform2f(mouseLoc, mouse.x, mouse.y);
  gl.uniform1f(foldLoc, foldIntensity);
  gl.uniform1f(lastMoveLoc, lastMove);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
