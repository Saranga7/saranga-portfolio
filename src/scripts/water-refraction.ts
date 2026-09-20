export interface WaterWave { x: number; y: number; progress: number; reach: number; }

// Distort only the landscape, beneath its colour veil and the reading content.
// Canvas highlights remain the fallback when WebGL is unavailable.
export function createWaterRefraction() {
  const host = document.querySelector<HTMLElement>("[data-artwork-mount]");
  if (!host) return null;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, preserveDrawingBuffer: false });
  if (!gl) return null;
  const vertexSource = `
    attribute vec2 position;
    varying vec2 uv;
    void main() { uv = vec2(position.x * .5 + .5, .5 - position.y * .5); gl_Position = vec4(position, 0., 1.); }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D scene;
    uniform vec2 viewport;
    uniform vec2 imageSize;
    uniform vec2 focal;
    uniform vec4 waves[4];
    void main() {
      vec2 pixel = uv * viewport;
      vec2 offset = vec2(0.);
      float light = 0.;
      for (int i = 0; i < 4; i++) {
        float time = waves[i].z;
        if (time > 0. && time < 1.) {
          vec2 delta = pixel - waves[i].xy;
          float distance = length(delta);
          vec2 direction = delta / max(distance, 1.);
          for (int j = 0; j < 3; j++) {
            float delay = float(j) * .075;
            float age = (time - delay) / (1. - delay);
            if (age > 0. && age < 1.) {
              float radius = pow(age, .86) * waves[i].w * 1.08;
              float width = 13. + age * 12.;
              float band = (distance - radius) / width;
              float envelope = exp(-band * band * 2.);
              float strength = (1. - age) * (1. - float(j) * .18);
              float slope = sin(band * 3.14159) * envelope * strength;
              offset += direction * slope * 8.;
              light += slope * dot(direction, vec2(-.45, -.65)) * .035;
            }
          }
        }
      }
      float scale = max(viewport.x / imageSize.x, viewport.y / imageSize.y);
      vec2 visible = viewport / (imageSize * scale);
      vec2 sampleUV = (pixel + offset) / viewport * visible + (1. - visible) * focal;
      vec3 colour = texture2D(scene, clamp(sampleUV, 0., 1.)).rgb;
      gl_FragColor = vec4(clamp(colour + light, 0., 1.), 1.);
    }
  `;
  function compile(type: number, source: string) {
    const shader = gl!.createShader(type);
    if (!shader) return null;
    gl!.shaderSource(shader, source); gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) { gl!.deleteShader(shader); return null; }
    return shader;
  }
  const vertex = compile(gl.VERTEX_SHADER, vertexSource), fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  gl.deleteShader(vertex); gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return null; }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const viewport = gl.getUniformLocation(program, "viewport"), imageSize = gl.getUniformLocation(program, "imageSize");
  const focal = gl.getUniformLocation(program, "focal"), waveUniform = gl.getUniformLocation(program, "waves[0]");
  let uploaded = "", lost = false;
  canvas.addEventListener("webglcontextlost", event => { event.preventDefault(); lost = true; canvas.hidden = true; });
  canvas.addEventListener("webglcontextrestored", () => { lost = true; canvas.hidden = true; });
  return {
    clear() { canvas.hidden = true; },
    draw(waves: WaterWave[]) {
      if (!waves.length || lost) { canvas.hidden = true; return false; }
      const image = host.querySelector<HTMLImageElement>("img");
      if (!image?.complete || !image.naturalWidth || image.hidden) { canvas.hidden = true; return false; }
      try {
        if (uploaded !== image.currentSrc) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
          uploaded = image.currentSrc;
        }
        if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
          canvas.width = innerWidth; canvas.height = innerHeight; gl.viewport(0, 0, canvas.width, canvas.height);
        }
        gl.uniform2f(viewport, innerWidth, innerHeight);
        gl.uniform2f(imageSize, image.naturalWidth, image.naturalHeight);
        const [x, y] = getComputedStyle(image).objectPosition.split(" ").map(value => parseFloat(value) / 100);
        gl.uniform2f(focal, Number.isFinite(x) ? x : .5, Number.isFinite(y) ? y : .5);
        const data = new Float32Array(16);
        waves.slice(0, 4).forEach((wave, i) => data.set([wave.x, wave.y, wave.progress, wave.reach], i * 4));
        gl.uniform4fv(waveUniform, data); gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!canvas.isConnected) host.append(canvas);
        canvas.hidden = false; return true;
      } catch { canvas.hidden = true; return false; }
    },
  };
}
