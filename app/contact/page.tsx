'use client';

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import Loader from "../../components/loader";
import Logo from "../../model/logo";
import { Center, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ✅ SAFE client-only hook (fixes hydration mismatch) */
function useIsMountedWidth() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

/* Particles */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 800;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0005;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#888" transparent opacity={0.6} />
    </points>
  );
}

/* Logo */
function MouseFollower({ width }: { width: number | null }) {
  const ref = useRef<THREE.Group>(null);

  const isMobile = width !== null && width < 768;
  const isDesktop = width !== null && width >= 768;

  const scale = useMemo(() => {
    if (width === null) return 1.4;
    if (width < 480) return 1.1;
    if (width < 768) return 1.4;
    return 1.25;
  }, [width]);

  useFrame(({ mouse, clock }) => {
    if (!ref.current) return;

    const t = clock.elapsedTime;

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -mouse.y * 0.25 + Math.sin(t * 0.6) * 0.05,
      0.06
    );

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      mouse.x * 0.25 + Math.cos(t * 0.5) * 0.05,
      0.06
    );

    const breathe = 1 + Math.sin(t * 1.2) * 0.03;

    ref.current.scale.set(scale * breathe, scale * breathe, scale * breathe);
  });

  return (
    <group
      ref={ref}
      position={
        isDesktop
          ? [0, 0.4, 0] // 👈 higher on desktop
          : isMobile
          ? [0, 0.25, 0] // 👈 ALSO higher on mobile (your request)
          : [0, 0, 0]
      }
    >
      <Center>
        <Logo />
      </Center>
    </group>
  );
}

export default function Home() {
  const width = useIsMountedWidth();

  // ✅ prevent SSR render mismatch flash
  if (width === null) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const isMobile = width < 768;

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-black" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-[600px] h-[600px] bg-purple-500 blur-[160px] rounded-full top-[-200px] left-[-200px]" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500 blur-[160px] rounded-full bottom-[-200px] right-[-200px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* WRAPPER */}
      <div className="relative w-full max-w-6xl px-4 flex flex-col items-center">

        {/* 3D */}
        <div
          className="relative w-full flex items-center justify-center pointer-events-none"
          style={{
            height: isMobile ? "40vh" : "52vh",
            marginBottom: isMobile ? "-40px" : "-110px",
          }}
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <pointLight position={[0, 3, 6]} intensity={1.5} />

              <Particles />
              <MouseFollower width={width} />

              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* FORM */}
        <div className="relative w-full max-w-md -mt-10 sm:-mt-6 p-4 sm:p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-3 sm:gap-4 z-10">

          <h2 className="text-xl sm:text-2xl font-semibold text-center tracking-wide">
            Get in Touch
          </h2>

          <input className="w-full p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Your Name" />
          <input className="w-full p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Your Email" />
          <textarea rows={3} className="w-full p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Your Message" />

          <button className="w-full py-2.5 sm:py-3 rounded-xl bg-white text-black font-semibold">
            Send Message
          </button>

        </div>
      </div>
    </section>
  );
}