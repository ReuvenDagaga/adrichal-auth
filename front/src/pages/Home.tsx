import Hero from '../components/sections/Hero'
import ProjectsShowcase from '../components/sections/ProjectsShowcase'
import About from '../components/sections/About'
import Services from '../components/sections/Services'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <ProjectsShowcase />
      <About />
      <Services />
      <Contact />
    </main>
  )
}
