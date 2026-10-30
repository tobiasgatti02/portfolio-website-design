import Link from "next/link"
import type { Locale } from "../locale"
import { LanguageSwitcher } from "../language-switcher"
import { WebsMotion } from "./webs-motion"
import styles from "./webs.module.css"

const copy = {
  es: {
    title: ["Espacios de", "creación"], meta: "DISEÑO Y DESARROLLO WEB", selection: "2026 — SELECCIÓN 01/03", selected: "PROYECTOS SELECCIONADOS", back: "Portfolio", homeLabel: "Tobias Gatti, volver al portfolio", visit: "Explorar sitio", visitLabel: "Visitar", newTab: "en una pestaña nueva", open: "Abrir web de", viewProject: "VER PROYECTO", explore: "EXPLORAR", enter: "ENTRAR AL ESTUDIO", architecture: "ESTUDIO DE ARQUITECTURA", photography: "ESTUDIO FOTOGRÁFICO", photoLocation: "ESTUDIO FOTOGRÁFICO · BUENOS AIRES", projectsLabel: "Proyectos web seleccionados", rhythm: "RITMO", gaze: "MIRADA", calm: "CALMA", aquaLine: <>Una forma más <em>simple</em><br />de habitar.</>, solerLine: "Espacios que respiran.", jutLine: <>Hay cosas que <em>se sienten.</em></>, nextIdea: <>La próxima<br /><em>idea.</em></>, contact: "HABLEMOS DE LA TUYA", contactLabel: "Escribirme por email para crear una web", footer: "DISEÑO Y CÓDIGO POR TOBIAS GATTI · 2026", top: "VOLVER ARRIBA ↑", mailSubject: "Hagamos una web",
    projects: [
      { kind: "Arquitectura · Interiores", summary: "Un estudio de arquitectura con galería de dos paneles que responden al scroll." },
      { kind: "Arquitectura · Editorial", summary: "Una mirada editorial a la arquitectura, con un motivo inspirado en el calçadão de Copacabana." },
      { kind: "Fotografía · Sesiones", summary: "Un estudio fotográfico con reels al pasar el cursor y galerías para cada sesión." },
    ],
    images: ["Interior cálido abierto hacia un jardín", "Casa contemporánea entre árboles", "Retrato en claroscuro con luz cálida"],
  },
  en: {
    title: ["Spaces for", "creation"], meta: "WEB DESIGN & DEVELOPMENT", selection: "2026 — SELECTION 01/03", selected: "SELECTED PROJECTS", back: "Portfolio", homeLabel: "Tobias Gatti, back to portfolio", visit: "Explore site", visitLabel: "Visit", newTab: "in a new tab", open: "Open", viewProject: "VIEW PROJECT", explore: "EXPLORE", enter: "ENTER THE STUDIO", architecture: "ARCHITECTURE STUDIO", photography: "PHOTO STUDIO", photoLocation: "PHOTO STUDIO · BUENOS AIRES", projectsLabel: "Selected web projects", rhythm: "RHYTHM", gaze: "VISION", calm: "CALM", aquaLine: <>A <em>simpler</em> way<br />to live.</>, solerLine: "Spaces that breathe.", jutLine: <>Some things are <em>felt.</em></>, nextIdea: <>The next<br /><em>idea.</em></>, contact: "LET’S TALK ABOUT YOURS", contactLabel: "Email me about a website", footer: "DESIGN & CODE BY TOBIAS GATTI · 2026", top: "BACK TO TOP ↑", mailSubject: "Let’s make a website",
    projects: [
      { kind: "Architecture · Interiors", summary: "An architecture studio with a two-panel gallery that responds to scroll." },
      { kind: "Architecture · Editorial", summary: "An editorial view of architecture, with a motif inspired by Copacabana’s calçadão." },
      { kind: "Photography · Sessions", summary: "A photography studio with hover reels and galleries for each session." },
    ],
    images: ["Warm interior opening onto a garden", "Contemporary house among trees", "Portrait in warm chiaroscuro light"],
  },
} as const

const projectLinks = [
  { number: "01", name: "Aqua", url: "https://estudio-aqua.vercel.app" },
  { number: "02", name: "Soler", url: "https://estudio-soler.vercel.app" },
  { number: "03", name: "Jut", url: "https://jut-studio.vercel.app" },
] as const

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className={styles.arrow}>{diagonal ? "↗" : "↓"}</span>
}

