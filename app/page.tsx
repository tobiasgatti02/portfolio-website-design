"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowRight, Download, ExternalLink, Github, Linkedin, Mail } from "lucide-react"
import { SideB } from "@/components/side-b"

function ActionLink({ href, children, icon: Icon = ArrowRight, external = false, download = false }: {
  href: string
  children: React.ReactNode
  icon?: typeof ArrowRight
  external?: boolean
  download?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={download || undefined}
      className="action-link group"
    >
      <span className="action-link-label">{children}</span>
      <span className="action-link-icon"><Icon size={18} strokeWidth={1.8} /></span>
    </a>
  )
}

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [inVertical, setInVertical] = useState(false)
  const [sideBOpen, setSideBOpen] = useState(false)

  useEffect(() => {
    const openSecret = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (event.key.toLowerCase() !== "b" || event.altKey || event.ctrlKey || event.metaKey || target?.matches("input, textarea, [contenteditable='true']")) return
      setSideBOpen(true)
    }
    window.addEventListener("keydown", openSecret)
    return () => window.removeEventListener("keydown", openSecret)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateProgress = () => {
      const horizontalMax = Math.max(0, container.scrollWidth - container.clientWidth)
      const verticalMax = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const horizontalShare = 0.3
      const progress = horizontalMax > 0 ? container.scrollLeft / horizontalMax : 1
      setScrollProgress(Math.min(100, (progress * horizontalShare + (window.scrollY / (verticalMax || 1)) * (1 - horizontalShare)) * 100))
      setInVertical(window.scrollY > 4 || container.scrollLeft >= (educationRef.current?.offsetLeft ?? horizontalMax) - 4)
    }

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      const educationStart = educationRef.current?.offsetLeft ?? container.scrollWidth - container.clientWidth
      const atEducation = container.scrollLeft >= educationStart - 3
      if (window.scrollY > 0 || (atEducation && delta > 0)) return
      if (delta === 0) return
      e.preventDefault()
      container.scrollLeft = Math.min(educationStart, container.scrollLeft + delta)
      updateProgress()
    }

    let touchStartY = 0
    let touchStartScrollLeft = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartScrollLeft = container.scrollLeft
    }

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY
      const educationStart = educationRef.current?.offsetLeft ?? container.scrollWidth - container.clientWidth
      if (window.scrollY > 0 || (container.scrollLeft >= educationStart - 3 && deltaY > 0)) return
      if (Math.abs(deltaY) < 5) return
      e.preventDefault()
      container.scrollLeft = Math.min(educationStart, touchStartScrollLeft + deltaY)
      updateProgress()
    }

    updateProgress()
    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)
    
    return () => {
      container.removeEventListener("wheel", handleWheel)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("scroll", updateProgress)
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  return (
    <main className="w-full bg-background">
      <SideB open={sideBOpen} onClose={() => setSideBOpen(false)} />
      {/* Progress indicator */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-border">
        <div className="h-full bg-accent transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Scroll hint */}
      <div className="nav-hint fixed bottom-5 left-1/2 z-50 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.2em]">
        {inVertical ? <><ArrowDown size={14} /> Scroll to explore</> : <><ArrowRight size={14} /> Scroll to explore</>}
      </div>

      {/* Continuous horizontal scroll container */}
      <div ref={containerRef} className="horizontal-scroll flex h-svh items-center">
        {/* Intro Section */}
        <section className="intro-panel flex h-full min-w-[100vw] shrink-0 flex-col items-start justify-center px-6 md:px-24">
          <div className="max-w-4xl">
            <div className="mb-4 md:mb-6 text-xs md:text-sm font-medium tracking-wider text-muted-foreground">
              FULL-STACK SOFTWARE ENGINEER
            </div>
            <h1 className="mb-4 md:mb-6 text-balance text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
              Tobias Gatti
            </h1>
            <p className="mb-6 md:mb-8 max-w-2xl text-pretty text-base md:text-xl leading-relaxed text-muted-foreground">
              Building production-ready digital experiences. I love design and well-crafted things. 
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <ActionLink href="mailto:tobiasgatti02@gmail.com" icon={Mail}>Get in touch</ActionLink>
              <ActionLink href="https://github.com/tobiasgatti02" icon={Github} external>GitHub</ActionLink>
              <ActionLink href="/TobiasGatti_Cv.pdf" icon={Download} download>Download CV</ActionLink>
            </div>
          </div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
            <div className="h-64 w-64 rounded-full bg-gradient-to-br from-accent to-accent/50 blur-3xl" />
          </div>
        </section>

        {/* Work Timeline Section */}
        <section className="work-panel flex h-full min-w-[100vw] shrink-0 items-center px-6 md:px-24">
          <div className="max-w-4xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">MY WORK</div>
            <h2 className="mb-6 md:mb-8 text-balance text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              4 years crafting production-ready solutions
            </h2>
            <div className="space-y-8">
              <div className="border-l-2 border-accent pl-6">
                <div className="mb-2 text-sm font-medium text-muted-foreground">2024 - PRESENT</div>
                <h3 className="mb-3 text-2xl font-bold">Full-Stack Software Engineer</h3>
                <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                  Delivering high-impact features in fast-paced startup environments. Specializing in end-to-end
                  development from database architecture to user interfaces.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "PostgreSQL", "tRPC", "Node.js", "React"].map((tech) => (
                    <span key={tech} className="border border-border bg-card px-3 py-1 text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <ul className="space-y-3 pl-6 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="text-lg">Architected complete payment & discount systems with Stripe</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="text-lg">Optimized critical query performance by 40%</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="text-lg">Reduced support workload by 30% through proactive bug fixes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="text-lg">Delivered 15+ production features directly impacting revenue</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section ref={educationRef} className="flex h-full min-w-[100vw] items-center px-6 md:px-24">
          <div className="max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">EDUCATION</div>
            <h2 className="mb-6 md:mb-8 text-balance text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Engineering foundations with a global perspective
            </h2>

            <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
              <div className="border-l-2 border-accent pl-5 md:pl-6">
                <div className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">ARGENTINA</div>
                <h3 className="mb-2 text-xl md:text-2xl font-bold">Universidad Nacional del Sur</h3>
                <p className="mb-3 text-base md:text-lg font-medium">Systems Engineer</p>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                  Graduated with a strong foundation in software engineering, systems design, and problem solving.
                </p>
              </div>

              <div className="border-l-2 border-accent pl-5 md:pl-6">
                <div className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">AUSTRIA · 2026</div>
                <h3 className="mb-2 text-xl md:text-2xl font-bold">Universität Graz</h3>
                <p className="mb-3 text-base md:text-lg font-medium">International Coursework</p>
                <p className="mb-4 text-sm md:text-base leading-relaxed text-muted-foreground">
                  Advanced courses focused on intelligent systems and data-informed product development.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Machine Learning", "Product Intelligence"].map((course) => (
                    <span key={course} className="border border-border bg-card px-3 py-1 text-xs md:text-sm font-medium">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      <div className="vertical-story">
        {/* F4brica Project */}
        <section className="project-section fabrica-section">
          <div className="fabrica-content max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">01 / FEATURED PROJECT</div>
            <h2 className="mb-3 md:mb-4 text-4xl md:text-6xl lg:text-7xl font-bold leading-none">F4brica</h2>
            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-2xl">
              A virtual studio for architecture, built to bring projects and clients into the same space.
            </p>

            <div className="fabrica-details mb-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">The idea</h3>
                <p className="max-w-lg text-lg leading-relaxed">
                  From first presentation to final decision, architects can organize their work, share progress, and give clients a clearer way to experience each project.
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Inside the studio</h3>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Projects, deliverables, and pending work in one view</li>
                  <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />Interactive 3D models clients can explore</li>
                  <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />A shared space for feedback and decisions</li>
                </ul>
              </div>
            </div>

            <ActionLink href="https://f4brica.app" icon={ExternalLink} external>Explore f4brica.app</ActionLink>
          </div>
        </section>

        {/* Tolio Project */}
        <section className="project-section tolio-section">
          <div className="relative max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">02 / SELECTED PROJECT</div>
            <h2 className="mb-3 md:mb-4 text-4xl md:text-6xl lg:text-7xl font-bold leading-none">Tolio</h2>
            <p className="mb-6 md:mb-8 text-lg md:text-2xl text-muted-foreground">Shared Economy Marketplace Platform</p>

            <div className="mb-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Key Achievements
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Original lending platform.</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Native face recognition for secure identity verification</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Real-time WebSocket chat system for user communication</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Stripe escrow payment processing for secure transactions</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Technologies
                </h3>
                <div className="mb-6 flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "PostgreSQL", "Stripe", "WebSocket", "tRPC"].map((tech) => (
                    <span key={tech} className="border border-border bg-card px-4 py-2 text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
<ActionLink href="https://tolio.app" icon={ExternalLink} external>Explore tolio.app</ActionLink>
              </div>
            </div>

            <div className="absolute -right-12 -top-12 -z-10 opacity-10">
              <div className="h-80 w-80 rounded-full bg-gradient-to-br from-accent to-accent/50 blur-3xl" />
            </div>
          </div>
        </section>

        {/* F1 Stats Project */}
        <section className="project-section f1-section">
          <div className="max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">03 / DATA ANALYSIS</div>
            <h2 className="mb-3 md:mb-4 text-3xl md:text-5xl lg:text-6xl font-bold leading-none">F1 Stats</h2>
            <p className="mb-6 md:mb-8 text-base md:text-xl text-muted-foreground">Formula 1 Telemetry Data Analysis Application</p>

            <div className="mb-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Real-time Formula 1 telemetry data processing</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Advanced visualization components for data insights</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Driver performance analytics and comparisons</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Track conditions and weather impact analysis</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {["Python", "React", "NumPy", "Pandas", "Data Visualization"].map((tech) => (
                    <span key={tech} className="border border-border bg-card px-4 py-2 text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gaming Projects Section */}
        <section className="project-section gaming-section">
          <div className="max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">GAME DEVELOPMENT</div>
            <h2 className="mb-3 md:mb-4 text-3xl md:text-5xl lg:text-6xl font-bold leading-none">Gaming Projects</h2>
            <p className="mb-6 md:mb-8 text-base md:text-xl text-muted-foreground">Java-based Game Development Portfolio</p>

            <div className="space-y-8">
              <div className="border-l-2 border-accent pl-6">
                <h3 className="mb-3 text-2xl font-bold">Worcs</h3>
                <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                  Multiplayer strategy game featuring complex game mechanics, AI opponents, and real-time player
                  interactions built with Java.
                </p>
              </div>

              <div className="border-l-2 border-accent pl-6">
                <h3 className="mb-3 text-2xl font-bold">Snake++</h3>
                <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                  Enhanced version of the classic Snake game with modern features, power-ups, and advanced gameplay
                  mechanics implemented in Java.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Java", "OOP", "Game Logic", "Graphics", "Event Handling"].map((tech) => (
                    <span key={tech} className="border border-border bg-card px-4 py-2 text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -left-12 bottom-12 -z-10 opacity-10">
              <div className="h-64 w-64 rounded-full bg-gradient-to-br from-accent to-accent/50 blur-3xl" />
            </div>
          </div>
        </section>

        {/* Freelance Work Section */}
        <section className="project-section student-section">
          <div className="max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">FREELANCE</div>
            <h2 className="mb-3 md:mb-4 text-3xl md:text-5xl lg:text-6xl font-bold leading-none">Student Platform</h2>
            <p className="mb-6 md:mb-8 text-base md:text-xl text-muted-foreground">Educational Web Platform Development</p>

            <div className="mb-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Project</h3>
              <p className="mb-6 text-lg leading-relaxed">
                Developed a comprehensive web platform for educational institutions as a freelance project. The platform
                facilitates student-teacher interactions, course management, and resource sharing.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-lg">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>User authentication and role-based access control</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>Course content management system</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>Real-time notifications and messaging</span>
                </li>
                <li className="flex items-start gap-3 text-lg">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>Responsive design for mobile and desktop access</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stack</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "Express", "MongoDB", "WebSocket"].map((tech) => (
                  <span key={tech} className="border border-border bg-card px-4 py-2 text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="project-section contact-section flex-col items-start justify-center">
          <div className="max-w-4xl">
            <div className="mb-4 md:mb-6 text-xs md:text-sm font-medium tracking-wider text-muted-foreground">LET&apos;S CONNECT</div>
            <h2 className="mb-6 md:mb-8 text-balance text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Ready to build something great?
            </h2>
            <p className="mb-8 md:mb-12 max-w-2xl text-pretty text-base md:text-xl leading-relaxed text-muted-foreground">
              Open to new opportunities and collaborations. 
            </p>

            <div className="mb-12 space-y-4">
              <a href="mailto:tobiasgatti02@gmail.com" className="contact-email">
                <Mail className="h-5 w-5" /> tobiasgatti02@gmail.com <ArrowRight className="ml-auto h-5 w-5" />
              </a>
              <div className="flex items-center gap-4 text-xl font-medium text-muted-foreground">
                +54 9 291 644 6463
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <ActionLink href="/TobiasGatti_Cv.pdf" icon={Download} download>Download CV</ActionLink>
              <ActionLink href="https://github.com/tobiasgatti02" icon={Github} external>GitHub</ActionLink>
              <ActionLink href="https://www.linkedin.com/in/tobias-gatti-610a83170" icon={Linkedin} external>LinkedIn</ActionLink>
            </div>
            <button type="button" className="side-b-entrance" onClick={() => setSideBOpen(true)} aria-label="Abrir el espacio secreto Lado B">
              <span>¿LLEGASTE HASTA ACÁ?</span><span className="side-b-entrance-mark">A <span>/</span> B</span><span>TOCÁ EL LADO B <ArrowRight size={14} /></span>
            </button>
          </div>

          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-20">
            <div className="h-80 w-80 rounded-full bg-gradient-to-br from-accent to-accent/50 blur-3xl" />
          </div>
        </section>
      </div>
    </main>
  )
}
