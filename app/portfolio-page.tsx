"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowRight, Download, ExternalLink, Github, Linkedin, Mail } from "lucide-react"
import { SideB } from "@/components/side-b"
import { LanguageSwitcher } from "./language-switcher"
import type { Locale } from "./locale"

const copy = {
  es: {
    scroll: "Deslizá para explorar", role: "PRODUCT ENGINEER · FULL STACK E IA APLICADA", intro: "Construyo productos de punta a punta, del problema del cliente a producción. Me apasionan el diseño y las cosas bien hechas.", contact: "Escribime", cv: "Descargar CV",
    work: "MI TRABAJO", workTitle: "3 años llevando productos a producción", current: "NOV 2024 - ACTUALIDAD", job: "Software Engineer · Firmaway", jobBody: "Fintech para fundadores de fuera de EE. UU. que crean y operan su empresa allá. Trabajo con Producto y Diseño, del descubrimiento a producción.",
    achievements: ["Desarrollé de punta a punta el lanzamiento de Firmaway Capital: estimador de rendimientos con datos de Alpaca, onboarding, dashboard y alertas", "Construí el asistente interno de conocimiento: RAG con búsqueda híbrida, citas verificables y evals con revisión humana", "Responsable de Balancito, el producto de contabilidad con IA, del problema del cliente a producción", "Sumé observabilidad que redujo un 25 % los incidentes en producción"],
    education: "FORMACIÓN", educationTitle: "Bases de ingeniería con perspectiva internacional", degree: "Ingeniero en Sistemas", degreeBody: "Me formé en ingeniería de software, diseño de sistemas y resolución de problemas.", coursework: "Especialización en Machine Learning", courseworkBody: "Machine learning aplicado a economía y negocios, y desarrollo de productos basado en datos.",
    featured: "PROYECTO DESTACADO", selected: "PROYECTO SELECCIONADO", fabricaLead: "Un estudio virtual para arquitectura que acerca los proyectos a sus clientes. Lo diseño y desarrollo de punta a punta.", idea: "La idea", fabricaIdea: "Desde la primera presentación hasta la decisión final, los arquitectos pueden organizar su trabajo, compartir avances y darles a sus clientes una forma más clara de vivir cada proyecto.", inside: "Dentro del estudio", fabricaList: ["Modelos 3D navegables en el navegador con Three.js", "Entregas versionadas y comentarios anclados en el modelo", "Acceso de clientes por enlace privado, revocable y con vencimiento", "Más de 20 entrevistas con arquitectos para definir el producto"], explore: "Explorar",
    ai: "IA APLICADA · FIRMAWAY", ragTitle: "Asistente de conocimiento", ragLead: "Herramienta interna que responde preguntas sobre producto, procesos y datos de prueba con evidencia que se puede revisar.", ragHow: "Cómo funciona", ragList: ["Búsqueda híbrida: BM25 y embeddings combinados por fusión de rankings, con reranking opcional", "Ingesta de PDFs, escaneos y tablas con modelos de visión, citando página y documento", "Responde solo con evidencia: cita obligatoria y abstención cuando no hay soporte", "Consola de evals con revisión humana y medición de uso y costo por etapa", "Genera escenarios de prueba en Dev y TEST con permisos mínimos sobre la base"],
    tolioLead: "Plataforma de economía colaborativa", achievementsTitle: "Logros", tolioList: ["Plataforma original de préstamos entre personas.", "Reconocimiento facial nativo para verificar identidades", "Chat en tiempo real con WebSockets", "Pagos seguros con depósito en garantía mediante Stripe"], technologies: "Tecnologías", stack: "TECNOLOGÍAS",
    more: "MÁS TRABAJO", moreTitle: "Otros proyectos", moreLead: "Herramientas y sitios para clientes y problemas reales.", monitorBody: "Panel diario para estudios jurídicos: novedades judiciales, plazos, clientes y seguimientos, con automatización del PJN.", fsshBody: "Reservas de lavarropas compartidos para una residencia de estudiantes en Alemania.", studentTitle: "Plataforma educativa", studentBody: "Proyecto independiente: gestión académica y cursos online para un instituto, con Next.js, Node.js y PostgreSQL.", websTitle: "Sitios web", websBody: "Sitios diseñados y desarrollados para estudios, marcas y profesionales.", seeWebs: "Ver sitios",
    connect: "HABLEMOS", contactTitle: "¿Creamos algo juntos?", contactBody: "Estoy abierto a nuevas oportunidades remotas y colaboraciones.", secretLabel: "Abrir el espacio secreto Lado B", secretIntro: "¿LLEGASTE HASTA ACÁ?", secretAction: "TOCÁ EL LADO B",
  },
  en: {
    scroll: "Scroll to explore", role: "PRODUCT ENGINEER · FULL STACK & APPLIED AI", intro: "I build products end to end, from the customer problem to production. I love design and well-crafted things.", contact: "Get in touch", cv: "Download CV",
    work: "MY WORK", workTitle: "3 years shipping products to production", current: "NOV 2024 - PRESENT", job: "Software Engineer · Firmaway", jobBody: "Fintech for founders outside the US who launch and run a US company. I work with Product and Design from discovery to production.",
    achievements: ["Built the Firmaway Capital release end to end: Alpaca-backed earnings estimator, onboarding, dashboard and alerts", "Built the internal knowledge assistant: RAG with hybrid retrieval, verifiable citations and human-reviewed evals", "Own Balancito, the AI-powered accounting product, from customer problem to production", "Introduced observability that cut production incidents by 25%"],
    education: "EDUCATION", educationTitle: "Engineering foundations with a global perspective", degree: "Systems Engineer", degreeBody: "Graduated with a strong foundation in software engineering, systems design, and problem solving.", coursework: "Machine Learning Specialization", courseworkBody: "Machine learning for economics and business, and data-informed product development.",
    featured: "FEATURED PROJECT", selected: "SELECTED PROJECT", fabricaLead: "A virtual studio for architecture, built to bring projects and clients into the same space. I design and build it end to end.", idea: "The idea", fabricaIdea: "From first presentation to final decision, architects can organize their work, share progress, and give clients a clearer way to experience each project.", inside: "Inside the studio", fabricaList: ["Navigable 3D models in the browser with Three.js", "Versioned deliverables and comments pinned to the model", "Client access through private, revocable, expiring links", "20+ interviews with architects to shape the product"], explore: "Explore",
    ai: "APPLIED AI · FIRMAWAY", ragTitle: "Knowledge Assistant", ragLead: "Internal tool that answers questions about product, processes and test data with evidence you can inspect.", ragHow: "How it works", ragList: ["Hybrid retrieval: BM25 and embeddings merged with rank fusion, optional reranking", "PDF, scan and table ingestion with vision models, citing document and page", "Evidence-only answers: required citations and abstention when support is missing", "Evals console with human review, plus per-stage usage and cost tracing", "Generates test scenarios in Dev and TEST with least-privilege database access"],
    tolioLead: "Shared Economy Marketplace Platform", achievementsTitle: "Key Achievements", tolioList: ["Original lending platform.", "Native face recognition for secure identity verification", "Real-time WebSocket chat system for user communication", "Stripe escrow payment processing for secure transactions"], technologies: "Technologies", stack: "STACK",
    more: "MORE WORK", moreTitle: "Other projects", moreLead: "Tools and sites for clients and real problems.", monitorBody: "Daily dashboard for Argentine law firms: court updates, deadlines, clients and follow-ups, with PJN automation.", fsshBody: "Shared laundry scheduling for a student residence in Germany.", studentTitle: "Educational platform", studentBody: "Freelance project: academic management and online courses for an institute, built with Next.js, Node.js and PostgreSQL.", websTitle: "Websites", websBody: "Sites designed and built for studios, brands and professionals.", seeWebs: "See websites",
    connect: "LET’S CONNECT", contactTitle: "Ready to build something great?", contactBody: "Open to new remote opportunities and collaborations.", secretLabel: "Open the secret Side B space", secretIntro: "MADE IT THIS FAR?", secretAction: "EXPLORE SIDE B",
  },
} as const

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

