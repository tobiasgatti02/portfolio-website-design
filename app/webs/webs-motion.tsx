"use client"

import { useEffect } from "react"

export function WebsMotion() {
  useEffect(() => {
    const title = document.getElementById("webs-title")
    const solid = title?.querySelector<HTMLElement>("[data-title-solid]")
    const canvas = title?.querySelector<HTMLCanvasElement>("[data-title-particles]")
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!title || !solid || !canvas || motion.matches) return
    solid.style.opacity = "0"

    type Particle = { x: number; y: number; radius: number; delay: number; duration: number; opacity: number; accent: boolean }
    let particles: Particle[] = []
    let frame = 0
    let cancelled = false
    const start = performance.now()

    const makeParticles = () => {
      const box = canvas.getBoundingClientRect()
      const width = Math.ceil(box.width)
      const height = Math.ceil(box.height)
      if (!width || !height) return []

      const mask = document.createElement("canvas")
      mask.width = width
      mask.height = height
      const maskContext = mask.getContext("2d", { willReadFrequently: true })
      if (!maskContext) return []

      title.querySelectorAll<HTMLElement>("[data-title-line]").forEach((line) => {
        const rect = line.getBoundingClientRect()
        const style = getComputedStyle(line)
        const content = line.textContent ?? ""
        maskContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        maskContext.letterSpacing = style.letterSpacing
        maskContext.textBaseline = "alphabetic"
        maskContext.fillStyle = "#1b1b19"
        const metrics = maskContext.measureText(content)
        const fontSize = parseFloat(style.fontSize)
        const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent || fontSize
        const baseline = rect.top - box.top + (rect.height - fontHeight) / 2 + (metrics.fontBoundingBoxAscent || fontSize * .8)
        maskContext.fillText(content, rect.left - box.left, baseline)
      })

      const pixels = maskContext.getImageData(0, 0, width, height).data
      const period = solid.querySelector<HTMLElement>("[data-title-line] span")?.getBoundingClientRect()
      const periodLeft = period ? period.left - box.left : width + 1
      const periodTop = period ? period.top - box.top : height + 1
      const step = Math.max(2.2, Math.sqrt((width * height) / 10500))
      let seed = 81357
      const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) | 0
        return (seed >>> 0) / 4294967296
      }
      const dots: Particle[] = []
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const alpha = pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 3]
          if (alpha < 125 || random() < .09) continue
          dots.push({
            x: x + (random() - .5) * 1.2,
            y: y + (random() - .5) * 1.2,
            radius: Math.min(step * .43, .65 + random() * .85),
            delay: random() * 900,
            duration: 380 + random() * 350,
            opacity: .68 + random() * .32,
            accent: x >= periodLeft - 1 && y >= periodTop - 2,
          })
        }
      }

      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0)
      return dots
    }

    particles = makeParticles()
    const resize = new ResizeObserver(() => { particles = makeParticles() })
    resize.observe(title)

    const draw = (now: number) => {
      if (cancelled) return
      const elapsed = now - start
      const resolveProgress = Math.max(0, Math.min(1, (elapsed - 1150) / 1500))
      const resolved = resolveProgress * resolveProgress * (3 - 2 * resolveProgress)
      solid.style.opacity = String(resolved)
      const context = canvas.getContext("2d")
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        for (const particle of particles) {
          const fadeIn = Math.max(0, Math.min(1, (elapsed - particle.delay) / particle.duration))
          const alpha = fadeIn * (1 - resolved) * particle.opacity
          if (alpha <= 0) continue
          context.globalAlpha = alpha
          context.fillStyle = particle.accent ? "#a65338" : "#1b1b19"
          context.beginPath()
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          context.fill()
        }
        context.globalAlpha = 1
      }
      if (elapsed < 2650) frame = requestAnimationFrame(draw)
      else solid.style.opacity = "1"
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      solid.style.opacity = "1"
    }
  }, [])

  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLElement>("[data-project-hover]"))
    const disposers = links.map((link) => {
      const cursor = link.querySelector<HTMLElement>("[data-project-cursor]")
      if (!cursor) return () => {}
      let frame = 0
      let x = 0
      let y = 0
      let targetX = 0
      let targetY = 0
      let active = false
      const render = () => {
        x += (targetX - x) * .18
        y += (targetY - y) * .18
        cursor.style.setProperty("--cursor-x", `${x}px`)
        cursor.style.setProperty("--cursor-y", `${y}px`)
        if (active) frame = requestAnimationFrame(render)
      }
      const move = (event: PointerEvent) => {
        const rect = link.getBoundingClientRect()
        targetX = event.clientX - rect.left
        targetY = event.clientY - rect.top
        if (active) return
        x = targetX
        y = targetY
        active = true
        render()
      }
      const leave = () => { active = false; cancelAnimationFrame(frame) }
      link.addEventListener("pointerenter", move)
      link.addEventListener("pointermove", move)
      link.addEventListener("pointerleave", leave)
      return () => {
        leave()
        link.removeEventListener("pointerenter", move)
        link.removeEventListener("pointermove", move)
        link.removeEventListener("pointerleave", leave)
      }
    })
    return () => disposers.forEach((dispose) => dispose())
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]")
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"))
      return
    }
    document.documentElement.dataset.websMotion = "true"
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("is-visible")
        observer.unobserve(entry.target)
      })
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0.06 })
    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      delete document.documentElement.dataset.websMotion
    }
  }, [])
  return null
}
