'use client'

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import Loader from '../../components/loader'
import Logo from '../../model/logo'
import { Environment, Center, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Link from "next/link";

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

  useFrame(({ mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.2, 0.05);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -mouse.y * 0.2, 0.05);
    }
  });

  return (
    <group ref={ref} scale={[1.7, 1.7, 1.7]}> {/* slightly smaller logo */}
      <Center>
        <Logo />
      </Center>
    </group>
  );
}

export default function Home() {
  const width = useWindowWidth();

  const navItems = [
    { name: "Home", href: "/news" },
  ];

  const positions = [
    "top-6 left-6",
    "top-6 right-6",
    "bottom-6 left-6",
    "bottom-6 right-6"
  ];

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#000000] relative overflow-hidden">

      {/* 3D Logo Section */}
      <div className="w-full h-[60vh] relative">
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }}
        >
          <Suspense fallback={<Loader />}>
            <Stars radius={80} depth={50} count={1500} factor={4} saturation={0.0} fade />
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <pointLight position={[0, 5, 10]} intensity={1.5} />
            <MouseFollower />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-xl mt-6 p-4 bg-[#111111]/80 rounded-xl shadow-lg text-white flex flex-wrap gap-3 justify-between">
        <h2 className="w-full text-lg font-bold mb-3 text-center">Get in Touch</h2>
        <input
          type="text"
          placeholder="Your Name"
          className="flex-1 min-w-[120px] p-2 rounded bg-[#222] focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="flex-1 min-w-[120px] p-2 rounded bg-[#222] focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <textarea
          placeholder="Your Message"
          rows={2}
          className="w-full p-2 rounded bg-[#222] focus:outline-none focus:ring-2 focus:ring-gray-500"
        ></textarea>
        <button
          type="submit"
          className="w-full md:w-auto py-2 px-4 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
        >
          Send Message
        </button>
      </div>

      {/* Corner Navigation */}
      {navItems.map((item, idx) => (
        <Link 
          key={item.name}
          href={item.href}
          className={`absolute ${positions[idx]} text-white uppercase tracking-[0.2em] text-sm md:text-base font-bold cursor-pointer transition hover:text-gray-400`}
        >
          {item.name}
        </Link>
      ))}
    </section>
  );
}
