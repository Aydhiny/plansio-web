"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * Scene3D — a real Three.js showpiece (not the ogl burst): a noise-displaced
 * icosahedron with a fresnel rim in the brand gradient, wrapped in an orbiting
 * particle constellation. Pointer-reactive.
 *
 * Performance is designed in, matching PrismaticBurst's guards:
 *   - DPR capped (fragments scale with dpr²);
 *   - loop pauses when off-screen or the tab is hidden;
 *   - reduced-motion / coarse-pointer / low-core → ONE static frame, no RAF;
 *   - constructor wrapped in try/catch so a GPU-less browser falls back to the
 *     themed background instead of crashing;
 *   - every geometry/material/renderer disposed + WebGL context released on
 *     unmount, so route changes / fast-refresh can't leak contexts.
 *
 * alpha:true → it composits over the page's themed atmosphere, so it works in
 * light and dark without clearing to a colour.
 */

// Ashima 3D simplex noise (public domain) — used in the vertex shader to
// displace the surface and in the fragment shader for a subtle grain.
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

const blobVert = /* glsl */ `
uniform float uTime; uniform vec2 uPointer; uniform float uAmp;
varying float vNoise; varying vec3 vNormalW; varying vec3 vViewDir;
${SIMPLEX}
void main(){
  float t = uTime * 0.28;
  // layered noise → organic, slowly morphing surface
  float n = snoise(normal * 1.1 + vec3(t)) * 0.6
          + snoise(normal * 2.3 - vec3(t * 0.7)) * 0.3;
  // a pointer-driven bulge so the shape leans toward the cursor
  float lean = dot(normalize(normal.xy), uPointer) * 0.25;
  float disp = (n + lean) * uAmp;
  vec3 pos = position + normal * disp;
  vNoise = n;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vNormalW = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const blobFrag = /* glsl */ `
precision highp float;
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uDark;
varying float vNoise; varying vec3 vNormalW; varying vec3 vViewDir;
void main(){
  // gradient across the brand ramp, driven by the surface noise
  float g = clamp(vNoise * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uA, uB, smoothstep(0.0, 0.6, g));
  col = mix(col, uC, smoothstep(0.5, 1.0, g));
  // fresnel rim — bright edges, the signature of the whole thing
  float fres = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 2.4);
  col += fres * (0.6 + uDark * 0.9);
  // in light mode keep the body airy; in dark let it glow
  float alpha = mix(0.9, 0.82 + fres * 0.18, uDark);
  gl_FragColor = vec4(col, alpha);
}`;

const dotsVert = /* glsl */ `
uniform float uTime; uniform float uSize; attribute float aScale;
varying float vA;
void main(){
  vec3 p = position;
  float t = uTime * 0.2;
  // gentle orbital drift
  p.x += sin(t + position.z * 3.0) * 0.06;
  p.y += cos(t + position.x * 3.0) * 0.06;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  // clamp so a point that drifts near the camera plane can't blow up into a
  // full-height sprite at the screen edge
  gl_PointSize = clamp(uSize * aScale * (300.0 / -mv.z), 0.0, 22.0);
  vA = aScale;
}`;

const dotsFrag = /* glsl */ `
precision mediump float; uniform vec3 uColor; varying float vA;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d) * (0.35 + vA * 0.5);
  gl_FragColor = vec4(uColor, a);
}`;

function hexToVec3(hex: string): [number, number, number] {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
}

export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      reduce ||
      window.matchMedia("(pointer: coarse)").matches ||
      (navigator.hardwareConcurrency || 8) <= 4;

    // Opaque canvas with a themed clear colour — NOT alpha:true. Transparent
    // WebGL compositing is unreliable across browsers/GPUs (it renders white in
    // some), so we paint the scene's own background to match the page instead.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: false, antialias: !lowPower, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL → leave the themed background (CSS) visible
    }
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.6);
    renderer.setPixelRatio(dpr);
    const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";
    const applyBg = () => renderer.setClearColor(isDark() ? 0x0b0910 : 0xf4f2fb, 1);
    applyBg();
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;

    // ---- the blob ----
    const geo = new THREE.IcosahedronGeometry(1.25, lowPower ? 24 : 48);
    const mat = new THREE.ShaderMaterial({
      vertexShader: blobVert,
      fragmentShader: blobFrag,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uAmp: { value: 0.34 },
        uA: { value: new THREE.Vector3(...hexToVec3("#2a3bed")) },
        uB: { value: new THREE.Vector3(...hexToVec3("#6a22d8")) },
        uC: { value: new THREE.Vector3(...hexToVec3("#d93d72")) },
        uDark: { value: isDark() ? 1 : 0 },
      },
    });
    const blob = new THREE.Mesh(geo, mat);
    scene.add(blob);

    // ---- particle constellation ----
    const COUNT = lowPower ? 260 : 520;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // shell distribution around the blob
      const r = 1.9 + Math.pow((i % 97) / 97, 2) * 1.6;
      const theta = i * 2.399963; // golden angle → even spread
      const phi = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      scales[i] = 0.4 + ((i * 13) % 100) / 100;
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotsGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    const dotsMat = new THREE.ShaderMaterial({
      vertexShader: dotsVert,
      fragmentShader: dotsFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: lowPower ? 5 : 7 },
        uColor: { value: new THREE.Vector3(...hexToVec3("#8fb8ff")) },
      },
    });
    const dots = new THREE.Points(dotsGeo, dotsMat);
    scene.add(dots);

    // ---- theme reactivity ----
    const themeObserver = new MutationObserver(() => {
      applyBg();
      mat.uniforms.uDark.value = isDark() ? 1 : 0;
      dotsMat.uniforms.uColor.value.set(...hexToVec3(isDark() ? "#b79cff" : "#8fb8ff"));
      if (lowPower) renderOnce();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // ---- pointer ----
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointer = new THREE.Vector2(0, 0);
    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerTarget.set(
        ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
        -(((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1)
      );
    };
    container.addEventListener("pointermove", onPointer, { passive: true });

    // ---- sizing ----
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

    // ---- visibility gating ----
    let inView = true;
    const io = new IntersectionObserver((entries) => entries[0] && (inView = entries[0].isIntersecting), { threshold: 0.01 });
    io.observe(container);

    const clock = new THREE.Clock();

    const renderOnce = () => {
      mat.uniforms.uTime.value = 6;
      dotsMat.uniforms.uTime.value = 6;
      renderer.render(scene, camera);
    };

    let raf = 0;
    let lastRender = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!inView || document.hidden) return;
      const now = performance.now();
      if (now - lastRender < 32) return; // ~30fps cap — plenty for this motion
      lastRender = now;

      const t = clock.getElapsedTime();
      pointer.lerp(pointerTarget, 0.06);

      mat.uniforms.uTime.value = t;
      mat.uniforms.uPointer.value.copy(pointer);
      dotsMat.uniforms.uTime.value = t;

      // whole rig eases toward the cursor + a slow idle spin
      blob.rotation.y = t * 0.12 + pointer.x * 0.5;
      blob.rotation.x = pointer.y * 0.4;
      dots.rotation.y = -t * 0.04;
      dots.rotation.x = pointer.y * 0.2;

      renderer.render(scene, camera);
    };

    if (lowPower) renderOnce();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      geo.dispose();
      mat.dispose();
      dotsGeo.dispose();
      dotsMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
      try {
        container.removeChild(renderer.domElement);
      } catch {
        /* already gone */
      }
    };
  }, []);

  return <div className="scene3d-canvas" ref={containerRef} aria-hidden="true" />;
}
