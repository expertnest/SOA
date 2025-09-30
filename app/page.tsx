'use client'
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import Loader from '../components/loader'
import Logo from '../model/logo'
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
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        mouse.x * 0.2,
        0.05
      );
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        -mouse.y * 0.2,
        0.05
      );
    }
  });

  return (
    <group ref={ref}>
      <Center>
        <Logo />
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.2}
          color="#111111"
        />
      </Center>
    </group>
  );
}

export default function Home() {
  const width = useWindowWidth();
  const planeSize = width < 768 ? 5 : 8;

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
    <section 
      className="w-full h-screen sm:h-[70vh] md:h-screen relative bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#000000] overflow-hidden"
    >
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <Stars radius={80} depth={50} count={1500} factor={4} saturation={0.0} fade />

          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <directionalLight position={[-5, -5, 5]} intensity={1.0} />
          <pointLight position={[0, 5, 10]} intensity={1.5} />

          <mesh position={[0, 0, -2]}>
            <planeGeometry args={[planeSize, planeSize]} />
            <meshBasicMaterial color="#222222" transparent opacity={0.15} />
          </mesh>

          <MouseFollower />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>

      {/* Corner Navigation with Next.js Link */}
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