function ProjectFooter({ project, locale }: { project: (typeof projectLinks)[number] & { kind: string; summary: string }; locale: Locale }) {
  const t = copy[locale]
  return <div className={styles.projectFooter}>
    <div className={styles.projectDetails}>
      <div className={styles.projectIdentity}><span className={styles.projectNumber}>{project.number} / 03</span><h2>{project.name}<span className={styles.period}>.</span></h2><span className={styles.projectKind}>{project.kind}</span></div>
      <p className={styles.projectSummary}>{project.summary}</p>
    </div>
    <a className={styles.visit} href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.visitLabel} ${project.name} ${t.newTab}`}><span>{t.visit}</span><Arrow diagonal /></a>
  </div>
}

export default function WebsPage({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const projects = projectLinks.map((project, index) => ({ ...project, ...t.projects[index] }))
  const pageSchema = {
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": `https://www.tobiasgatti.com/webs/${locale}#collection`,
    name: t.title.join(" "), description: locale === "es" ? "Tres experiencias web conceptuales de arquitectura y fotografía diseñadas por Tobias Gatti." : "Three conceptual web experiences for architecture and photography designed by Tobias Gatti.",
    url: `https://www.tobiasgatti.com/webs/${locale}`, inLanguage: locale,
    author: { "@type": "Person", name: "Tobias Gatti", url: "https://www.tobiasgatti.com" },
    mainEntity: { "@type": "ItemList", itemListElement: projects.map((project, index) => ({ "@type": "ListItem", position: index + 1, name: project.name, description: project.summary, url: project.url })) },
  }
  return <main className={styles.page} id="top" lang={locale}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema).replace(/</g, "\\u003c") }} />
    <noscript><style>{"[data-title-solid]{opacity:1!important}"}</style></noscript>
    <WebsMotion />
    <header className={styles.header}>
      <Link className={styles.brand} href={`/${locale}`} aria-label={t.homeLabel}><span>T</span><span>G</span></Link>
      <span className={styles.headerCenter}>TOBIAS GATTI</span>
      <div className={styles.headerActions}><LanguageSwitcher locale={locale} base="/webs" className={styles.languages} /><Link className={styles.headerBack} href={`/${locale}`}>{t.back} <Arrow diagonal /></Link></div>
    </header>

    <section className={styles.intro} aria-labelledby="webs-title">
      <div className={styles.introMeta}><span>{t.meta}</span><span>{t.selection}</span></div>
      <div className={styles.introMain}>
        <h1 id="webs-title" className={styles.title}>
          <span className={styles.titleSolid} data-title-solid><span className={styles.titleLine} data-title-line>{t.title[0]}</span><span className={styles.titleLine} data-title-line>{t.title[1]}<span className={styles.period}>.</span></span></span>
          <canvas className={styles.titleParticles} data-title-particles aria-hidden="true" />
        </h1>
      </div>
    </section>

    <section id="proyectos" className={styles.projects} aria-label={t.projectsLabel}>
      <div className={styles.sectionHead}><span>{t.selected}</span><span>01 — 03</span></div>

      <article className={styles.project} id="aqua" data-reveal>
        <div className={styles.projectTop}><span>01 / {t.calm}</span><span>BUENOS AIRES, AR</span></div>
        <a className={styles.aquaVisual} data-project-hover href={projects[0].url} target="_blank" rel="noopener noreferrer" aria-label={`${t.open} Estudio Aqua`}>
          <div className={styles.aquaWords}><span>{t.architecture}</span><strong>aqua<span>.</span></strong><p>{t.aquaLine}</p><span className={styles.visualCue}>{t.viewProject} <Arrow diagonal /></span></div>
          <div className={styles.aquaImage}><img src="/webs/estudio-aqua.webp" alt={t.images[0]} width="1800" height="1201" /></div>
          <span className={`${styles.hoverTitle} ${styles.hoverAqua}`} data-project-cursor aria-hidden="true">aqua<span>.</span></span>
        </a>
        <ProjectFooter project={projects[0]} locale={locale} />
      </article>

      <article className={styles.project} id="soler" data-reveal>
        <div className={styles.projectTop}><span>02 / {t.rhythm}</span><span>{locale === "es" ? "ARQUITECTURA" : "ARCHITECTURE"}</span></div>
        <a className={styles.solerVisual} data-project-hover href={projects[1].url} target="_blank" rel="noopener noreferrer" aria-label={`${t.open} Estudio Soler`}>
          <div className={styles.solerPattern} aria-hidden="true" />
          <div className={styles.solerWords}><span>{t.architecture}</span><strong>SOLER<span>.</span></strong><p>{t.solerLine}</p></div>
          <div className={styles.solerImage}><img src="/webs/soler-casa.jpg" alt={t.images[1]} width="1800" height="2250" /></div>
          <span className={styles.solerCue}>{t.explore} <Arrow diagonal /></span>
          <span className={`${styles.hoverTitle} ${styles.hoverSoler}`} data-project-cursor aria-hidden="true">SOLER<span>.</span></span>
        </a>
        <ProjectFooter project={projects[1]} locale={locale} />
      </article>

      <article className={styles.project} id="jut" data-reveal>
        <div className={styles.projectTop}><span>03 / {t.gaze}</span><span>{t.photography}</span></div>
        <a className={styles.jutVisual} data-project-hover href={projects[2].url} target="_blank" rel="noopener noreferrer" aria-label={`${t.open} Jut Studio`}>
          <div className={styles.jutImage}><img src="/webs/jut-retrato.webp" alt={t.images[2]} width="2000" height="3000" /></div>
          <div className={styles.jutShade} />
          <div className={styles.jutWords}><span>{t.photoLocation}</span><strong>jut<span>.</span></strong><p>{t.jutLine}</p></div>
          <span className={styles.jutCue}>{t.enter} <Arrow diagonal /></span>
          <span className={`${styles.hoverTitle} ${styles.hoverJut}`} data-project-cursor aria-hidden="true">jut<span>.</span></span>
        </a>
        <ProjectFooter project={projects[2]} locale={locale} />
      </article>
    </section>

    <footer className={styles.footer} data-reveal>
      <div className={styles.footerMain}>
        <div className={styles.footerTitle}>
          <span>03 / 03</span>
          <p>{t.nextIdea}</p>
        </div>
        <a className={styles.footerMail} href={`mailto:tobiasgatti02@gmail.com?subject=${encodeURIComponent(t.mailSubject)}`} aria-label={t.contactLabel}>
          <span>{t.contact}</span><span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className={styles.footerBottom}>
        <Link href={`/${locale}`}>TG. / PORTFOLIO</Link>
        <span>{t.footer}</span>
        <a href="#top">{t.top}</a>
      </div>
    </footer>
  </main>
}
