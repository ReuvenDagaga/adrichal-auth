import { Suspense, useEffect, useState, useCallback } from 'react'
import { easing } from 'maath'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useEnvironment, Sky } from '@react-three/drei'
import { EffectComposer, Selection, Select, Outline } from '@react-three/postprocessing'
import { debounce } from 'lodash-es'

// Items data - names and descriptions only
const ITEMS: Record<string, { name: string; description: string }> = {
  KNOXHULT: { name: 'Kitchen', description: 'Complete System' },
  BRÖNDEN: { name: 'Carpet', description: 'Premium Quality' },
  SKAFTET: { name: 'Lamp', description: 'Designer Piece' },
  FANBYN: { name: 'Chairs', description: 'Modern Set' },
  VOXLÖV: { name: 'Table', description: 'Dining Collection' },
  LIVSVERK: { name: 'Vase', description: 'Decorative' },
}

// Item description overlay - shows item info
function ItemOverlay({ hovered }: { hovered: string | null }) {
  const info = hovered ? ITEMS[hovered] : null

  return (
    <div
      className="absolute inset-0 flex items-start justify-end pointer-events-none z-10"
      style={{ paddingTop: '15%', paddingRight: '8%' }}
    >
      <div className="text-center select-none">
        {info ? (
          <>
            {/* Item name */}
            <div
              className="font-light leading-none"
              style={{
                fontSize: 'clamp(60px, 12vw, 180px)',
                color: 'rgba(255, 255, 255, 0.6)',
                textShadow: '0 0 80px rgba(255, 255, 255, 0.2)',
                letterSpacing: '0.02em',
              }}
            >
              {info.name}
            </div>
            {/* Item description */}
            <div
              className="font-light tracking-[0.3em] uppercase"
              style={{
                fontSize: 'clamp(14px, 2vw, 24px)',
                color: 'rgba(201, 162, 39, 0.8)',
                marginTop: '10px',
                transition: 'opacity 0.4s ease',
              }}
            >
              {info.description}
            </div>
          </>
        ) : (
          <div
            className="font-light tracking-[0.3em] uppercase"
            style={{
              fontSize: 'clamp(16px, 2.5vw, 28px)',
              color: 'rgba(255, 255, 255, 0.4)',
              textShadow: '0 0 60px rgba(255, 255, 255, 0.15)',
            }}
          >
            Hover to explore
          </div>
        )}
      </div>
    </div>
  )
}

// Kitchen Scene Component with hover interactions
function KitchenModel({ onHover, hovered }: { onHover: (name: string | null) => void; hovered: string | null }) {
  const { nodes, materials } = useGLTF('/kitchen-transformed.glb') as any
  const env = useEnvironment({ preset: 'city' })

  const debouncedHover = useCallback(debounce(onHover, 80), [onHover])

  const over = (name: string) => (e: any) => {
    e.stopPropagation()
    debouncedHover(name)
  }

  const out = () => debouncedHover(null)

  return (
    <group>
      {/* Static elements */}
      {nodes.vase1 && <mesh geometry={nodes.vase1.geometry} material={materials.gray} material-envMap={env} />}
      {nodes.bottle && <mesh geometry={nodes.bottle.geometry} material={materials.gray} material-envMap={env} />}
      {nodes.walls_1 && <mesh geometry={nodes.walls_1.geometry} material={materials.floor} />}
      {nodes.walls_2 && <mesh geometry={nodes.walls_2.geometry} material={materials.walls} />}
      {nodes.plant_1 && <mesh geometry={nodes.plant_1.geometry} material={materials.potted_plant_01_leaves} />}
      {nodes.plant_2 && <mesh geometry={nodes.plant_2.geometry} material={materials.potted_plant_01_pot} />}
      {nodes.cuttingboard && <mesh geometry={nodes.cuttingboard.geometry} material={materials.walls} />}
      {nodes.bowl && <mesh geometry={nodes.bowl.geometry} material={materials.walls} />}
      {nodes.kitchen && <mesh geometry={nodes.kitchen.geometry} material={materials.walls} />}
      {nodes.sink && <mesh geometry={nodes.sink.geometry} material={materials.chrome} material-envMap={env} />}

      {/* Interactive: Carpet */}
      <Select enabled={hovered === 'BRÖNDEN'}>
        {nodes.carpet && (
          <mesh
            geometry={nodes.carpet.geometry}
            material={materials.carpet}
            onPointerOver={over('BRÖNDEN')}
            onPointerOut={out}
          />
        )}
      </Select>

      {/* Interactive: Table */}
      <Select enabled={hovered === 'VOXLÖV'}>
        {nodes.table && (
          <mesh
            geometry={nodes.table.geometry}
            material={materials.walls}
            material-envMap={env}
            material-envMapIntensity={0.5}
            onPointerOver={over('VOXLÖV')}
            onPointerOut={out}
          />
        )}
      </Select>

      {/* Interactive: Chairs */}
      <Select enabled={hovered === 'FANBYN'}>
        <group onPointerOver={over('FANBYN')} onPointerOut={out}>
          {nodes.chairs_1 && <mesh geometry={nodes.chairs_1.geometry} material={materials.walls} />}
          {nodes.chairs_2 && (
            <mesh geometry={nodes.chairs_2.geometry} material={materials.plastic} material-color="#1a1a1a" material-envMap={env} />
          )}
        </group>
      </Select>

      {/* Interactive: Vase */}
      <Select enabled={hovered === 'LIVSVERK'}>
        {nodes.vase && (
          <mesh
            geometry={nodes.vase.geometry}
            material={materials.gray}
            material-envMap={env}
            onPointerOver={over('LIVSVERK')}
            onPointerOut={out}
          />
        )}
      </Select>

      {/* Interactive: Lamp */}
      <Select enabled={hovered === 'SKAFTET'}>
        <group onPointerOver={over('SKAFTET')} onPointerOut={out}>
          {nodes.lamp_socket && <mesh geometry={nodes.lamp_socket.geometry} material={materials.gray} material-envMap={env} />}
          {nodes.lamp && <mesh geometry={nodes.lamp.geometry} material={materials.gray} />}
          {nodes.lamp_cord && <mesh geometry={nodes.lamp_cord.geometry} material={materials.gray} material-envMap={env} />}
        </group>
      </Select>
    </group>
  )
}

