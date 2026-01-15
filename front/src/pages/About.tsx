import { useRef, useState, Suspense } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingShapesProps {
  mousePosition: { x: number; y: number }
}

function FloatingShapes({ mousePosition }: FloatingShapesProps) {
  const meshRef1 = useRef<THREE.Mesh>(null)
  const meshRef2 = useRef<THREE.Mesh>(null)
  const meshRef3 = useRef<THREE.Mesh>(null)
  const meshRef4 = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef1.current) {
      meshRef1.current.rotation.x += 0.005
      meshRef1.current.rotation.y += 0.005
      meshRef1.current.position.x = -5 + mousePosition.x * 0.5
      meshRef1.current.position.y = 1.5 + mousePosition.y * 0.5
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x += 0.003
      meshRef2.current.rotation.y += 0.007
      meshRef2.current.position.x = 5 - mousePosition.x * 0.3
      meshRef2.current.position.y = -1.5 - mousePosition.y * 0.3
    }
    if (meshRef3.current) {
      meshRef3.current.rotation.x += 0.004
      meshRef3.current.rotation.z += 0.006
      meshRef3.current.position.x = -4.5 + mousePosition.x * 0.2
      meshRef3.current.position.y = -2 + mousePosition.y * 0.2
    }
    if (meshRef4.current) {
      meshRef4.current.rotation.y += 0.006
      meshRef4.current.rotation.z += 0.004
      meshRef4.current.position.x = 4.5 - mousePosition.x * 0.4
      meshRef4.current.position.y = 2 - mousePosition.y * 0.4
    }
  })

  return (
    <>
      {/* Left top - white icosahedron */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef1} position={[-5, 1.5, -2]}>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0.1}
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>

      {/* Right bottom - gold octahedron */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh ref={meshRef2} position={[5, -1.5, -1]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>

      {/* Left bottom - dark torus knot */}
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={meshRef3} position={[-4.5, -2, -1.5]}>
          <torusKnotGeometry args={[0.35, 0.12, 64, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      {/* Right top - gold ring/torus */}
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.4}>
        <mesh ref={meshRef4} position={[4.5, 2, -1]}>
          <torusGeometry args={[0.5, 0.15, 16, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.05} />
        </mesh>
      </Float>
    </>
  )
}

const team = [
  {
    name: 'Avigail',
    role: 'Founder & CEO',
    image: '/avigail.png',
    bio: 'Visionary leader with a passion for transforming spaces into works of art.',
    isFounder: true,
  },
  {
    name: 'Ron',
    role: 'Senior Designer',
    image: '/ron.png',
    bio: 'Creative mind specialized in modern luxury aesthetics.',
    isFounder: false,
  },
  {
    name: 'Shilat',
    role: 'Project Manager',
    image: '/shilat.png',
    bio: 'Expert in bringing complex projects to life on time and on budget.',
    isFounder: false,
  },
  {
    name: 'Yotam',
    role: 'Design Consultant',
    image: '/yotam.png',
    bio: 'Bringing fresh perspectives and cutting-edge design solutions.',
    isFounder: false,
  },
]

const values = [
  {
    title: 'Excellence',
    description: 'We pursue perfection in every detail, creating spaces that exceed expectations.',
  },
  {
    title: 'Innovation',
    description: 'Pushing boundaries while respecting timeless design principles.',
  },
  {
    title: 'Collaboration',
    description: 'Working closely with clients to bring their unique vision to life.',
  },
  {
    title: 'Sustainability',
    description: 'Committed to environmentally conscious design practices.',
  },
]

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseNearCenter, setIsMouseNearCenter] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMousePosition({ x, y })

    // Check if mouse is near center (within 30% of center)
    const distanceFromCenter = Math.sqrt(x * x + y * y)
    setIsMouseNearCenter(distanceFromCenter < 0.6)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div
        ref={heroRef}
        className="relative h-screen overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/team.png"
            alt="Team"
            className={`w-full h-full object-cover transition-all duration-700 ${
              isMouseNearCenter ? 'grayscale-0 opacity-70 brightness-110' : 'grayscale opacity-50 brightness-90'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a0a0a]" />
        </div>

        {/* 3D Elements */}
        <div className="absolute inset-0 z-[1] opacity-60">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 5, 5]} intensity={0.5} />
              <FloatingShapes mousePosition={mousePosition} />
              <Environment preset="city" />
            </Canvas>
          </Suspense>
        </div>

        <div className="relative z-10 h-full flex items-end pb-32">
          <div className="container mx-auto px-8 md:px-12 lg:px-20 xl:px-28">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="max-w-3xl"
            >
              <p className="text-gold text-sm tracking-[0.4em] uppercase mb-6">About Us</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8">
                We Create Spaces
                <br />
                <span className="italic font-extralight">That Tell Stories</span>
              </h1>
              <p className="text-gray-400 text-xl leading-relaxed">
                Founded with a passion for transforming spaces, Adrichal Interior Design
                has become synonymous with luxury, innovation, and timeless elegance.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-white/50 text-xs tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
      {/* Story Section */}
      <section className="py-28 md:py-36 lg:py-44 relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-8 md:px-12 lg:px-20 xl:px-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div style={{ y }}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                  alt="Our Studio"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-4 border border-gold/30 pointer-events-none" />
              </div>
            </motion.div>

            <div>
              <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
                A Decade of
                <br />
                <span className="italic font-extralight">Design Excellence</span>
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  What began as a small studio with big dreams has evolved into one of
                  Israel's most respected interior design firms. Our journey has been
                  defined by a relentless pursuit of excellence and a deep commitment
                  to our clients' visions.
                </p>
                <p>
                  Every project we undertake is an opportunity to create something
                  extraordinary. We believe that great design should not only be
                  beautiful but should enhance the way people live, work, and feel
                  in their spaces.
                </p>
                <p>
                  Our approach combines innovative thinking with timeless principles,
                  resulting in interiors that are both contemporary and enduring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-28 md:py-36 lg:py-44 bg-black relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[180px] pointer-events-none" />

        <div className="container mx-auto px-8 md:px-12 lg:px-20 xl:px-28 relative z-10">
          <div className="text-center mb-20">
            <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Our Values</p>
            <h2 className="text-4xl md:text-5xl font-light text-white">
              What Drives Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 border border-white/10 hover:border-gold/50 transition-colors duration-500"
              >
                <span className="text-gold text-4xl font-light mb-4 block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-light text-white mb-4">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-28 md:py-36 lg:py-44 relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gold/4 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-gold/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-8 md:px-12 lg:px-20 xl:px-28 relative z-10">
          <div className="text-center mb-20">
            <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">Our Team</p>
            <h2 className="text-4xl md:text-5xl font-light text-white">
              Meet the Experts
            </h2>
          </div>

          {/* Founder Card - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="group relative max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-white/5 to-transparent border border-gold/20 p-8 md:p-12">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={team[0].image}
                    alt={team[0].name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-12 h-[2px] bg-gold mb-3" />
                  </div>
                </div>
                <div className="space-y-4">
                  <span className="text-gold text-xs tracking-[0.3em] uppercase">Founder & CEO</span>
                  <h3 className="text-3xl md:text-4xl font-light text-white">{team[0].name}</h3>
                  <p className="text-gray-400 leading-relaxed">{team[0].bio}</p>
                  <div className="pt-4 flex gap-4">
                    <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300 cursor-pointer">
                      <span className="text-xs">in</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative corner */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gold/50" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gold/50" />
            </div>
          </motion.div>

          {/* Team Members Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.slice(1).map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-gold/40 transition-all duration-500 overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="w-8 h-[1px] bg-gold mb-3 group-hover:w-12 transition-all duration-500" />
                      <h3 className="text-lg font-light text-white mb-1">{member.name}</h3>
                      <p className="text-gold text-xs tracking-wider uppercase">{member.role}</p>
                    </div>
                  </div>

                  {/* Bio on hover */}
                  <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="text-center">
                      <h3 className="text-xl font-light text-white mb-2">{member.name}</h3>
                      <p className="text-gold text-xs tracking-wider uppercase mb-4">{member.role}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
