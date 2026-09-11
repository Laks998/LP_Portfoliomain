// Shape Mosaic — background layer
// Ported from the "Originkit" React component the design was supplied as:
// same MosaicScene / shader logic, with the React wrapper (hooks, JSX,
// TS types) stripped out since this site is plain HTML/CSS/JS. Runs as
// a native ES module so it can `import` Three.js straight from a CDN
// with no build step.

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const SHAPE_KINDS = 6;

// How fast the field chases the cursor, per second.
const CURSOR_FOLLOW = 9.0;

// The site's own preset: coral ("lit") matches --coral in style.css, so the
// mosaic reads as part of the same palette instead of a bolted-on effect.
const DEFAULTS = {
    ink: "#8A8A8A",
    lit: "#EB676C",
    cell: 20,
    size: 20,
    kinds: 6,
    fill: 1,
    spin: 20,
    turn: 20,
    reach: 10,
};

function clamp(v, lo, hi, fallback) {
    const n = typeof v === "number" && isFinite(v) ? v : fallback;
    return Math.max(lo, Math.min(hi, n));
}

/** Panel values are whole numbers; the shader wants the real ones. */
function settingsFor(cfg) {
    const cell = clamp(cfg.cell, 14, 140, DEFAULTS.cell);
    return {
        cell,
        // A share of the cell. Never a full half, or neighbours touch and the
        // mosaic reads as one sheet.
        radius: cell * (0.1 + clamp(cfg.size, 1, 20, DEFAULTS.size) * 0.016),
        kinds: clamp(cfg.kinds, 1, SHAPE_KINDS, DEFAULTS.kinds),
        // 0 is an outline, 1 is solid, and the shader crossfades between them.
        fill: clamp(cfg.fill, 0, 20, DEFAULTS.fill) / 20,
        // Stroke weight in pixels, held above one so a thin outline does not
        // dash itself apart against the pixel grid.
        stroke: Math.max(1.2, cell * 0.05),
        // Turns per second, before each tile's own seeded direction.
        spin: clamp(cfg.spin, 0, 20, DEFAULTS.spin) * 0.05,
        // Extra turns under the cursor. Roughly one full turn at the top.
        turn: clamp(cfg.turn, 0, 20, DEFAULTS.turn) * 0.05,
        // Squared, because the useful settings are the tight ones.
        reach: 60 + Math.pow(clamp(cfg.reach, 1, 20, DEFAULTS.reach), 2) * 2.2,
    };
}