// Camera controller - zoomed in more on furniture, slower movement
function CameraController() {
  useFrame((state, delta) => {
    // Slower, smoother camera movement
    easing.damp3(
      state.camera.position,
      [
        state.pointer.x * 0.5,
        0.8 + state.pointer.y * 0.2,
        5 + Math.atan(state.pointer.x * 2) * 0.2
      ],
      0.15, // Slower damping for smoother movement
      delta
    )
    state.camera.lookAt(state.camera.position.x * 0.5, -0.2, -4)
  })

  return null
}

// Effects component with Outline
function Effects() {
  return (
    <EffectComposer multisampling={8} autoClear={false}>
      <Outline
        visibleEdgeColor={0xffffff}
        hiddenEdgeColor={0xffffff}
        blur
        edgeStrength={2.5}
        pulseSpeed={0}
        xRay={false}
      />
    </EffectComposer>
  )
}

// Loader component
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#080808]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border border-gold/30 border-t-gold rounded-full animate-spin" />
        <span className="text-gold/50 text-xs tracking-[0.3em] uppercase">Loading Experience</span>
      </div>
    </div>
  )
}

// Check if device is mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Scene content
function SceneContent({ hovered, onHover }: { hovered: string | null; onHover: (name: string | null) => void }) {
  return (
    <>
      <CameraController />

      {/* Sky background */}
      <Sky sunPosition={[100, 20, 100]} />

      {/* Lighting */}
      <ambientLight intensity={1.5 * Math.PI} />

      {/* Selection wrapper for outline effect */}
      <Selection>
        <Effects />

        {/* Kitchen model - adjusted position for better framing */}
        <group rotation={[0, Math.PI / 2, 0]} position={[0, -0.8, -1]}>
          <KitchenModel onHover={onHover} hovered={hovered} />
        </group>
      </Selection>
    </>
  )
}

// Main HeroScene component
export default function HeroScene() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleHover = useCallback((name: string | null) => {
    setHovered(name)
    document.body.style.cursor = name ? 'pointer' : 'auto'
  }, [])

  if (!mounted) {
    return <Loader />
  }

  return (
    <div className="absolute inset-0 z-0">
      {/* Fixed position item overlay */}
      <ItemOverlay hovered={hovered} />

      {/* Vignette overlay - subtle blur/darkening at edges */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `
            radial-gradient(
              ellipse 85% 75% at 50% 50%,
              transparent 0%,
              transparent 50%,
              rgba(0, 0, 0, 0.15) 75%,
              rgba(0, 0, 0, 0.4) 100%
            )
          `,
        }}
      />

      {/* Soft blur frame at edges */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          boxShadow: 'inset 0 0 150px 50px rgba(0, 0, 0, 0.3)',
        }}
      />

      <Canvas
        flat
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: !isMobile, powerPreference: isMobile ? 'low-power' : 'high-performance' }}
        camera={{ position: [0, 0.8, 5], fov: 30, near: 0.1, far: 50 }}
      >
        <Suspense fallback={null}>
          <SceneContent hovered={hovered} onHover={handleHover} />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Preload the model
useGLTF.preload('/kitchen-transformed.glb')
