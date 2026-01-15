import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface RoomPreviewProps {
  style?: 'modern' | 'classic' | 'minimalist'
}

// Elegant floating artwork
function Artwork({ position, size = [1, 1.4] }: { position: [number, number, number]; size?: [number, number] }) {
  return (
    <group position={position}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[size[0] + 0.1, size[1] + 0.1, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Canvas */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.3} roughness={0.8} />
      </mesh>
      {/* Gold accent */}
      <mesh position={[0, -size[1] / 2 + 0.1, 0.035]}>
        <boxGeometry args={[size[0] * 0.6, 0.015, 0.01]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0} emissive="#d4af37" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

// Modern sofa
function Sofa({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base/Seat */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2, 0.4, 0.9]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.6, -0.35]}>
        <boxGeometry args={[2, 0.5, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.95, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.9]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0.95, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.9]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Gold legs */}
      {[[-0.8, 0.05, 0.3], [0.8, 0.05, 0.3], [-0.8, 0.05, -0.3], [0.8, 0.05, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
        </mesh>
      ))}
      {/* Cushions */}
      <mesh position={[-0.5, 0.55, 0.05]}>
        <boxGeometry args={[0.5, 0.2, 0.4]} />
        <meshStandardMaterial color="#252525" metalness={0} roughness={1} />
      </mesh>
      <mesh position={[0.5, 0.55, 0.05]}>
        <boxGeometry args={[0.5, 0.2, 0.4]} />
        <meshStandardMaterial color="#252525" metalness={0} roughness={1} />
      </mesh>
    </group>
  )
}

// Coffee table
function CoffeeTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tabletop - glass effect */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1, 0.03, 0.5]} />
        <meshPhysicalMaterial
          color="#111111"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Gold frame */}
      <mesh position={[0, 0.33, 0]}>
        <boxGeometry args={[1.05, 0.01, 0.55]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
      </mesh>
      {/* Legs */}
      {[[-0.45, 0.17, 0.2], [0.45, 0.17, 0.2], [-0.45, 0.17, -0.2], [0.45, 0.17, -0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.03, 0.34, 0.03]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
        </mesh>
      ))}
      {/* Decorative object on table */}
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.1}>
        <mesh position={[0.2, 0.45, 0]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0} emissive="#d4af37" emissiveIntensity={0.15} />
        </mesh>
      </Float>
    </group>
  )
}

// Elegant floor lamp
function StandingLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.04]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.5]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 0.35, 32, 1, true]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.1}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner glow */}
      <pointLight position={[0, 1.3, 0]} intensity={0.4} color="#ffeedd" distance={2.5} />
    </group>
  )
}

// Plant decoration
function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Gold rim */}
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[0.12, 0.01, 8, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
      </mesh>
      {/* Plant stems */}
      {[0, 0.5, 1, 1.5, 2].map((angle, i) => (
        <mesh key={i} position={[Math.sin(angle) * 0.05, 0.4 + i * 0.05, Math.cos(angle) * 0.05]} rotation={[0.1 * Math.sin(angle), 0, 0.1 * Math.cos(angle)]}>
          <cylinderGeometry args={[0.005, 0.008, 0.3 + i * 0.05]} />
          <meshStandardMaterial color="#2d4a2d" metalness={0} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// Room walls and floor
function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 2, -3]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-4, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  )
}

// Floating gold particles
function GoldParticles({ count = 30 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6
      positions[i * 3 + 1] = Math.random() * 3 + 0.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return positions
  }, [count])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#d4af37"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function RoomPreview({ style: _style = 'modern' }: RoomPreviewProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle constant rotation for visual interest
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05 - 0.3
    }
  })

  return (
    <group ref={groupRef}>
      <Room />

      {/* Furniture arrangement */}
      <Sofa position={[0, 0, 0.5]} />
      <CoffeeTable position={[0, 0, 1.8]} />
      <StandingLamp position={[-1.8, 0, 0]} />
      <StandingLamp position={[1.8, 0, 0]} />

      {/* Artwork on back wall */}
      <Artwork position={[0, 2, -2.95]} size={[1.2, 1.6]} />
      <Artwork position={[-2, 1.8, -2.95]} size={[0.6, 0.8]} />
      <Artwork position={[2, 1.8, -2.95]} size={[0.6, 0.8]} />

      {/* Plants */}
      <Plant position={[-2.5, 0, 1.5]} />
      <Plant position={[2.5, 0, 1.5]} />

      {/* Floating particles */}
      <GoldParticles count={40} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={0.4} color="#ffffff" />
      <spotLight position={[0, 4, 2]} intensity={0.6} color="#ffeedd" angle={0.4} penumbra={0.5} />
      <pointLight position={[-3, 2, 0]} intensity={0.2} color="#d4af37" distance={5} />
      <pointLight position={[3, 2, 0]} intensity={0.2} color="#d4af37" distance={5} />
    </group>
  )
}
