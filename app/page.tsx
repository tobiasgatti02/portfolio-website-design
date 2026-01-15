"use client"

import { useEffect, useRef, useState } from "react"
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateProgress = () => {
      const scrollLeft = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
      setScrollProgress(progress)
    }

    // Convert vertical scroll (wheel) to horizontal scroll
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // Use deltaY (vertical scroll) to scroll horizontally
      // Multiply for smoother/faster scrolling
      const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX
      container.scrollLeft += delta
      
      updateProgress()
    }

    // Initial progress
    updateProgress()

    container.addEventListener("wheel", handleWheel, { passive: false })
    
    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [])

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      {/* Progress indicator */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-border">
        <div className="h-full bg-accent transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Scroll hint */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-pulse text-sm text-muted-foreground">
        Scroll to navigate →
      </div>

      {/* Continuous horizontal scroll container */}
      <div ref={containerRef} className="horizontal-scroll flex h-full items-center">
        {/* Intro Section */}
        <section className="flex h-full min-w-[100vw] flex-col items-start justify-center px-16 md:px-24">
          <div className="max-w-4xl">
            <div className="mb-6 text-sm font-medium tracking-wider text-muted-foreground">
              FULL-STACK SOFTWARE ENGINEER
            </div>
            <h1 className="mb-6 text-balance text-6xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
              Tobias Gatti
            </h1>
            <p className="mb-8 max-w-2xl text-pretty text-xl leading-relaxed text-muted-foreground">
              Building production-ready digital experiences with Next.js, TypeScript, and PostgreSQL. Software Engineer.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                <a href="mailto:tobiasgatti02@gmail.com">Get in Touch</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground bg-transparent">
                <a href="https://github.com/tobiasgatti02" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-20">
            <div className="h-64 w-64 rounded-full bg-gradient-to-br from-accent to-accent/50 blur-3xl" />
          </div>
        </section>

        {/* Work Timeline Section */}
        <section className="flex h-full min-w-[80vw] items-center px-16 md:px-24">
          <div className="max-w-4xl">
            <div className="mb-4 text-sm font-medium tracking-wider text-accent">MY WORK</div>
            <h2 className="mb-8 text-balance text-5xl font-bold leading-tight md:text-6xl">
              14+ months crafting production-ready solutions
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

        {/* Tolio Project */}
        <section className="flex h-full min-w-[90vw] items-center px-16 md:px-24">
          <div className="relative max-w-5xl">
            <div className="mb-4 text-sm font-medium tracking-wider text-accent">LATEST PROJECT</div>
            <h2 className="mb-4 text-6xl font-bold leading-none md:text-7xl">Tolio</h2>
            <p className="mb-8 text-2xl text-muted-foreground">Shared Economy Marketplace Platform</p>

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
                <a
                  href="https://tolio.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lg font-medium underline underline-offset-4 hover:text-accent"
                >
                  Visit tolio.app
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="absolute -right-12 -top-12 -z-10 opacity-10">
              <div className="h-80 w-80 rounded-full bg-gradient-to-br from-accent to-accent/50 blur-3xl" />
            </div>
          </div>
        </section>

        {/* F1 Stats Project */}
        <section className="flex h-full min-w-[80vw] items-center px-16 md:px-24">
          <div className="max-w-5xl">
            <div className="mb-4 text-sm font-medium tracking-wider text-accent">DATA ANALYSIS</div>
            <h2 className="mb-4 text-5xl font-bold leading-none md:text-6xl">F1 Stats</h2>
            <p className="mb-8 text-xl text-muted-foreground">Formula 1 Telemetry Data Analysis Application</p>

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

        {/* Bodine Project */}
        <section className="flex h-full min-w-[80vw] items-center px-16 md:px-24">
          <div className="max-w-5xl">
            <div className="mb-4 text-sm font-medium tracking-wider text-accent">E-COMMERCE</div>
            <h2 className="mb-4 text-5xl font-bold leading-none md:text-6xl">Bodine</h2>
            <p className="mb-8 text-xl text-muted-foreground">Premium Wine E-commerce Platform</p>

            <div className="mb-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Full-featured e-commerce solution with cart and checkout</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Automated CI/CD pipeline for seamless deployments</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Responsive design system optimized for all devices</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>Secure payment integration and order management</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stack</h3>
                <div className="mb-6 flex flex-wrap gap-2">
                  {["Next.js", "Node.js", "TailwindCSS", "Vercel"].map((tech) => (
                    <span key={tech} className="border border-border bg-card px-4 py-2 text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href="https://bodine.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lg font-medium underline underline-offset-4 hover:text-accent"
                >
                  Visit bodine.vercel.app
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Gaming Projects Section */}
        <section className="flex h-full min-w-[80vw] items-center px-16 md:px-24">
          <div className="max-w-5xl">
            <div className="mb-4 text-sm font-medium tracking-wider text-accent">GAME DEVELOPMENT</div>
            <h2 className="mb-4 text-5xl font-bold leading-none md:text-6xl">Gaming Projects</h2>
            <p className="mb-8 text-xl text-muted-foreground">Java-based Game Development Portfolio</p>

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
        <section className="flex h-full min-w-[80vw] items-center px-16 md:px-24">
          <div className="max-w-5xl">
            <div className="mb-4 text-sm font-medium tracking-wider text-accent">FREELANCE</div>
            <h2 className="mb-4 text-5xl font-bold leading-none md:text-6xl">Student Platform</h2>
            <p className="mb-8 text-xl text-muted-foreground">Educational Web Platform Development</p>

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
        <section className="flex h-full min-w-[100vw] flex-col items-start justify-center px-16 md:px-24">
          <div className="max-w-4xl">
            <div className="mb-6 text-sm font-medium tracking-wider text-muted-foreground">LET&apos;S CONNECT</div>
            <h2 className="mb-8 text-balance text-6xl font-bold leading-tight tracking-tight md:text-7xl">
              Ready to build something great?
            </h2>
            <p className="mb-12 max-w-2xl text-pretty text-xl leading-relaxed text-muted-foreground">
              Open to new opportunities and collaborations. Based in Graz, Austria with EU citizenship.
            </p>

            <div className="mb-12 space-y-4">
              <a
                href="mailto:tobiasgatti02@gmail.com"
                className="group flex items-center gap-4 text-xl font-medium hover:text-accent"
              >
                <Mail className="h-6 w-6" />
                tobiasgatti02@gmail.com
              </a>
              <div className="flex items-center gap-4 text-xl font-medium text-muted-foreground">
                +54 9 291 644 6463
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background"
              >
                <a href="https://github.com/tobiasgatti02" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background"
              >
                <a href="https://www.linkedin.com/in/tobias-gatti-610a83170" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>

          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-20">
            <div className="h-80 w-80 rounded-full bg-gradient-to-br from-accent to-accent/50 blur-3xl" />
          </div>
        </section>
      </div>
    </main>
  )
}
