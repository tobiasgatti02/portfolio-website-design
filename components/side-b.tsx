"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Camera, CirclePause, CirclePlay, Plus, X } from "lucide-react"
import { SideBScene, type CameraFocus, type SideBObject } from "@/components/side-b-scene"

type JournalEntry = { id: string; title: string; body: string; createdAt: string; updatedAt: string }
const STORAGE_KEY = "tobias-gatti-side-b-journal-v1"

const labels: Record<SideBObject, string> = {
  music: "Vinilo",
  journal: "Journal",
  camera: "Cámara",
}

export function SideB({ open, onClose }: { open: boolean; onClose: () => void }) {
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
          <span className="side-b-wordmark">TOBIAS GATTI <span>/</span> LADO B</span>
          <span className="side-b-header-center">ARCHIVO PERSONAL · 001</span>
          <button ref={closeRef} className="side-b-close" onClick={onClose} type="button" aria-label="Cerrar Lado B"><X size={19} /></button>
        </header>

        <div className="side-b-main">
          <div className="side-b-intro">
            <span className="side-b-eyebrow">FUERA DE PROGRAMA <span>●</span> 001</span>
            <h2 id="side-b-title">El lado <em>B.</em></h2>
            <div className="side-b-index" role="group" aria-label="Objetos del Lado B">
              {(["music", "journal", "camera"] as SideBObject[]).map((object, index) => (
                <button key={object} type="button" className={`side-b-index-item ${selected === object ? "is-active" : ""}`} onClick={() => selectObject(object)} aria-label={`${object === "music" ? playing ? "Pausar" : "Girar" : "Abrir"} ${labels[object]}`}>
                  <span>0{index + 1}</span>{labels[object]}<ArrowRight size={15} />
                </button>
              ))}
            </div>
            <span className="side-b-intro-foot">TOCÁ LOS OBJETOS PARA EXPLORAR</span>
          </div>

          <div className="side-b-stage">
            <div className="side-b-stage-top"><span>{cameraMode ? "VISTA DESDE EL LENTE" : "FIG. 01 — MESA DE IDEAS"}</span><span>{cameraMode ? "ARRASTRÁ PARA MIRAR · SCROLL PARA ZOOM" : "TOCÁ / ARRASTRÁ"}</span></div>
            <SideBScene playing={playing} bookOpen={bookOpen} cameraMode={cameraMode} cameraFocus={cameraFocus} onObject={selectObject} />
            {cameraMode && (
              <div className="side-b-viewfinder" aria-label="Controles de la cámara">
                <div className="side-b-viewfinder-cross" aria-hidden="true" />
                <div className="side-b-viewfinder-controls">
                  <button type="button" className={cameraFocus === "music" ? "is-active" : ""} onClick={() => setCameraFocus("music")}>VINILO</button>
                  <button type="button" className={cameraFocus === "journal" ? "is-active" : ""} onClick={() => setCameraFocus("journal")}>JOURNAL</button>
                  <button type="button" onClick={() => setCameraMode(false)}>SALIR <X size={14} /></button>
                </div>
              </div>
            )}
            <div className="side-b-stage-bottom"><span>{cameraMode ? "CAMERA / LIVE VIEW" : "VINILO · JOURNAL · CÁMARA"}</span><span>© TG / 2026</span></div>
          </div>

          <div className="side-b-detail" key={selected}>
            <span className="side-b-detail-number">0{(["music", "journal", "camera"] as SideBObject[]).indexOf(selected) + 1} / {labels[selected].toUpperCase()}</span>
            <div className="side-b-detail-content">
              <h3>{labels[selected]}</h3>
              {selected === "music" && <><p className="side-b-status">{playing ? "● GIRANDO A 33⅓ RPM" : "○ PAUSADO"}</p><button type="button" className="side-b-primary-action" onClick={() => setPlaying((current) => !current)}>{playing ? <CirclePause size={19} /> : <CirclePlay size={19} />}{playing ? "Pausar" : "Girar el disco"}</button><span className="side-b-microcopy">Arrastrá el vinilo para hacer scratch.</span></>}
              {selected === "journal" && <><button type="button" className="side-b-primary-action" onClick={openJournal}>Abrir y escribir <ArrowRight size={18} /></button><span className="side-b-microcopy">Tus notas quedan en este navegador.</span></>}
              {selected === "camera" && <><button type="button" className="side-b-primary-action" onClick={() => setCameraMode((current) => !current)}><Camera size={18} />{cameraMode ? "Salir del lente" : "Mirar por el lente"}</button><span className="side-b-microcopy">Arrastrá para mirar. Scroll para acercarte.</span></>}
            </div>
          </div>

          {journalOpen && (
            <section className="side-b-journal" aria-label="Mi journal">
              <aside className="side-b-journal-list">
                <div className="side-b-journal-list-head"><span>MI JOURNAL</span><button type="button" onClick={createEntry} aria-label="Nueva entrada"><Plus size={18} /></button></div>
                <div className="side-b-journal-entries">
                  {entries.map((entry) => (
                    <button key={entry.id} type="button" className={entry.id === activeEntryId ? "is-active" : ""} onClick={() => setActiveEntryId(entry.id)}>
                      <span>{new Date(entry.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      <strong>{entry.title.trim() || "Sin título"}</strong>
                    </button>
                  ))}
                </div>
                <span className="side-b-journal-storage">{storageError ? "No se pudo guardar en este navegador" : "Guardado en este navegador"}</span>
              </aside>
              <div className="side-b-journal-editor">
                <div className="side-b-journal-toolbar"><span>NOTAS / {String(entries.findIndex((entry) => entry.id === activeEntryId) + 1).padStart(2, "0")}</span><button type="button" onClick={closeJournal}>Cerrar <X size={17} /></button></div>
                <input aria-label="Título de la entrada" placeholder="Título" value={activeEntry?.title ?? ""} onChange={(event) => updateEntry("title", event.target.value)} />
                <textarea aria-label="Texto de la entrada" placeholder="Empezá a escribir..." value={activeEntry?.body ?? ""} onChange={(event) => updateEntry("body", event.target.value)} />
                <span className="side-b-journal-saved">{storageError ? "SIN GUARDAR" : "GUARDADO AUTOMÁTICO"}</span>
              </div>
            </section>
          )}
        </div>

        <footer className="side-b-footer"><button type="button" onClick={onClose}><ArrowLeft size={17} /> VOLVER AL PORTFOLIO</button><span>UNA PEQUEÑA HABITACIÓN SECRETA.</span></footer>
      </div>
    </div>
  )
}
