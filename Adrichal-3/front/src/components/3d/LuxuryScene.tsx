import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface LuxurySceneProps {
  mouseX: number
  mouseY: number
}

// Elegant floating frame
function FloatingFrame({ position, rotation, scale = 1 }: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}) {
  const frameRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (frameRef.current) {
      frameRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={frameRef} position={position} rotation={rotation} scale={scale}>
        {/* Frame border */}
        <mesh>
          <boxGeometry args={[1.8, 2.4, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Inner "artwork" */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.5, 2.1]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.5} roughness={0.8} />
        </mesh>
        {/* Gold accent line */}
        <mesh position={[0, -1.0, 0.06]}>
          <boxGeometry args={[1.2, 0.02, 0.01]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0} emissive="#d4af37" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

// Modern furniture piece
function ModernChair({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group position={position} rotation={[0, Math.PI / 6, 0]}>
        {/* Seat */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.08, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.35, -0.25]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.55, 0.6, 0.06]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
        </mesh>
        {/* Gold legs */}
        {[[-0.22, -0.25, 0.22], [0.22, -0.25, 0.22], [-0.22, -0.25, -0.22], [0.22, -0.25, -0.22]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.015, 0.015, 0.5]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Elegant lamp
function FloorLamp({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
      <group position={position}>
        {/* Base */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.05]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
        {/* Pole */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
        </mesh>
        {/* Shade */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.4, 32, 1, true]} />
          <meshStandardMaterial
            color="#111111"
            metalness={0.2}
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Light glow */}
        <pointLight position={[0, 0.5, 0]} intensity={0.5} color="#ffeedd" distance={3} />
      </group>
    </Float>
  )
}

// Decorative golden sphere
function GoldenSphere({ position, size = 0.15 }: { position: [number, number, number]; size?: number }) {
  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.6}>
      <mesh position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0}
          emissive="#d4af37"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  )
}

// Geometric accent
function GeometricAccent({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  )
}

// Floating particles with gold tones
function LuxuryParticles({ count = 60 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8

      // Gold tones
      const isGold = Math.random() > 0.3
      if (isGold) {
        colors[i * 3] = 0.83     // R
        colors[i * 3 + 1] = 0.69 // G
        colors[i * 3 + 2] = 0.22 // B
      } else {
        colors[i * 3] = 1
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 1
      }
    }
    return { positions, colors }
  }, [count])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[points.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Floor with reflection
function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#050505"
        metalness={0.95}
        roughness={0.05}
      />
    </mesh>
  )
}

export default function LuxuryScene({ mouseX, mouseY }: LuxurySceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.15,
        0.03
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseY * 0.05,
        0.03
      )
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main furniture arrangement */}
      <FloatingFrame position={[-2.5, 0.5, -1]} rotation={[0, 0.3, 0]} scale={0.8} />
      <FloatingFrame position={[2.5, 0.3, -0.5]} rotation={[0, -0.2, 0]} scale={0.6} />

      <ModernChair position={[-0.8, -1.2, 0.5]} />
      <FloorLamp position={[1.5, -0.5, 0.8]} />

      {/* Decorative elements */}
      <GoldenSphere position={[2, 1.2, 0.5]} size={0.12} />
      <GoldenSphere position={[-1.8, 1.5, 1]} size={0.08} />
      <GoldenSphere position={[0.5, 0.8, 1.5]} size={0.1} />

      <GeometricAccent position={[-2, 0, 1.5]} />
      <GeometricAccent position={[2.2, 1, 0]} />

      {/* Ambient particles */}
      <LuxuryParticles count={80} />

      {/* Floor */}
      <ReflectiveFloor />

      {/* Subtle accent lights */}
      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#d4af37" distance={8} />
      <pointLight position={[3, 1, 2]} intensity={0.2} color="#ffffff" distance={6} />
    </group>
  )
}