const QUAD_VERTEX = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`;

const MOSAIC_FRAGMENT = /* glsl */ `
    precision highp float;

    #define TAU 6.28318530718

    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uHold;
    uniform float uTime;
    uniform vec3 uInk;
    uniform vec3 uLit;
    uniform float uCell;
    uniform float uRadius;
    uniform float uKinds;
    uniform float uFill;
    uniform float uStroke;
    uniform float uTurn;
    uniform float uReach;

    varying vec2 vUv;

    float hash2(vec2 v) {
        return fract(sin(dot(v, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float shapeDist(int kind, vec2 v, float r) {
        if (kind == 0) return length(v) - r;
        if (kind == 1) return max(abs(v.x), abs(v.y)) - r * 0.86;
        if (kind == 2) return max(abs(v.x) * 0.866 + v.y * 0.5, -v.y) - r * 0.55;
        if (kind == 3) return abs(v.x) + abs(v.y) - r * 1.16;
        if (kind == 4) {
            float arm = r * 0.3;
            return min(max(abs(v.x) - r, abs(v.y) - arm),
                       max(abs(v.x) - arm, abs(v.y) - r));
        }
        return abs(length(v) - r * 0.72) - r * 0.22;
    }

    void main() {
        vec2 p = vUv * uResolution;
        vec2 cell = floor(p / uCell);
        vec2 mid = (cell + 0.5) * uCell;

        float seed = hash2(cell);
        int kind = int(min(floor(hash2(cell + 7.3) * uKinds), uKinds - 1.0));

        float near = 1.0 - smoothstep(0.0, uReach, length(mid - uPointer));
        near = near * near * uHold;

        float heading = seed < 0.5 ? 1.0 : -1.0;
        float ang = (uTime * (0.6 + seed) * heading + seed * TAU) + near * uTurn * TAU;
        float ca = cos(ang);
        float sa = sin(ang);
        vec2 v = mat2(ca, sa, -sa, ca) * (p - mid);

        float r = uRadius * (1.0 + near * 0.45);
        float d = shapeDist(kind, v, r);

        float aa = max(fwidth(d), 0.0001);
        float solid = 1.0 - smoothstep(-aa, aa, d);
        float outline = 1.0 - smoothstep(uStroke - aa, uStroke + aa, abs(d));
        float mask = mix(outline, solid, uFill);
        if (mask < 0.004) discard;

        vec3 col = mix(uInk, uLit, near);
        float a = mask * (0.65 + 0.35 * near);

        gl_FragColor = vec4(col * a, a);
    }
`;

class MosaicScene {
    constructor(container, cfg) {
        this.container = container;
        this.cfg = cfg;

        this.target = new THREE.Vector2(-1e4, -1e4);
        this.eased = new THREE.Vector2(-1e4, -1e4);
        this.hold = 0;
        this.wantHold = 0;
        this.time = 0;
        this.width = 1;
        this.height = 1;
        this.frameId = 0;
        this.lastT = 0;
        this.disposed = false;

        const S = settingsFor(cfg);

        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.setClearColor(0x000000, 0);

        const el = this.renderer.domElement;
        el.style.position = "absolute";
        el.style.inset = "0";
        el.style.width = "100%";
        el.style.height = "100%";
        el.style.touchAction = "none";
        container.appendChild(el);

        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.geometry = new THREE.PlaneGeometry(2, 2);

        this.material = new THREE.ShaderMaterial({
            vertexShader: QUAD_VERTEX,
            fragmentShader: MOSAIC_FRAGMENT,
            uniforms: {
                uResolution: { value: new THREE.Vector2(1, 1) },
                uPointer: { value: new THREE.Vector2(-1e4, -1e4) },
                uHold: { value: 0 },
                uTime: { value: 0 },
                uInk: { value: new THREE.Color(cfg.ink) },
                uLit: { value: new THREE.Color(cfg.lit) },
                uCell: { value: S.cell },
                uRadius: { value: S.radius },
                uKinds: { value: S.kinds },
                uFill: { value: S.fill },
                uStroke: { value: S.stroke },
                uTurn: { value: S.turn },
                uReach: { value: S.reach },
            },
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.scene.add(this.mesh);

        this.onPointerMove = (e) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            const x = ((e.clientX - rect.left) / rect.width) * this.width;
            const y = (1 - (e.clientY - rect.top) / rect.height) * this.height;
            this.target.set(x, y);
            if (this.wantHold === 0) this.eased.copy(this.target);
            this.wantHold = 1;
        };

        this.onPointerLeave = () => {
            this.wantHold = 0;
        };

        el.addEventListener("pointermove", this.onPointerMove);
        el.addEventListener("pointerdown", this.onPointerMove);
        el.addEventListener("pointerleave", this.onPointerLeave);
        el.addEventListener("pointercancel", this.onPointerLeave);
    }

    start() {
        this.lastT = performance.now();
        const loop = () => {
            this.frameId = requestAnimationFrame(loop);
            this.step();
        };
        loop();
    }

    setSize(width, height) {
        if (this.disposed || width <= 0 || height <= 0) return;
        this.renderer.setSize(width, height, false);
        const dpr = this.renderer.getPixelRatio();
        this.width = width * dpr;
        this.height = height * dpr;
        this.material.uniforms.uResolution.value.set(this.width, this.height);
    }

    updateConfig(cfg) {
        if (this.disposed) return;
        this.cfg = cfg;
        const u = this.material.uniforms;
        u.uInk.value.set(cfg.ink || DEFAULTS.ink);
        u.uLit.value.set(cfg.lit || DEFAULTS.lit);
    }

    step() {
        if (this.disposed) return;
        const now = performance.now();
        let dt = (now - this.lastT) / 1000;
        this.lastT = now;
        if (!isFinite(dt) || dt < 0) dt = 0;
        // A returning tab must not spin every tile through a dozen turns.
        if (dt > 0.05) dt = 0.05;

        const S = settingsFor(this.cfg);
        this.time += dt * S.spin * Math.PI * 2;
        this.eased.lerp(this.target, 1 - Math.exp(-dt * CURSOR_FOLLOW));
        this.hold += (this.wantHold - this.hold) * (1 - Math.exp(-dt * 5));

        const dpr = this.renderer.getPixelRatio();
        const u = this.material.uniforms;
        u.uTime.value = this.time;
        u.uPointer.value.copy(this.eased);
        u.uHold.value = this.hold;
        u.uCell.value = S.cell * dpr;
        u.uRadius.value = S.radius * dpr;
        u.uKinds.value = S.kinds;
        u.uFill.value = S.fill;
        u.uStroke.value = S.stroke * dpr;
        u.uTurn.value = S.turn;
        u.uReach.value = S.reach * dpr;

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.disposed = true;
        cancelAnimationFrame(this.frameId);
        const el = this.renderer.domElement;
        el.removeEventListener("pointermove", this.onPointerMove);
        el.removeEventListener("pointerdown", this.onPointerMove);
        el.removeEventListener("pointerleave", this.onPointerLeave);
        el.removeEventListener("pointercancel", this.onPointerLeave);
        this.geometry.dispose();
        this.material.dispose();
        this.renderer.dispose();
        if (el.parentNode === this.container) this.container.removeChild(el);
    }
}

function initMosaicBackground() {
    const container = document.getElementById("bgMosaic");
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return; // falls back to the plain --bg color, see style.css

    let scene;
    try {
        scene = new MosaicScene(container, DEFAULTS);
    } catch (err) {
        console.error("Shape mosaic background could not start (WebGL unavailable?):", err);
        return;
    }

    scene.setSize(container.clientWidth, container.clientHeight);
    scene.start();

    const ro = new ResizeObserver(() => {
        scene.setSize(container.clientWidth, container.clientHeight);
    });
    ro.observe(container);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMosaicBackground);
} else {
    initMosaicBackground();
}
