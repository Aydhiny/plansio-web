"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";

/*
 * Aurora (React Bits) on ogl — a flowing, elegant gradient curtain. Adapted to
 * TS and perf-guarded to match this project's other WebGL chrome (PrismaticBurst
 * / Scene3D): DPR capped, ~30fps throttle, pauses off-screen or when hidden,
 * reduced-motion / low-power renders ONE static frame, the constructor is
 * wrapped in try/catch (GPU-less browsers fall back to the CSS gradient), and
 * everything is disposed + the GL context released on unmount.
 *
 * alpha:true so it composits over the hero's dark CSS gradient and glows.
 */

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop { vec3 color; float position; };

#define COLOR_RAMP(colors, factor, finalColor) { \
  int index = 0; \
  for (int i = 0; i < 2; i++) { \
     ColorStop currentColor = colors[i]; \
     bool isInBetween = currentColor.position <= factor; \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  } \
  ColorStop currentColor = colors[index]; \
  ColorStop nextColor = colors[index + 1]; \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, clamp(lerpFactor, 0.0, 1.0)); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops?: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
}

export default function Aurora({
  colorStops = ["#7A5CFF", "#C13AD6", "#3E8BFF"],
  amplitude = 1.1,
  blend = 0.55,
  speed = 0.7,
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lowPower =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 820px)").matches ||
      (navigator.hardwareConcurrency || 8) <= 4;
    const maxdim = lowPower ? 720 : 1280;

    let renderer: InstanceType<typeof Renderer>;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    } catch {
      return; // no WebGL → CSS gradient remains
    }
    const gl = renderer.gl;
    if (!gl) return;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.position = "absolute";
    gl.canvas.style.inset = "0";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uBlend: { value: blend },
        uResolution: { value: [1, 1] },
        uColorStops: { value: colorStops.map((c) => new Color(c)) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.dpr = Math.min(window.devicePixelRatio || 1, maxdim / Math.max(w, h));
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      if (lowPower) renderStatic();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let inView = true;
    const io = new IntersectionObserver((e) => e[0] && (inView = e[0].isIntersecting), { threshold: 0.01 });
    io.observe(container);

    const renderStatic = () => {
      program.uniforms.uTime.value = 4;
      renderer.render({ scene: mesh });
    };

    resize();

    let raf = 0;
    let last = 0;
    const update = (now: number) => {
      raf = requestAnimationFrame(update);
      if (!inView || document.hidden) return;
      if (now - last < 33) return; // ~30fps
      last = now;
      program.uniforms.uTime.value = (now * 0.001) * speed;
      program.uniforms.uAmplitude.value = amplitude;
      program.uniforms.uBlend.value = blend;
      renderer.render({ scene: mesh });
    };

    if (lowPower) renderStatic();
    else raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      try {
        container.removeChild(gl.canvas);
      } catch {
        /* already removed */
      }
      try {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="hm-aurora" ref={containerRef} aria-hidden="true" />;
}
