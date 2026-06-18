// main.js - Patched version for JoshwynParekh.me

const canvas = document.getElementById("gl");
const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: false });

if (!gl) {
  alert("WebGL not supported");
  throw new Error("WebGL not supported");
}

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

let program;
let timeLoc, resLoc, mouseLoc, foldLoc, lastMoveLoc;
let lastMove = 0;
let start = performance.now();
let lastMouseMove = Date.now();
let foldIntensity = 1.0;
let rafId = null;
let isIdle = false;

const mouse = { x: 0, y: 0, nx: 0.5, ny: 0.5 };

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

function wakeUp() {
  lastMouseMove = Date.now();
  foldIntensity = 1.0;
  lastMove = performance.now() / 1000;
  if (isIdle) {
    isIdle = false;
    rafId = requestAnimationFrame(render);
  }
}

function handlePointer(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const yTop = clientY - rect.top;
  const y = rect.height - yTop;
  mouse.x = Math.max(0, Math.min(rect.width, x));
  mouse.y = Math.max(0, Math.min(rect.height, y));
  mouse.nx = mouse.x / rect.width;
  mouse.ny = mouse.y / rect.height;
  wakeUp();
}
window.addEventListener("mousemove", (e) => handlePointer(e.clientX, e.clientY), { passive: true });
window.addEventListener("touchmove", (e) => {
  if (e.touches && e.touches.length) {
    const t = e.touches[0];
    handlePointer(t.clientX, t.clientY);
  }
}, { passive: true });
window.addEventListener("touchstart", wakeUp, { passive: true });

// Pause when tab is hidden, resume when visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      isIdle = true;
    }
  } else {
    wakeUp();
  }
});

async function init() {
  const vsSource = await loadText("./shader.vert");
  const fsSource = await loadText("./shader.frag");

  program = createProgram(vsSource, fsSource);
  gl.useProgram(program);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );
  const aPos = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  timeLoc = gl.getUniformLocation(program, "u_time");
  resLoc  = gl.getUniformLocation(program, "u_resolution");
  mouseLoc = gl.getUniformLocation(program, "u_mouse");
  foldLoc  = gl.getUniformLocation(program, "uFoldIntensity");
  lastMoveLoc = gl.getUniformLocation(program, "u_lastMove");

  setCanvasSize();
  mouse.x = canvas.width * 0.5;
  mouse.y = canvas.height * 0.5;
  mouse.nx = 0.5;
  mouse.ny = 0.5;

  canvas.style.opacity = '1';
  rafId = requestAnimationFrame(render);
}

window.addEventListener('load', init);

function render() {
  const t = (performance.now() - start) * 0.001;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const idle = Date.now() - lastMouseMove;
  foldIntensity = Math.max(0.0, 1.0 - idle / 2000.0);

  gl.useProgram(program);
  gl.uniform1f(timeLoc, t);
  gl.uniform2f(resLoc, canvas.width, canvas.height);
  gl.uniform2f(mouseLoc, mouse.x, mouse.y);
  gl.uniform1f(foldLoc, foldIntensity);
  gl.uniform1f(lastMoveLoc, lastMove);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Stop the loop once fully idle — resumes automatically on next interaction
  if (foldIntensity <= 0.0) {
    isIdle = true;
    rafId = null;
    return;
  }

  rafId = requestAnimationFrame(render);
}
