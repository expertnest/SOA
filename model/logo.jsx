'use client'
import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { a } from '@react-spring/three'

const Logo = (props) => {
  const logoRef = useRef()
  const { nodes } = useGLTF('assets/3d/logo.glb')
  const [scale, setScale] = useState(15.535)

  // Update scale based on window width
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth
      if (width < 480) {
        setScale(13)         // small mobile
      } else if (width < 768) {
        setScale(13)        // tablet
      } else if (width < 1024) {
        setScale(13)        // small desktop
      } else {
        setScale(15.535)    // default large desktop
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <a.group ref={logoRef} {...props}>
      <mesh
        geometry={nodes.path1.geometry}
        position={[-0.423, 0.031, -0.018]}
        rotation={[Math.PI / 2, 0, 0]} 
        scale={scale}
      >
        <meshStandardMaterial
          color={'#c0c0c0'}
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>
    </a.group>
  )
}

export default Logo
