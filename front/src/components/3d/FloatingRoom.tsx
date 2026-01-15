import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingRoomProps {
  mouseX: number
  mouseY: number
}

function GlassPanel({ position, rotation }: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <boxGeometry args={[2, 3, 0.05]} />
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.1}
        roughness={0.05}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function FloatingFurniture({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>
    </Float>
  )
}

function Particles({ count = 80 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [count])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#d4af37" transparent opacity={0.6} />
    </points>
  )
}

export default function FloatingRoom({ mouseX, mouseY }: FloatingRoomProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.3,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseY * 0.1,
        0.05
      )
    }
  })

  return (
    <group ref={groupRef}>
      {/* Glass panels representing room walls */}
      <GlassPanel position={[-2, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
      <GlassPanel position={[2, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />
      <GlassPanel position={[0, 0, -2]} rotation={[0, 0, 0]} />

      {/* Floating furniture elements */}
      <FloatingFurniture position={[-1, -1, 0.5]} color="#2a2a2a" />
      <FloatingFurniture position={[1, -0.8, 0]} color="#3a3a3a" />
      <FloatingFurniture position={[0, -1.2, -0.5]} color="#1a1a1a" />

      {/* Ambient particles */}
      <Particles count={80} />

      {/* Floor reflection plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Decorative spheres */}
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[1.5, 1, 1]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[-1.5, 0.5, 1.5]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.1} />
        </mesh>
      </Float>

      {/* Decorative torus */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh position={[0, 1.5, 0.5]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  )
}
