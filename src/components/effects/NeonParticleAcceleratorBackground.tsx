import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  trail: { x: number; y: number }[];
}

interface BeamParticle {
  angle: number;
  speed: number;
  radiusX: number;
  radiusY: number;
  tilt: number;
  color: string;
  size: number;
  direction: 1 | -1;
  phase: number;
  trailLength: number;
  history: { x: number; y: number }[];
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  lineWidth: number;
}

const NEON_SPECTRUM = [
  "#00f3ff", // Electric Cyan
  "#ff007f", // Plasma Magenta
  "#9d00ff", // Laser Ultraviolet
  "#00ff88", // Quantum Emerald
  "#ffaa00", // Solar Amber
  "#0077ff", // Hyperdrive Blue
];

export function NeonParticleAcceleratorBackground() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Track mouse
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // User trigger collision on click
    const onClick = (e: MouseEvent) => {
      spawnCollision(e.clientX, e.clientY, 35);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    // State collections
    const beamParticles: BeamParticle[] = [];
    const collisionParticles: Particle[] = [];
    const shockwaves: Shockwave[] = [];

    // Initialize Synchrotron Collider Beams
    const ringCount = 2; // Counter-rotating beams
    const particlesPerRing = prefersReducedMotion ? 12 : 28;

    for (let r = 0; r < ringCount; r++) {
      const direction: 1 | -1 = r % 2 === 0 ? 1 : -1;
      const baseTilt = r === 0 ? -0.15 : 0.15;

      for (let i = 0; i < particlesPerRing; i++) {
        const color = NEON_SPECTRUM[(i + r * 3) % NEON_SPECTRUM.length];
        beamParticles.push({
          angle: (i / particlesPerRing) * Math.PI * 2,
          speed: (0.012 + Math.random() * 0.008) * direction,
          radiusX: 0, // dynamically set in loop based on screen
          radiusY: 0,
          tilt: baseTilt,
          color,
          size: 1.5 + Math.random() * 2,
          direction,
          phase: Math.random() * Math.PI * 2,
          trailLength: prefersReducedMotion ? 6 : 16,
          history: [],
        });
      }
    }

    // Spawn collision effect
    function spawnCollision(x: number, y: number, count = 20) {
      const burstColor = NEON_SPECTRUM[Math.floor(Math.random() * NEON_SPECTRUM.length)];

      // Shockwave
      shockwaves.push({
        x,
        y,
        radius: 2,
        maxRadius: 80 + Math.random() * 60,
        color: burstColor,
        alpha: 0.9,
        lineWidth: 2.5,
      });

      // Sparks
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        const color = NEON_SPECTRUM[Math.floor(Math.random() * NEON_SPECTRUM.length)];
        collisionParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: 1 + Math.random() * 2.5,
          alpha: 1,
          maxLife: 40 + Math.random() * 30,
          life: 0,
          trail: [],
        });
      }
    }

    let lastCollisionTime = 0;

    // Main physics and render loop
    const render = (time: number) => {
      // Clear with soft fade for motion blur
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const baseRx = Math.min(width, height) * 0.44;
      const baseRy = Math.min(width, height) * 0.26;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // 1. Draw Subtle Collider Ring Guides (Synchrotron vacuum tracks)
      ctx.lineWidth = 1;
      [-0.15, 0.15].forEach((tilt, idx) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, baseRx, baseRy, 0, 0, Math.PI * 2);
        ctx.strokeStyle =
          idx === 0
            ? "rgba(0, 243, 255, 0.05)" // Cyan trace
            : "rgba(255, 0, 127, 0.05)"; // Magenta trace
        ctx.stroke();

        // Secondary inner harmonic ring
        ctx.beginPath();
        ctx.ellipse(0, 0, baseRx * 0.75, baseRy * 0.75, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(157, 0, 255, 0.03)";
        ctx.stroke();
        ctx.restore();
      });

      // 2. Update and Draw Relativistic Beam Particles
      for (let i = 0; i < beamParticles.length; i++) {
        const bp = beamParticles[i];
        bp.angle += bp.speed;

        // Dynamic breathing orbit
        const rx = baseRx + Math.sin(time * 0.001 + bp.phase) * 15;
        const ry = baseRy + Math.cos(time * 0.001 + bp.phase) * 10;

        // Calculate 2D position with elliptical rotation
        const unrotatedX = Math.cos(bp.angle) * rx;
        const unrotatedY = Math.sin(bp.angle) * ry;

        const cosT = Math.cos(bp.tilt);
        const sinT = Math.sin(bp.tilt);
        let px = cx + (unrotatedX * cosT - unrotatedY * sinT);
        let py = cy + (unrotatedX * sinT + unrotatedY * cosT);

        // Magnetic deflection from mouse cursor
        if (mouseRef.current.active) {
          const dx = px - mouseRef.current.x;
          const dy = py - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 1) {
            const force = (1 - dist / 180) * 18;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
        }

        // Store trail
        bp.history.unshift({ x: px, y: py });
        if (bp.history.length > bp.trailLength) {
          bp.history.pop();
        }

        // Draw particle trail
        if (bp.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(bp.history[0].x, bp.history[0].y);
          for (let h = 1; h < bp.history.length; h++) {
            ctx.lineTo(bp.history[h].x, bp.history[h].y);
          }
          ctx.strokeStyle = bp.color;
          ctx.lineWidth = bp.size * 0.8;
          ctx.globalAlpha = 0.45;
          ctx.stroke();
        }

        // Draw particle core
        ctx.beginPath();
        ctx.arc(px, py, bp.size, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.95;
        ctx.fill();

        // Glow halo
        ctx.beginPath();
        ctx.arc(px, py, bp.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = bp.color;
        ctx.globalAlpha = 0.35;
        ctx.fill();
      }

      // 3. Periodic Synchrotron Vertex Collisions (Simulated collisions at focal points)
      if (time - lastCollisionTime > (prefersReducedMotion ? 3500 : 1800)) {
        lastCollisionTime = time;
        // Collision at intersection nodes
        const focalAngles = [0, Math.PI, Math.PI * 0.5, Math.PI * 1.5];
        const focalAngle = focalAngles[Math.floor(Math.random() * focalAngles.length)];
        const rx = baseRx;
        const ry = baseRy;
        const fx = cx + Math.cos(focalAngle) * rx;
        const fy = cy + Math.sin(focalAngle) * ry;
        spawnCollision(fx, fy, prefersReducedMotion ? 10 : 22);
      }

      // 4. Update and Draw Shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 2.2;
        sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

        if (sw.alpha <= 0) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = sw.lineWidth * sw.alpha;
        ctx.globalAlpha = sw.alpha * 0.6;
        ctx.stroke();
      }

      // 5. Update and Draw Collision Sparks
      for (let p = collisionParticles.length - 1; p >= 0; p--) {
        const cp = collisionParticles[p];
        cp.life++;
        cp.x += cp.vx;
        cp.y += cp.vy;
        cp.vx *= 0.96; // deceleration
        cp.vy *= 0.96;

        const progress = cp.life / cp.maxLife;
        const alpha = Math.max(0, 1 - progress);

        if (progress >= 1) {
          collisionParticles.splice(p, 1);
          continue;
        }

        // Draw spark
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, cp.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = cp.color;
        ctx.globalAlpha = alpha * 0.85;
        ctx.fill();

        // Micro spark glow
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, cp.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = cp.color;
        ctx.globalAlpha = alpha * 0.25;
        ctx.fill();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Deep Neon Spectrum Ambient Atmospheric Radial Gradients */}
      <div className="absolute inset-0 bg-[#030712] transition-colors duration-1000" />

      {/* Dynamic Neon Chromatic Glow Nodes */}
      <div
        className="absolute -top-[15%] -left-[10%] h-[55vw] w-[55vw] rounded-full blur-[130px] opacity-25 animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 243, 255, 0.45) 0%, rgba(139, 0, 255, 0.25) 50%, transparent 75%)",
          animationDuration: "9s",
        }}
      />
      <div
        className="absolute -bottom-[20%] -right-[15%] h-[60vw] w-[60vw] rounded-full blur-[140px] opacity-25 animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 0, 127, 0.45) 0%, rgba(255, 170, 0, 0.2) 50%, transparent 75%)",
          animationDuration: "11s",
          animationDelay: "3s",
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[45vw] w-[45vw] rounded-full blur-[150px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 255, 136, 0.35) 0%, rgba(0, 119, 255, 0.25) 60%, transparent 80%)",
        }}
      />

      {/* 2. Quantum Lattice Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 3. Interactive Synchrotron Particle Accelerator Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-85"
      />

      {/* 4. Vignette Tint Mask for Legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/50"
      />
    </div>
  );
}
