/** A shared triangle mesh keeps curved previews on one continuous drawing surface. */
export type GalleryRendererOptions = {
  images: { src: string; video?: string }[];
  speed: number;
  tileHeight: number;
  aspectRatio: number;
  gap: number;
  axis: number;
  curve: number;
  framed: boolean;
  onReady: () => void;
  onError: () => void;
};

export function galleryGeometry(width: number, height: number, options: Pick<GalleryRendererOptions, 'tileHeight' | 'aspectRatio' | 'gap' | 'curve'>) {
  const camera = 1.6;
  const bend = Math.min(85, Math.max(5, options.curve)) * Math.PI / 180;
  const radius = width * (camera - 1 + Math.cos(bend)) / (2 * camera * Math.sin(bend));
  const tile = Math.min(options.tileHeight / 100 * height, 0.55 * width / options.aspectRatio);
  return { radius, tile, arc: tile * options.aspectRatio / radius, pitch: tile * (options.aspectRatio + options.gap / 100) / radius, bend };
}

export function createGalleryRenderer(canvas: HTMLCanvasElement, options: GalleryRendererOptions) {
  const attributes = { alpha: true, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: true };
  const gl = (canvas.getContext('webgl2', attributes) || canvas.getContext('webgl', attributes)) as WebGL2RenderingContext | WebGLRenderingContext | null;
  if (!gl) throw new Error('WebGL unavailable');
  const modern = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  const derivatives = modern || !!gl.getExtension('OES_standard_derivatives');
  const vertexSource = `${modern ? '#version 300 es\n' : ''}
    precision highp float;
    ${modern ? 'in' : 'attribute'} vec2 aUV;
    ${modern ? 'out' : 'varying'} vec2 vUV;
    uniform vec2 uViewport;
    uniform float uRadius;
    uniform float uHeight;
    uniform float uArc;
    uniform float uAngle;
    uniform float uAxis;
    void main() {
      // Clamp geometry behind the front hemisphere, entirely beyond the
      // viewport. No face ever crosses the camera or reappears on its back.
      float angle = clamp(uAngle + (aUV.x - .5) * uArc, -1.5707, 1.5707);
      float camera = uRadius * 1.6;
      float w = uRadius * (.6 + cos(angle));
      float x = uRadius * sin(angle);
      float y = (aUV.y - .5) * uHeight;
      gl_Position = vec4(2. * x * camera / uViewport.x,
        (1. - 2. * uAxis) * w - 2. * y * camera / uViewport.y,
        .5 * cos(angle) * w, w);
      vUV = aUV;
    }`;
  const fragmentSource = `${modern ? '#version 300 es\n' : derivatives ? '#extension GL_OES_standard_derivatives : enable\n' : ''}
    precision highp float;
    ${modern ? 'in' : 'varying'} vec2 vUV;
    ${modern ? 'out vec4 pixel;' : ''}
    uniform sampler2D uImage;
    uniform vec2 uSize;
    uniform float uFramed;
    float roundedBox(vec2 p, vec2 halfSize, float radius) {
      vec2 q = abs(p) - halfSize + radius;
      return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - radius;
    }
    void main() {
      vec2 p = vUV * uSize;
      float radius = mix(8., 16., uFramed);
      float padding = 5. * uFramed;
      float outer = roundedBox(p - .5 * uSize, .5 * uSize, radius);
      float aa = ${derivatives ? 'max(fwidth(outer), .6)' : '.8'};
      float alpha = 1. - smoothstep(-aa, aa, outer);
      if (alpha < .001) discard;
      float inner = roundedBox(p - .5 * uSize, .5 * uSize - padding, max(0., radius - padding));
      vec2 uv = clamp((p - padding) / (uSize - 2. * padding), 0., 1.);
      vec3 image = ${modern ? 'texture' : 'texture2D'}(uImage, uv).rgb;
      vec3 frame = mix(vec3(.09), vec3(.272), smoothstep(-1.5, -.5, outer));
      vec3 color = mix(frame, image, 1. - smoothstep(-aa, aa, inner));
      ${modern ? 'pixel' : 'gl_FragColor'} = vec4(color, alpha);
    }`;

  function shader(type: number, source: string) {
    const result = gl!.createShader(type);
    if (!result) throw new Error('Shader allocation failed');
    gl!.shaderSource(result, source);
    gl!.compileShader(result);
    if (!gl!.getShaderParameter(result, gl!.COMPILE_STATUS)) {
      const message = gl!.getShaderInfoLog(result);
      gl!.deleteShader(result);
      throw new Error(message || 'Shader compilation failed');
    }
    return result;
  }
  const vertex = shader(gl.VERTEX_SHADER, vertexSource);
  const fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error('Program allocation failed');
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Program linking failed');

  // Adjacent triangles share vertices and texture coordinates: there are no
  // independent clipping edges, image copies or fractional CSS strip gaps.
  const segments = 64;
  const vertices = new Float32Array((segments + 1) * 4);
  const indices = new Uint16Array(segments * 6);
  for (let i = 0; i <= segments; i++) vertices.set([i / segments * 1.04 - .02, -.04, i / segments * 1.04 - .02, 1.04], i * 4);
  for (let i = 0; i < segments; i++) indices.set([i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 2, i * 2 + 1, i * 2 + 3], i * 6);
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.useProgram(program);
  const attribute = gl.getAttribLocation(program, 'aUV');
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = Object.fromEntries(['uViewport', 'uRadius', 'uHeight', 'uArc', 'uAngle', 'uAxis', 'uImage', 'uSize', 'uFramed'].map(name => [name, uniform(name)]));
  gl.uniform1i(uniforms.uImage, 0);
  gl.uniform1f(uniforms.uFramed, options.framed ? 1 : 0);
  gl.uniform1f(uniforms.uAxis, options.axis / 100);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 0);
  const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
  const textures: WebGLTexture[] = [];
  const videos = new Map<number, HTMLVideoElement>();
  let width = 0, height = 0, phase = .5, lastTime: number | null = null, frame = 0;
  let paused = true, ready = false, destroyed = false, failed = false;

  function draw() {
    if (!ready || destroyed || failed || !width || !height) return;
    const geometry = galleryGeometry(width, height, options);
    if (!(geometry.pitch > 0)) return;
    for (const [index, video] of videos) {
      if (video.readyState >= 2) {
        gl!.bindTexture(gl!.TEXTURE_2D, textures[index]);
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, video);
      }
    }
    gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
    gl!.uniform2f(uniforms.uViewport, width, height);
    gl!.uniform1f(uniforms.uRadius, geometry.radius);
    gl!.uniform1f(uniforms.uHeight, geometry.tile);
    gl!.uniform1f(uniforms.uArc, geometry.arc);
    gl!.uniform2f(uniforms.uSize, geometry.tile * options.aspectRatio, geometry.tile);
    // Each integer identifies one screen forever. It moves out through the
    // viewport clip; no visible screen resets its transform or changes image.
    const reach = (geometry.bend + geometry.arc / 2) / geometry.pitch + 1;
    for (let card = Math.floor(phase - reach); card <= Math.ceil(phase + reach); card++) {
      const angle = (card - phase) * geometry.pitch;
      if (Math.abs(angle) > geometry.bend + geometry.arc / 2 + .01) continue;
      const index = ((card % textures.length) + textures.length) % textures.length;
      gl!.bindTexture(gl!.TEXTURE_2D, textures[index]);
      gl!.uniform1f(uniforms.uAngle, angle);
      gl!.drawElements(gl!.TRIANGLES, indices.length, gl!.UNSIGNED_SHORT, 0);
    }
  }
  function tick(time: number) {
    frame = 0;
    if (paused || destroyed || failed) return;
    if (lastTime !== null) phase += Math.min(time - lastTime, 100) / (Math.max(.1, options.speed) * 1000);
    lastTime = time;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (!paused && ready && !destroyed && !failed && !frame) frame = requestAnimationFrame(tick);
  }
  function loseContext(event: Event) {
    event.preventDefault();
    failed = true;
    for (const video of videos.values()) video.pause();
    cancelAnimationFrame(frame);
    options.onError();
  }
  canvas.addEventListener('webglcontextlost', loseContext);
  canvas.dataset.renderer = modern ? 'webgl2' : 'webgl';

  const loads = options.images.map(({ src, video: videoSrc }, index) => new Promise<HTMLImageElement>((resolve, reject) => {
    if (videoSrc) {
      const video = document.createElement('video');
      video.muted = true; video.loop = true; video.playsInline = true;
      video.preload = 'auto'; video.src = videoSrc;
      videos.set(index, video);
      video.addEventListener('loadeddata', () => {
        if (!destroyed && !failed) { draw(); if (!paused) void video.play().catch(() => {}); }
      });
    }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Image failed: ${src}`));
    image.src = src;
  }));
  Promise.all(loads).then(images => {
    if (destroyed || failed || !images.length) return;
    for (const image of images) {
      const texture = gl.createTexture();
      if (!texture) throw new Error('Texture allocation failed');
      textures.push(texture);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      const powerOfTwo = (n: number) => (n & (n - 1)) === 0;
      const mipmaps = !videos.has(textures.length - 1) && (modern || (powerOfTwo(image.naturalWidth) && powerOfTwo(image.naturalHeight)));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      if (mipmaps) gl.generateMipmap(gl.TEXTURE_2D);
      if (anisotropy) gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
    }
    ready = true;
    canvas.dataset.ready = 'true';
    draw();
    options.onReady();
    schedule();
  }).catch(() => {
    if (!destroyed) { failed = true; options.onError(); }
  });

  return {
    resize(nextWidth: number, nextHeight: number) {
      width = nextWidth; height = nextHeight;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    },
    setPaused(nextPaused: boolean) {
      paused = nextPaused;
      for (const video of videos.values()) {
        if (paused) video.pause(); else void video.play().catch(() => {});
      }
      lastTime = null;
      if (paused) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    },
    destroy() {
      destroyed = true;
      for (const video of videos.values()) { video.pause(); video.removeAttribute('src'); video.load(); }
      cancelAnimationFrame(frame);
      canvas.removeEventListener('webglcontextlost', loseContext);
      for (const texture of textures) gl.deleteTexture(texture);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
    },
  };
}
