"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Camera, CirclePause, CirclePlay, Plus, X } from "lucide-react"
import { SideBScene, type CameraFocus, type SideBObject } from "@/components/side-b-scene"
import type { Locale } from "@/app/locale"

type JournalEntry = { id: string; title: string; body: string; createdAt: string; updatedAt: string }
const STORAGE_KEY = "tobias-gatti-side-b-journal-v1"

const copy = {
  es: { labels: { music: "Vinilo", journal: "Journal", camera: "Cámara" }, wordmark: "LADO B", archive: "ARCHIVO PERSONAL · 001", close: "Cerrar Lado B", out: "FUERA DE PROGRAMA", side: "El lado", objects: "Objetos del Lado B", pause: "Pausar", spin: "Girar", open: "Abrir", touch: "TOCÁ LOS OBJETOS PARA EXPLORAR", view: "VISTA DESDE EL LENTE", table: "FIG. 01 — MESA DE IDEAS", dragZoom: "ARRASTRÁ PARA MIRAR · SCROLL PARA ZOOM", touchDrag: "TOCÁ / ARRASTRÁ", controls: "Controles de la cámara", exit: "SALIR", items: "VINILO · JOURNAL · CÁMARA", spinning: "● GIRANDO A 33⅓ RPM", paused: "○ PAUSADO", spinRecord: "Girar el disco", scratch: "Arrastrá el vinilo para hacer scratch.", write: "Abrir y escribir", savedHere: "Tus notas quedan en este navegador.", leaveLens: "Salir del lente", lens: "Mirar por el lente", cameraHelp: "Arrastrá para mirar. Scroll para acercarte.", myJournal: "MI JOURNAL", newEntry: "Nueva entrada", untitled: "Sin título", saveError: "No se pudo guardar en este navegador", saved: "Guardado en este navegador", notes: "NOTAS", closeAction: "Cerrar", entryTitle: "Título de la entrada", title: "Título", entryBody: "Texto de la entrada", start: "Empezá a escribir...", unsaved: "SIN GUARDAR", autosaved: "GUARDADO AUTOMÁTICO", back: "VOLVER AL PORTFOLIO", room: "UNA PEQUEÑA HABITACIÓN SECRETA." },
  en: { labels: { music: "Record", journal: "Journal", camera: "Camera" }, wordmark: "SIDE B", archive: "PERSONAL ARCHIVE · 001", close: "Close Side B", out: "OFF SCRIPT", side: "Side", objects: "Side B objects", pause: "Pause", spin: "Spin", open: "Open", touch: "TOUCH THE OBJECTS TO EXPLORE", view: "THROUGH THE LENS", table: "FIG. 01 — IDEAS TABLE", dragZoom: "DRAG TO LOOK · SCROLL TO ZOOM", touchDrag: "TOUCH / DRAG", controls: "Camera controls", exit: "EXIT", items: "RECORD · JOURNAL · CAMERA", spinning: "● SPINNING AT 33⅓ RPM", paused: "○ PAUSED", spinRecord: "Spin the record", scratch: "Drag the record to scratch.", write: "Open and write", savedHere: "Your notes stay in this browser.", leaveLens: "Leave the lens", lens: "Look through the lens", cameraHelp: "Drag to look. Scroll to zoom.", myJournal: "MY JOURNAL", newEntry: "New entry", untitled: "Untitled", saveError: "Could not save in this browser", saved: "Saved in this browser", notes: "NOTES", closeAction: "Close", entryTitle: "Entry title", title: "Title", entryBody: "Entry text", start: "Start writing...", unsaved: "NOT SAVED", autosaved: "SAVED AUTOMATICALLY", back: "BACK TO PORTFOLIO", room: "A SMALL SECRET ROOM." },
} as const

