"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * HunterHero3D — a bespoke Three.js showpiece for the Hunter Mouse 2 page:
 * a glowing, faceted "thunderbolt core" (custom-GLSL neon fresnel, gently
 * noise-displaced) ringed by low-poly floating sky-islands that bob and orbit,
 * wrapped in a drifting field of additive spark motes (the game's thunderbolts).
 * Pointer-reactive parallax; theme-aware.
 *
 * Robustness mirrors Scene3D.tsx exactly — this is production chrome, not a toy:
 *   - DPR capped (fragment cost scales with dpr²);
 *   - the RAF loop pauses when off-screen or the tab is hidden;
 *   - reduced-motion / coarse-pointer / low-core → ONE static frame, no loop;
 *   - the WebGLRenderer constructor is wrapped in try/catch, so a GPU-less
 *     browser silently falls back to the themed CSS background;
 *   - every geometry/material/renderer is disposed and the GL context released
 *     on unmount, so route changes / fast-refresh can't leak contexts.
 *
 * We use an OPAQUE, theme-matched clear colour (NOT alpha:true) because
 * transparent WebGL compositing is unreliable across GPUs — same call the
 * existing Scene3D makes. In light mode this reads as a bright neon sky (which
 * matches the game's real hub worlds); in dark mode the neon glows on near-black.
 */

// Ashima 3D simplex noise (public domain) — subtle, living displacement of the core.
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const coreVert = /* glsl */ `
uniform float uTime; uniform float uAmp;
varying vec3 vNormalW; varying vec3 vViewDir; varying float vN;
${SIMPLEX}
void main(){
  float t = uTime * 0.35;
  float n = snoise(normal * 1.4 + vec3(t)) * 0.6 + snoise(normal * 3.1 - vec3(t*0.6)) * 0.25;
  vN = n;
  vec3 pos = position + normal * n * uAmp;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vNormalW = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const coreFrag = /* glsl */ `
precision highp float;
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uDark; uniform float uPulse;
varying vec3 vNormalW; varying vec3 vViewDir; varying float vN;
void main(){
  float g = clamp(vN * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uA, uB, smoothstep(0.0, 0.6, g));
  col = mix(col, uC, smoothstep(0.5, 1.0, g));
  // fresnel rim — the neon signature
  float fres = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 2.2);
  col += fres * (0.7 + uDark * 1.1);
  col *= 0.9 + uPulse * 0.35;   // slow breathing glow
  gl_FragColor = vec4(col, 1.0);
}`;

const sparkVert = /* glsl */ `
uniform float uTime; uniform float uSize; attribute float aScale; attribute float aSeed;
varying float vA;
void main(){
  vec3 p = position;
  float t = uTime * 0.3 + aSeed * 6.28;
  p.x += sin(t + position.z * 2.0) * 0.12;
  p.y += cos(t * 0.8 + position.x * 2.0) * 0.12 + sin(uTime*0.15+aSeed*10.0)*0.05;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uSize * aScale * (300.0 / -mv.z), 0.0, 26.0);
  vA = aScale;
}`;

const sparkFrag = /* glsl */ `
precision mediump float; uniform vec3 uColor; uniform vec3 uColor2; varying float vA;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d) * (0.35 + vA * 0.55);
  vec3 c = mix(uColor, uColor2, vA);
  gl_FragColor = vec4(c, a);
}`;

function v3(hex: string): [number, number, number] {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
}

// game neon palette
const PALETTE = ["#d93d72", "#b81fc4", "#6a22d8", "#f36844", "#f7b231", "#2a3bed", "#35d0e0", "#43c56a"];

export default function HunterHero3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      reduce || window.matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency || 8) <= 4;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: false, antialias: !lowPower, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL → themed CSS background stays
    }
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.6);
    renderer.setPixelRatio(dpr);
    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";
    const applyBg = () => {
      const c = isDark() ? 0x0b0910 : 0xeef0ff;
      renderer.setClearColor(c, 1);
      scene.fog = new THREE.FogExp2(c, isDark() ? 0.052 : 0.03);
    };
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.6, 9.2);
    applyBg();

    // ---- lighting: neon hemisphere + warm key + core point light ----
    const hemi = new THREE.HemisphereLight(0xff6ec7, 0x4422aa, 1.15);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffd9a0, 1.35);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x35d0e0, 0.8);
    rim.position.set(-4, -1, 2);
    scene.add(rim);
    const corePt = new THREE.PointLight(0xff4fa0, 2.4, 14, 2);
    scene.add(corePt);

    const root = new THREE.Group();
    scene.add(root);

    // ---- the thunderbolt core ----
    const coreGeo = new THREE.IcosahedronGeometry(1.5, lowPower ? 6 : 12);
    const coreMat = new THREE.ShaderMaterial({
      vertexShader: coreVert,
      fragmentShader: coreFrag,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.22 },
        uPulse: { value: 0 },
        uDark: { value: isDark() ? 1 : 0 },
        uA: { value: new THREE.Vector3(...v3("#2a3bed")) },
        uB: { value: new THREE.Vector3(...v3("#b81fc4")) },
        uC: { value: new THREE.Vector3(...v3("#f7b231")) },
      },
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    root.add(core);

    // ---- floating low-poly sky-islands orbiting the core ----
    const ISLANDS = lowPower ? 9 : 14;
    const islandGeos: THREE.BufferGeometry[] = [];
    const islandMats: THREE.Material[] = [];
    const islands: { mesh: THREE.Mesh; ang: number; rad: number; y: number; spin: number; bob: number; ph: number }[] = [];
    for (let i = 0; i < ISLANDS; i++) {
      const g = new THREE.IcosahedronGeometry(0.5 + ((i * 7) % 5) * 0.12, 0); // chunky low-poly
      const m = new THREE.MeshStandardMaterial({
        color: new THREE.Color(PALETTE[i % PALETTE.length]),
        flatShading: true,
        roughness: 0.55,
        metalness: 0.05,
        emissive: new THREE.Color(PALETTE[i % PALETTE.length]).multiplyScalar(0.12),
      });
      const mesh = new THREE.Mesh(g, m);
      const ang = (i / ISLANDS) * Math.PI * 2 + (i % 3) * 0.4;
      const rad = 3.2 + ((i * 13) % 7) * 0.42;
      const y = ((i % 5) - 2) * 0.9 + Math.sin(i) * 0.4;
      mesh.scale.set(1, 0.4 + ((i * 5) % 3) * 0.12, 1); // flattened → floating platform
      mesh.position.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad * 0.7);
      root.add(mesh);
      islandGeos.push(g);
      islandMats.push(m);
      islands.push({ mesh, ang, rad, y, spin: (i % 2 ? 1 : -1) * (0.1 + (i % 4) * 0.05), bob: 0.2 + (i % 3) * 0.1, ph: i * 1.3 });
    }

    // ---- thunderbolt spark field ----
    const COUNT = lowPower ? 240 : 520;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.2 + Math.pow((i % 89) / 89, 1.6) * 6.5;
      const theta = i * 2.399963;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      scales[i] = 0.35 + ((i * 17) % 100) / 100;
      seeds[i] = ((i * 31) % 100) / 100;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    sparkGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    sparkGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    const sparkMat = new THREE.ShaderMaterial({
      vertexShader: sparkVert,
      fragmentShader: sparkFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: lowPower ? 7 : 9 },
        uColor: { value: new THREE.Vector3(...v3("#ffd45e")) },
        uColor2: { value: new THREE.Vector3(...v3("#4fe0ff")) },
      },
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    // ---- theme reactivity ----
    const themeObserver = new MutationObserver(() => {
      applyBg();
      coreMat.uniforms.uDark.value = isDark() ? 1 : 0;
      hemi.intensity = isDark() ? 0.9 : 1.15;
      if (lowPower) renderOnce();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // ---- pointer parallax ----
    const target = new THREE.Vector2(0, 0);
    const smooth = new THREE.Vector2(0, 0);
    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      target.set(
        ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
        -(((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1)
      );
    };
    container.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let inView = true;
    const io = new IntersectionObserver((en) => en[0] && (inView = en[0].isIntersecting), { threshold: 0.01 });
    io.observe(container);

    const clock = new THREE.Clock();

    const frame = (t: number) => {
      smooth.lerp(target, 0.05);
      coreMat.uniforms.uTime.value = t;
      coreMat.uniforms.uPulse.value = 0.5 + 0.5 * Math.sin(t * 1.1);
      sparkMat.uniforms.uTime.value = t;

      core.rotation.y = t * 0.14 + smooth.x * 0.5;
      core.rotation.x = t * 0.05 + smooth.y * 0.3;
      corePt.position.set(smooth.x * 1.5, smooth.y * 1.2 + 0.5, 2.5);

      root.rotation.y = t * 0.03 + smooth.x * 0.35;
      sparks.rotation.y = -t * 0.02;

      for (const is of islands) {
        const a = is.ang + t * is.spin * 0.15;
        is.mesh.position.x = Math.cos(a) * is.rad;
        is.mesh.position.z = Math.sin(a) * is.rad * 0.7;
        is.mesh.position.y = is.y + Math.sin(t * 0.6 + is.ph) * is.bob;
        is.mesh.rotation.y = t * is.spin;
        is.mesh.rotation.x = Math.sin(t * 0.3 + is.ph) * 0.15;
      }

      // subtle camera parallax
      camera.position.x += (smooth.x * 0.9 - camera.position.x) * 0.04;
      camera.position.y += (0.6 + smooth.y * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const renderOnce = () => frame(6);

    let raf = 0;
    let lastRender = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!inView || document.hidden) return;
      const now = performance.now();
      if (now - lastRender < 32) return; // ~30fps cap
      lastRender = now;
      frame(clock.getElapsedTime());
    };

    if (lowPower) renderOnce();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      coreGeo.dispose();
      coreMat.dispose();
      islandGeos.forEach((g) => g.dispose());
      islandMats.forEach((m) => m.dispose());
      sparkGeo.dispose();
      sparkMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
      try {
        container.removeChild(renderer.domElement);
      } catch {
        /* already gone */
      }
    };
  }, []);

  return <div className="hm-hero-canvas" ref={containerRef} aria-hidden="true" />;
}