export default function Portfolio({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const containerRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLElement>(null)
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

    const updateScrollState = () => {
      const horizontalMax = Math.max(0, container.scrollWidth - container.clientWidth)
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
      updateScrollState()
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
      updateScrollState()
    }

    updateScrollState()
    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    
    return () => {
      container.removeEventListener("wheel", handleWheel)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [])

  return (
    <main className="w-full bg-background" lang={locale}>
      <SideB open={sideBOpen} onClose={() => setSideBOpen(false)} locale={locale} />
      <LanguageSwitcher locale={locale} base="" className="portfolio-language-switcher" />
      {/* Scroll hint */}
      <div className="nav-hint fixed bottom-5 left-1/2 z-50 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.2em]">
        {inVertical ? <><ArrowDown size={14} /> {t.scroll}</> : <><ArrowRight size={14} /> {t.scroll}</>}
      </div>

      {/* Continuous horizontal scroll container */}
      <div ref={containerRef} className="horizontal-scroll flex h-svh items-center">
        {/* Intro Section */}
        <section className="intro-panel flex h-full min-w-[100vw] shrink-0 flex-col items-start justify-center px-6 md:px-24">
          <div className="max-w-4xl">
            <div className="mb-4 md:mb-6 text-xs md:text-sm font-medium tracking-wider text-muted-foreground">
              {t.role}
            </div>
            <h1 className="mb-4 md:mb-6 text-balance text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
              Tobias Gatti
            </h1>
            <p className="mb-6 md:mb-8 max-w-2xl text-pretty text-base md:text-xl leading-relaxed text-muted-foreground">
              {t.intro}
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <ActionLink href="mailto:tobiasgatti02@gmail.com" icon={Mail}> {t.contact}</ActionLink>
              <ActionLink href={`/webs/${locale}`}>Webs</ActionLink>
              <ActionLink href="https://github.com/tobiasgatti02" icon={Github} external>GitHub</ActionLink>
              <ActionLink href="/TobiasGatti_Cv.pdf" icon={Download} download> {t.cv}</ActionLink>
            </div>
          </div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
            <div className="h-64 w-64 rounded-full bg-gradient-to-br from-accent to-accent/50 blur-3xl" />
          </div>
        </section>

        {/* Work Timeline Section */}
        <section className="work-panel flex h-full min-w-[100vw] shrink-0 items-center px-6 md:px-24">
          <div className="max-w-4xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent"> {t.work}</div>
            <h2 className="mb-6 md:mb-8 text-balance text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t.workTitle}
            </h2>
            <div className="space-y-8">
              <div className="border-l-2 border-accent pl-6">
                <div className="mb-2 text-sm font-medium text-muted-foreground"> {t.current}</div>
                <h3 className="mb-3 text-2xl font-bold"> {t.job}</h3>
                <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                  {t.jobBody}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "PostgreSQL", "tRPC", "Cloudflare Workers AI", "RAG"].map((tech) => (
                    <span key={tech} className="border border-border bg-card px-3 py-1 text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <ul className="space-y-3 pl-6 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="work-achievement">{t.achievements[0]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="work-achievement">{t.achievements[1]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="work-achievement">{t.achievements[2]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span className="work-achievement">{t.achievements[3]}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section ref={educationRef} className="flex h-full min-w-[100vw] items-center px-6 md:px-24">
          <div className="max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent"> {t.education}</div>
            <h2 className="mb-6 md:mb-8 text-balance text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t.educationTitle}
            </h2>

            <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
              <div className="border-l-2 border-accent pl-5 md:pl-6">
                <div className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">ARGENTINA</div>
                <h3 className="mb-2 text-xl md:text-2xl font-bold">Universidad Nacional del Sur</h3>
                <p className="mb-3 text-base md:text-lg font-medium"> {t.degree}</p>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                  {t.degreeBody}
                </p>
              </div>

              <div className="border-l-2 border-accent pl-5 md:pl-6">
                <div className="mb-2 text-xs md:text-sm font-medium text-muted-foreground">AUSTRIA · 2026</div>
                <h3 className="mb-2 text-xl md:text-2xl font-bold">Universität Graz</h3>
                <p className="mb-3 text-base md:text-lg font-medium"> {t.coursework}</p>
                <p className="mb-4 text-sm md:text-base leading-relaxed text-muted-foreground">
                  {t.courseworkBody}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Machine Learning", "Economics", "Product Intelligence"].map((course) => (
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
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">01 / {t.featured}</div>
            <h2 className="mb-3 md:mb-4 text-4xl md:text-6xl lg:text-7xl font-bold leading-none">F4brica</h2>
            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-2xl">
              {t.fabricaLead}
            </p>

            <div className="fabrica-details mb-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"> {t.idea}</h3>
                <p className="max-w-lg text-lg leading-relaxed">
                  {t.fabricaIdea}
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"> {t.inside}</h3>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t.fabricaList[0]}</li>
                  <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t.fabricaList[1]}</li>
                  <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t.fabricaList[2]}</li>
                  <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t.fabricaList[3]}</li>
                </ul>
              </div>
            </div>

            <ActionLink href="https://f4brica.app" icon={ExternalLink} external> {t.explore} f4brica.app</ActionLink>
          </div>
        </section>

        {/* Knowledge Assistant */}
        <section className="project-section knowledge-section">
          <div className="max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">02 / {t.ai}</div>
            <h2 className="mb-3 md:mb-4 text-4xl md:text-6xl lg:text-7xl font-bold leading-none">{t.ragTitle}</h2>
            <p className="mb-6 md:mb-8 max-w-3xl text-lg md:text-2xl text-muted-foreground">{t.ragLead}</p>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t.ragHow}</h3>
                <ul className="space-y-3">
                  {t.ragList.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-lg">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t.stack}</h3>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "Cloudflare Workers AI", "Vectorize", "D1 · FTS5", "PostgreSQL", "Evals"].map((tech) => (
                    <span key={tech} className="border border-border bg-card px-4 py-2 text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tolio Project */}
        <section className="project-section tolio-section">
          <div className="relative max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">03 / {t.selected}</div>
            <h2 className="mb-3 md:mb-4 text-4xl md:text-6xl lg:text-7xl font-bold leading-none">Tolio</h2>
            <p className="mb-6 md:mb-8 text-lg md:text-2xl text-muted-foreground"> {t.tolioLead}</p>

            <div className="mb-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.achievementsTitle}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>{t.tolioList[0]}</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>{t.tolioList[1]}</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>{t.tolioList[2]}</span>
                  </li>
                  <li className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span>{t.tolioList[3]}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.technologies}
                </h3>
                <div className="mb-6 flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "PostgreSQL", "Stripe", "WebSocket", "tRPC"].map((tech) => (
                    <span key={tech} className="border border-border bg-card px-4 py-2 text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
<ActionLink href="https://tolio.app" icon={ExternalLink} external> {t.explore} tolio.app</ActionLink>
              </div>
            </div>

            <div className="absolute -right-12 -top-12 -z-10 opacity-10">
              <div className="h-80 w-80 rounded-full bg-gradient-to-br from-accent to-accent/50 blur-3xl" />
            </div>
          </div>
        </section>

        {/* More Work Section */}
        <section className="project-section more-section">
          <div className="max-w-5xl">
            <div className="mb-3 md:mb-4 text-xs md:text-sm font-medium tracking-wider text-accent">04 / {t.more}</div>
            <h2 className="mb-3 md:mb-4 text-3xl md:text-5xl lg:text-6xl font-bold leading-none">{t.moreTitle}</h2>
            <p className="mb-8 md:mb-10 text-base md:text-xl text-muted-foreground">{t.moreLead}</p>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="border-l-2 border-accent pl-6">
                <h3 className="mb-2 text-2xl font-bold">Monitor Legal</h3>
                <p className="mb-4 text-lg leading-relaxed text-muted-foreground">{t.monitorBody}</p>
                <ActionLink href="https://github.com/tobiasgatti02/monitor-legal" icon={Github} external>GitHub</ActionLink>
              </div>
              <div className="border-l-2 border-accent pl-6">
                <h3 className="mb-2 text-2xl font-bold">{t.websTitle}</h3>
                <p className="mb-4 text-lg leading-relaxed text-muted-foreground">{t.websBody}</p>
                <ActionLink href={`/webs/${locale}`}>{t.seeWebs}</ActionLink>
              </div>
              <div className="border-l-2 border-accent pl-6">
                <h3 className="mb-2 text-2xl font-bold">FSSH Laundry</h3>
                <p className="mb-4 text-lg leading-relaxed text-muted-foreground">{t.fsshBody}</p>
                <ActionLink href="https://github.com/tobiasgatti02/fssh" icon={Github} external>GitHub</ActionLink>
              </div>
              <div className="border-l-2 border-accent pl-6">
                <h3 className="mb-2 text-2xl font-bold">{t.studentTitle}</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">{t.studentBody}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="project-section contact-section flex-col items-start justify-center">
          <div className="max-w-4xl">
            <div className="mb-4 md:mb-6 text-xs md:text-sm font-medium tracking-wider text-muted-foreground"> {t.connect}</div>
            <h2 className="mb-6 md:mb-8 text-balance text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              {t.contactTitle}
            </h2>
            <p className="mb-8 md:mb-12 max-w-2xl text-pretty text-base md:text-xl leading-relaxed text-muted-foreground">
              {t.contactBody}
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
              <ActionLink href="/TobiasGatti_Cv.pdf" icon={Download} download> {t.cv}</ActionLink>
              <ActionLink href="https://github.com/tobiasgatti02" icon={Github} external>GitHub</ActionLink>
              <ActionLink href="https://www.linkedin.com/in/tobias-gatti-610a83170" icon={Linkedin} external>LinkedIn</ActionLink>
            </div>
            <button type="button" className="side-b-entrance" onClick={() => setSideBOpen(true)} aria-label={t.secretLabel}>
              <span>{t.secretIntro}</span><span className="side-b-entrance-mark">A <span>/</span> B</span><span>{t.secretAction} <ArrowRight size={14} /></span>
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