export function SideB({ open, onClose, locale }: { open: boolean; onClose: () => void; locale: Locale }) {
  const t = copy[locale]
  const labels: Record<SideBObject, string> = t.labels
  const [selected, setSelected] = useState<SideBObject>("music")
  const [playing, setPlaying] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const [cameraMode, setCameraMode] = useState(false)
  const [cameraFocus, setCameraFocus] = useState<CameraFocus>("journal")
  const [journalOpen, setJournalOpen] = useState(false)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
  const [journalReady, setJournalReady] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const journalOpenRef = useRef(journalOpen)
  const cameraModeRef = useRef(cameraMode)

  useEffect(() => { journalOpenRef.current = journalOpen }, [journalOpen])
  useEffect(() => { cameraModeRef.current = cameraMode }, [cameraMode])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: unknown = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((entry): entry is JournalEntry =>
            entry && typeof entry.id === "string" && typeof entry.title === "string" && typeof entry.body === "string" && typeof entry.createdAt === "string" && typeof entry.updatedAt === "string"
          )
          setEntries(valid)
          setActiveEntryId(valid[0]?.id ?? null)
        }
      }
    } catch {
      setStorageError(true)
    }
    setJournalReady(true)
  }, [])

  useEffect(() => {
    if (!journalReady) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [entries, journalReady])

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement as HTMLElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (journalOpenRef.current) { setJournalOpen(false); setBookOpen(false) }
        else if (cameraModeRef.current) setCameraMode(false)
        else onClose()
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, input, textarea, a[href]')).filter((element) => element.getClientRects().length > 0)
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [open, onClose])

  const createEntry = () => {
    const now = new Date().toISOString()
    const entry: JournalEntry = { id: crypto.randomUUID(), title: "", body: "", createdAt: now, updatedAt: now }
    setEntries((current) => [entry, ...current])
    setActiveEntryId(entry.id)
  }

  const openJournal = () => {
    setSelected("journal")
    setBookOpen(true)
    setCameraMode(false)
    setJournalOpen(true)
    if (!activeEntryId) createEntry()
  }

  const closeJournal = () => { setJournalOpen(false); setBookOpen(false) }

  const selectObject = (object: SideBObject) => {
    if (object === "music") {
      setSelected("music")
      setPlaying((current) => !current)
      return
    }
    if (object === "journal") { openJournal(); return }
    setSelected("camera")
    setBookOpen(false)
    setJournalOpen(false)
    setCameraMode(true)
  }

  const updateEntry = (field: "title" | "body", value: string) => {
    if (!activeEntryId) return
    const updatedAt = new Date().toISOString()
    setEntries((current) => current.map((entry) => entry.id === activeEntryId ? { ...entry, [field]: value, updatedAt } : entry))
  }

  if (!open) return null
  const activeEntry = entries.find((entry) => entry.id === activeEntryId)

  return (
    <div className="side-b-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={dialogRef} className="side-b" role="dialog" aria-modal="true" aria-labelledby="side-b-title">
        <header className="side-b-header">
          <span className="side-b-wordmark">TOBIAS GATTI <span>/</span> {t.wordmark}</span>
          <span className="side-b-header-center"> {t.archive}</span>
          <button ref={closeRef} className="side-b-close" onClick={onClose} type="button" aria-label={t.close}><X size={19} /></button>
        </header>

        <div className="side-b-main">
          <div className="side-b-intro">
            <span className="side-b-eyebrow"> {t.out} <span>●</span> 001</span>
            <h2 id="side-b-title"> {t.side} <em>B.</em></h2>
            <div className="side-b-index" role="group" aria-label={t.objects}>
              {(["music", "journal", "camera"] as SideBObject[]).map((object, index) => (
                <button key={object} type="button" className={`side-b-index-item ${selected === object ? "is-active" : ""}`} onClick={() => selectObject(object)} aria-label={`${object === "music" ? playing ? t.pause : t.spin : t.open} ${labels[object]}`}>
                  <span>0{index + 1}</span>{labels[object]}<ArrowRight size={15} />
                </button>
              ))}
            </div>
            <span className="side-b-intro-foot"> {t.touch}</span>
          </div>

          <div className="side-b-stage">
            <div className="side-b-stage-top"><span>{cameraMode ? t.view : t.table}</span><span>{cameraMode ? t.dragZoom : t.touchDrag}</span></div>
            <SideBScene playing={playing} bookOpen={bookOpen} cameraMode={cameraMode} cameraFocus={cameraFocus} onObject={selectObject} />
            {cameraMode && (
              <div className="side-b-viewfinder" aria-label={t.controls}>
                <div className="side-b-viewfinder-cross" aria-hidden="true" />
                <div className="side-b-viewfinder-controls">
                  <button type="button" className={cameraFocus === "music" ? "is-active" : ""} onClick={() => setCameraFocus("music")}> {t.labels.music.toUpperCase()}</button>
                  <button type="button" className={cameraFocus === "journal" ? "is-active" : ""} onClick={() => setCameraFocus("journal")}>JOURNAL</button>
                  <button type="button" onClick={() => setCameraMode(false)}> {t.exit} <X size={14} /></button>
                </div>
              </div>
            )}
            <div className="side-b-stage-bottom"><span>{cameraMode ? "CAMERA / LIVE VIEW" : t.items}</span><span>© TG / 2026</span></div>
          </div>

          <div className="side-b-detail" key={selected}>
            <span className="side-b-detail-number">0{(["music", "journal", "camera"] as SideBObject[]).indexOf(selected) + 1} / {labels[selected].toUpperCase()}</span>
            <div className="side-b-detail-content">
              <h3>{labels[selected]}</h3>
              {selected === "music" && <><p className="side-b-status">{playing ? t.spinning : t.paused}</p><button type="button" className="side-b-primary-action" onClick={() => setPlaying((current) => !current)}>{playing ? <CirclePause size={19} /> : <CirclePlay size={19} />}{playing ? t.pause : t.spinRecord}</button><span className="side-b-microcopy"> {t.scratch}</span></>}
              {selected === "journal" && <><button type="button" className="side-b-primary-action" onClick={openJournal}> {t.write} <ArrowRight size={18} /></button><span className="side-b-microcopy"> {t.savedHere}</span></>}
              {selected === "camera" && <><button type="button" className="side-b-primary-action" onClick={() => setCameraMode((current) => !current)}><Camera size={18} />{cameraMode ? t.leaveLens : t.lens}</button><span className="side-b-microcopy"> {t.cameraHelp}</span></>}
            </div>
          </div>

          {journalOpen && (
            <section className="side-b-journal" aria-label={t.myJournal}>
              <aside className="side-b-journal-list">
                <div className="side-b-journal-list-head"><span> {t.myJournal}</span><button type="button" onClick={createEntry} aria-label={t.newEntry}><Plus size={18} /></button></div>
                <div className="side-b-journal-entries">
                  {entries.map((entry) => (
                    <button key={entry.id} type="button" className={entry.id === activeEntryId ? "is-active" : ""} onClick={() => setActiveEntryId(entry.id)}>
                      <span>{new Date(entry.createdAt).toLocaleDateString(locale === "es" ? "es-AR" : "en-US", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      <strong>{entry.title.trim() || t.untitled}</strong>
                    </button>
                  ))}
                </div>
                <span className="side-b-journal-storage">{storageError ? t.saveError : t.saved}</span>
              </aside>
              <div className="side-b-journal-editor">
                <div className="side-b-journal-toolbar"><span> {t.notes} / {String(entries.findIndex((entry) => entry.id === activeEntryId) + 1).padStart(2, "0")}</span><button type="button" onClick={closeJournal}> {t.closeAction} <X size={17} /></button></div>
                <input aria-label={t.entryTitle} placeholder={t.title} value={activeEntry?.title ?? ""} onChange={(event) => updateEntry("title", event.target.value)} />
                <textarea aria-label={t.entryBody} placeholder={t.start} value={activeEntry?.body ?? ""} onChange={(event) => updateEntry("body", event.target.value)} />
                <span className="side-b-journal-saved">{storageError ? t.unsaved : t.autosaved}</span>
              </div>
            </section>
          )}
        </div>

        <footer className="side-b-footer"><button type="button" onClick={onClose}><ArrowLeft size={17} /> {t.back}</button><span>{t.room}</span></footer>
      </div>
    </div>
  )
}
