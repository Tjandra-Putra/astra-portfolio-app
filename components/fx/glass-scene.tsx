"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Procedural WebGL hero — a slowly orbiting cluster of frosted glass panels
 * with a single accent element, echoing the interface's own material.
 *
 * Deliberately asset-free (geometry is generated, no model files), lazy-loads
 * three only on the client, caps DPR, pauses when scrolled out of view, and
 * renders nothing at all under prefers-reduced-motion or on small screens —
 * where it would cost battery without being seen.
 */
export function GlassScene({ className = "" }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  // Re-runs the effect when the viewport crosses the mobile threshold, so a
  // desktop-initialised canvas is torn down on resize instead of lingering.
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!wide) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        setFailed(true);
        return;
      }
      if (disposed || !host) return;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      if (!renderer.getContext()) {
        setFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 9);

      const isDark = () => document.documentElement.classList.contains("dark");

      /* ── Rounded-rect panel geometry (matches the UI's 15px radius) ── */
      const panelGeo = (w: number, h: number, r: number) => {
        const s = new THREE.Shape();
        s.moveTo(-w / 2 + r, -h / 2);
        s.lineTo(w / 2 - r, -h / 2);
        s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
        s.lineTo(w / 2, h / 2 - r);
        s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
        s.lineTo(-w / 2 + r, h / 2);
        s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
        s.lineTo(-w / 2, -h / 2 + r);
        s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
        return new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 10 });
      };

      const glass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.36,
        roughness: 0.1,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        side: THREE.DoubleSide,
      });
      const accent = new THREE.MeshPhysicalMaterial({
        color: 0xd94d12,
        emissive: 0xd94d12,
        emissiveIntensity: 0.42,
        transparent: true,
        opacity: 0.92,
        roughness: 0.28,
        metalness: 0,
        clearcoat: 1,
      });

      const group = new THREE.Group();
      const geos: import("three").BufferGeometry[] = [];

      // Staggered stack — the same "cards rising toward the light" idea as the DOM.
      const layout: [number, number, number, number, number, number, boolean][] = [
        [3.0, 2.0, 0, 0.35, 0, -0.16, false],
        [2.2, 1.5, -1.85, -0.8, 1.15, 0.2, false],
        [1.7, 1.15, 1.95, -1.05, 0.85, -0.34, false],
        [1.35, 0.95, 1.5, 1.45, 1.5, 0.12, false],
        [1.05, 1.05, -1.6, 1.55, 1.9, -0.24, true],
        [2.4, 0.55, 0.25, -1.95, 0.5, 0.06, false],
      ];

      for (const [w, h, x, y, z, rot, isAcc] of layout) {
        const g = panelGeo(w, h, 0.16);
        geos.push(g);
        const m = new THREE.Mesh(g, isAcc ? accent : glass);
        m.position.set(x, y, z);
        m.rotation.z = rot;
        group.add(m);
      }
      scene.add(group);

      /* ── Dust field ── */
      const count = 420;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 16;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const dustMat = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.5, color: 0x888888 });
      const dust = new THREE.Points(dustGeo, dustMat);
      scene.add(dust);

      /* ── Light ── */
      const amb = new THREE.AmbientLight(0xffffff, 1.05);
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(4, 6, 8);
      const rim = new THREE.DirectionalLight(0xffffff, 1.1);
      rim.position.set(-6, -3, 4);
      const accLight = new THREE.PointLight(0xd94d12, 9, 14);
      accLight.position.set(-2.4, 2.4, 3.2);
      scene.add(amb, key, rim, accLight);

      const applyTheme = () => {
        const d = isDark();
        amb.intensity = d ? 0.5 : 1.05;
        key.intensity = d ? 1.5 : 2.1;
        glass.opacity = d ? 0.2 : 0.36;
        glass.color.set(d ? 0xdfe2ea : 0xffffff);
        dustMat.color.set(d ? 0xffffff : 0x888888);
        dustMat.opacity = d ? 0.4 : 0.5;
      };
      applyTheme();
      const themeObserver = new MutationObserver(applyTheme);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

      /* ── Interaction + loop ── */
      const target = { x: 0, y: 0 };
      const current = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2;
        target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let visible = true;
      const io = new IntersectionObserver((en) => (visible = en[0].isIntersecting), { threshold: 0 });
      io.observe(host);

      const onResize = () => {
        if (!host.clientWidth) return;
        renderer.setSize(host.clientWidth, host.clientHeight);
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(host);

      // Fade the canvas in once the first frame is on screen.
      renderer.domElement.style.opacity = "0";
      renderer.domElement.style.transition = "opacity 1.1s cubic-bezier(.16,1,.3,1)";

      let raf = 0;
      const clock = new THREE.Clock();
      let first = true;

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        const t = clock.getElapsedTime();

        current.x += (target.x - current.x) * 0.045;
        current.y += (target.y - current.y) * 0.045;

        group.rotation.y = Math.sin(t * 0.16) * 0.28 + current.x * 0.34;
        group.rotation.x = Math.cos(t * 0.13) * 0.13 - current.y * 0.22;
        group.position.y = Math.sin(t * 0.5) * 0.09;

        group.children.forEach((c, i) => {
          c.position.z += Math.sin(t * 0.7 + i * 1.4) * 0.0016;
        });

        dust.rotation.y = t * 0.02;
        accLight.position.x = Math.sin(t * 0.4) * 3;
        accLight.position.y = Math.cos(t * 0.32) * 2.6;

        renderer.render(scene, camera);
        if (first) {
          first = false;
          renderer.domElement.style.opacity = "1";
        }
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        io.disconnect();
        ro.disconnect();
        themeObserver.disconnect();
        geos.forEach((g) => g.dispose());
        dustGeo.dispose();
        dustMat.dispose();
        glass.dispose();
        accent.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [wide]);

  // No canvas on mobile / reduced-motion / WebGL failure — the CSS orb behind
  // it already carries the hero, so the layout never collapses.
  return <div ref={mount} aria-hidden="true" className={className} data-failed={failed || undefined} />;
}
