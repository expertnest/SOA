'use client';

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import Loader from '../../components/loader';
import Logo from '../../model/logo';
import { Center, Environment } from '@react-three/drei';
import * as THREE from 'three';

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

function MouseFollower() {
  const ref = useRef<THREE.Group>(null);
  const width = useWindowWidth();

  const scale = useMemo(() => (width < 768 ? 1.8 : 1.5), [width]);

  useFrame(({ mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.2, 0.05);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -mouse.y * 0.2, 0.05);
    }
  });

  return (
    <group ref={ref} scale={[scale, scale, scale]}>
      <Center>
        <Logo />
      </Center>
    </group>
  );
}

export default function Home() {
  const width = useWindowWidth();

  const logoHeight = width < 768 ? '50vh' : '60vh';

  return (
    <section className="w-full flex flex-col items-center justify-start bg-black relative overflow-hidden min-h-screen">

      {/* 3D Logo Section */}
      <div
        className="w-full relative"
        style={{ height: logoHeight }}
      >
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }}
        >
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <pointLight position={[0, 5, 10]} intensity={1.5} />
            <MouseFollower />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>

      {/* Minimal Black Contact Form */}
      <div className="w-full max-w-md sm:max-w-[90%] mt-8 p-6 bg-black border border-gray-800 rounded-xl shadow-lg text-white flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">Get in Touch</h2>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 rounded-lg bg-black border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 rounded-lg bg-black border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <textarea
          placeholder="Your Message"
          rows={4}
          className="w-full p-3 rounded-lg bg-black border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <button
          type="submit"
          className="w-full py-3 bg-black border border-gray-700 rounded-lg text-white font-semibold hover:bg-gray-900 transition"
        >
          Send Message
        </button>
      </div>

    </section>
  );
}
