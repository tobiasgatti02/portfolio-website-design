"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export type SideBObject = "music" | "journal" | "camera"
export type CameraFocus = "music" | "journal"

type Props = {
  playing: boolean
  bookOpen: boolean
  cameraMode: boolean
  cameraFocus: CameraFocus
  onObject: (object: SideBObject) => void
}

function coverTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 1024
  const context = canvas.getContext("2d")!
  context.fillStyle = "#b95b3c"
  context.fillRect(0, 0, 1024, 1024)
  context.strokeStyle = "rgba(255,222,187,.38)"
  context.lineWidth = 5
  context.strokeRect(65, 65, 894, 894)
  context.fillStyle = "#f8e8d5"
  context.textAlign = "center"
  context.font = "700 92px Georgia, serif"
  context.fillText("JOURNAL", 512, 500)
  context.font = "500 28px Arial, sans-serif"
  context.letterSpacing = "12px"
  context.fillText("TOBIAS GATTI", 512, 560)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  return texture
}

function labelTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 1024
  const context = canvas.getContext("2d")!
  context.fillStyle = "#e9946b"
  context.fillRect(0, 0, 1024, 1024)
  context.fillStyle = "#31231e"
  context.fillRect(0, 0, 1024, 120)
  context.fillStyle = "#2a201c"
  context.beginPath()
  context.arc(512, 512, 34, 0, Math.PI * 2)
  context.fill()
  context.font = "bold 104px Arial, sans-serif"
  context.textAlign = "center"
  context.fillText("B SIDE", 512, 390)
  context.font = "bold 38px Arial, sans-serif"
  context.fillText("33⅓ RPM", 512, 770)
  context.fillStyle = "#fff0d9"
  context.fillRect(750, 460, 90, 24)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  return texture
}

export function SideBScene({ playing, bookOpen, cameraMode, cameraFocus, onObject }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ playing, bookOpen, cameraMode, cameraFocus, onObject })
  useEffect(() => { stateRef.current = { playing, bookOpen, cameraMode, cameraFocus, onObject } }, [playing, bookOpen, cameraMode, cameraFocus, onObject])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" })
    } catch {
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio * 2, 2), 3))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const scene = new THREE.Scene()
    const view = new THREE.PerspectiveCamera(36, 1, 0.05, 100)
    const overview = new THREE.Vector3(0, 6.6, 11.8)
    const overviewTarget = new THREE.Vector3(0, 0.35, 0)
    const lensPosition = new THREE.Vector3(2.7, 2.65, 5.2)
    const desiredLens = new THREE.Vector3()
    const lookTarget = new THREE.Vector3()
    const povTarget = new THREE.Vector3()
    let viewBlend = 0
    let lookOffset = 0
    let zoom = 42

    scene.add(new THREE.AmbientLight("#fff4e8", 1.15))
    const keyLight = new THREE.DirectionalLight("#fff1d9", 3.7)
    keyLight.position.set(-3, 8, 7)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(2048, 2048)
    keyLight.shadow.camera.left = -7
    keyLight.shadow.camera.right = 7
    keyLight.shadow.camera.top = 7
    keyLight.shadow.camera.bottom = -7
    keyLight.shadow.bias = -0.0004
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight("#ec986e", 1.7)
    rimLight.position.set(5, 3, -4)
    scene.add(rimLight)

    const matte = (color: string, roughness = 0.62) => new THREE.MeshStandardMaterial({ color, roughness })
    const ink = matte("#171717", 0.3)
    const cream = matte("#f0e5d1")
    const orange = matte("#b95b3c", 0.48)
    const brass = new THREE.MeshStandardMaterial({ color: "#c5ab78", metalness: 0.7, roughness: 0.28 })
    const clickable: THREE.Mesh[] = []
    const add = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, key?: SideBObject) => {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      if (key) { mesh.userData.key = key; clickable.push(mesh) }
      parent.add(mesh)
      return mesh
    }

    add(scene, new THREE.BoxGeometry(9.4, 0.22, 4.1), matte("#805d43"), 0, -0.18, 0)
    add(scene, new THREE.BoxGeometry(9.45, 0.055, 4.14), matte("#c9a37b"), 0, -0.035, 0)
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ color: "#000000", opacity: 0.26 }))
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.35
    ground.receiveShadow = true
    scene.add(ground)

    // Vinyl: asymmetric artwork makes its real rotation legible.
    const deck = new THREE.Group()
    deck.position.set(-2.7, 0, 0)
    scene.add(deck)
    add(deck, new THREE.BoxGeometry(2.48, 0.24, 2.48), matte("#242321", 0.44), 0, 0.16, 0, "music")
    add(deck, new THREE.CylinderGeometry(0.96, 0.96, 0.105, 128), brass, 0, 0.34, 0, "music")
    const record = new THREE.Group()
    record.position.y = 0.415
    deck.add(record)
    add(record, new THREE.CylinderGeometry(0.88, 0.88, 0.045, 160), ink, 0, 0, 0, "music")
    const grooveMaterial = matte("#585858", 0.3)
    for (let radius = 0.34; radius < 0.83; radius += 0.028) {
      const groove = add(record, new THREE.RingGeometry(radius, radius + 0.002, 128), grooveMaterial, 0, 0.026, 0, "music")
      groove.rotation.x = -Math.PI / 2
    }
    const vinylLabel = labelTexture()
    const label = add(record, new THREE.CircleGeometry(0.26, 96), new THREE.MeshStandardMaterial({ map: vinylLabel, roughness: 0.64, side: THREE.DoubleSide }), 0, 0.032, 0, "music")
    label.rotation.x = -Math.PI / 2
    add(record, new THREE.CylinderGeometry(0.018, 0.018, 0.08, 20), brass, 0, 0.06, 0, "music")
    const marker = add(record, new THREE.SphereGeometry(0.027, 16, 12), cream, 0.67, 0.046, 0, "music")
    marker.castShadow = false
    const armPivot = new THREE.Group()
    armPivot.position.set(0.91, 0.47, -0.9)
    deck.add(armPivot)
    add(armPivot, new THREE.CylinderGeometry(0.09, 0.09, 0.12, 24), brass, 0, 0, 0, "music")
    const arm = add(armPivot, new THREE.BoxGeometry(0.07, 0.07, 1.23), brass, -0.24, 0.07, 0.48, "music")
    arm.rotation.y = -0.42
    add(armPivot, new THREE.BoxGeometry(0.2, 0.09, 0.14), ink, -0.48, 0.07, 0.96, "music")
    add(deck, new THREE.CylinderGeometry(0.1, 0.1, 0.09, 32), brass, 0.9, 0.33, 0.92, "music")

    // The book is the entrance to a real, locally saved journal.
    const book = new THREE.Group()
    book.position.set(0.02, 0.12, 0.08)
    book.rotation.y = -0.12
    scene.add(book)
    add(book, new THREE.BoxGeometry(2.3, 0.12, 2.78), orange, 0, 0.07, 0, "journal")
    add(book, new THREE.BoxGeometry(2.16, 0.31, 2.6), cream, 0.02, 0.25, 0, "journal")
    for (let i = 0; i < 6; i++) {
      add(book, new THREE.BoxGeometry(2.16, 0.002, 2.58), matte(i % 2 ? "#c8bdaa" : "#ddd1bf"), 0.02, 0.1 + i * 0.056, 0, "journal")
    }
    const coverPivot = new THREE.Group()
    coverPivot.position.set(-1.13, 0.44, 0)
    book.add(coverPivot)
    add(coverPivot, new THREE.BoxGeometry(2.3, 0.09, 2.78), orange, 1.13, 0, 0, "journal")
    const journalCover = coverTexture()
    const coverPrint = add(coverPivot, new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshBasicMaterial({ map: journalCover, side: THREE.DoubleSide }), 1.13, 0.048, 0, "journal")
    coverPrint.rotation.x = -Math.PI / 2

    // A physical camera with a layered lens and viewfinder.
    const cameraBody = new THREE.Group()
    cameraBody.position.set(2.75, 0.02, -0.12)
    cameraBody.rotation.y = -0.62
    scene.add(cameraBody)
    add(cameraBody, new THREE.BoxGeometry(1.86, 1.16, 0.66), matte("#343331", 0.42), 0, 0.86, 0, "camera")
    add(cameraBody, new THREE.BoxGeometry(0.5, 0.82, 0.08), matte("#6d4939"), -0.73, 0.86, 0.37, "camera")
    add(cameraBody, new THREE.BoxGeometry(0.54, 0.82, 0.08), matte("#6d4939"), 0.68, 0.86, 0.37, "camera")
    add(cameraBody, new THREE.BoxGeometry(0.76, 0.28, 0.5), matte("#242423"), 0, 1.56, -0.04, "camera")
    add(cameraBody, new THREE.BoxGeometry(0.3, 0.18, 0.23), brass, 0.63, 1.52, 0.03, "camera")
    for (const [radius, depth, z] of [[0.52, 0.2, 0.48], [0.45, 0.18, 0.67], [0.36, 0.12, 0.81]] as const) {
      const ring = add(cameraBody, new THREE.CylinderGeometry(radius, radius, depth, 96), radius === 0.45 ? brass : ink, 0, 0.91, z, "camera")
      ring.rotation.x = Math.PI / 2
    }
    const glass = add(cameraBody, new THREE.CircleGeometry(0.315, 96), new THREE.MeshPhysicalMaterial({ color: "#182d38", metalness: 0.4, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03, side: THREE.DoubleSide }), 0, 0.91, 0.89, "camera")
    glass.material.side = THREE.DoubleSide
    add(cameraBody, new THREE.TorusGeometry(0.28, 0.018, 12, 96), brass, 0, 0.91, 0.895, "camera")
    const glassGlint = add(cameraBody, new THREE.CircleGeometry(0.075, 32), new THREE.MeshBasicMaterial({ color: "#a6c6c7", transparent: true, opacity: 0.36 }), -0.11, 1.03, 0.902, "camera")
    glassGlint.castShadow = false
    add(cameraBody, new THREE.CylinderGeometry(0.085, 0.085, 0.07, 32), brass, 0.64, 1.48, 0.1, "camera")

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      view.aspect = width / height
      overview.set(0, width < 560 ? 8.1 : 6.6, width < 560 ? 15.1 : 11.8)
      view.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const hit = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1)
      raycaster.setFromCamera(pointer, view)
      return raycaster.intersectObjects(clickable, false)[0]?.object.userData.key as SideBObject | undefined
    }
    let down: { x: number; y: number; object?: SideBObject } | null = null
    let previousX = 0
    const pointerDown = (event: PointerEvent) => {
      down = { x: event.clientX, y: event.clientY, object: hit(event) }
      previousX = event.clientX
      if (stateRef.current.cameraMode || down.object === "music") canvas.setPointerCapture(event.pointerId)
    }
    const pointerMove = (event: PointerEvent) => {
      if (down) {
        const delta = event.clientX - previousX
        if (stateRef.current.cameraMode) lookOffset = THREE.MathUtils.clamp(lookOffset - delta * 0.012, -1.7, 1.7)
        else if (down.object === "music" && Math.abs(event.clientX - down.x) > 4) record.rotation.y += delta * 0.025
        previousX = event.clientX
      } else {
        canvas.style.cursor = hit(event) ? "pointer" : stateRef.current.cameraMode ? "grab" : "default"
      }
    }
    const pointerUp = (event: PointerEvent) => {
      if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) < 10) {
        const object = hit(event) ?? down.object
        if (object) stateRef.current.onObject(object)
      }
      down = null
    }
    const wheel = (event: WheelEvent) => {
      if (!stateRef.current.cameraMode) return
      event.preventDefault()
      zoom = THREE.MathUtils.clamp(zoom + event.deltaY * 0.025, 26, 58)
    }
    canvas.addEventListener("pointerdown", pointerDown)
    canvas.addEventListener("pointermove", pointerMove)
    canvas.addEventListener("pointerup", pointerUp)
    canvas.addEventListener("pointercancel", pointerUp)
    canvas.addEventListener("wheel", wheel, { passive: false })

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = new THREE.Clock()
    let frame = 0
    const animate = () => {
      const delta = Math.min(timer.getDelta(), 0.05)
      if (stateRef.current.playing) record.rotation.y += delta * (Math.PI * 2 * 33.333 / 60)
      const coverTarget = stateRef.current.bookOpen ? 1.13 : 0
      coverPivot.rotation.z += (coverTarget - coverPivot.rotation.z) * (reducedMotion ? 1 : 0.12)
      const blendTarget = stateRef.current.cameraMode ? 1 : 0
      viewBlend += (blendTarget - viewBlend) * (reducedMotion ? 1 : 0.09)
      cameraBody.visible = viewBlend < 0.75
      const focusX = stateRef.current.cameraFocus === "music" ? -2.65 : -0.1
      desiredLens.set(stateRef.current.cameraFocus === "music" ? 0.1 : 2.7, stateRef.current.cameraFocus === "music" ? 2.5 : 2.65, stateRef.current.cameraFocus === "music" ? 5.1 : 5.2)
      lensPosition.lerp(desiredLens, reducedMotion ? 1 : 0.08)
      povTarget.set(focusX + lookOffset, 0.39, -0.06)
      view.position.lerpVectors(overview, lensPosition, viewBlend)
      lookTarget.lerpVectors(overviewTarget, povTarget, viewBlend)
      view.lookAt(lookTarget)
      view.fov = THREE.MathUtils.lerp(36, zoom, viewBlend)
      view.updateProjectionMatrix()
      renderer.render(scene, view)
      frame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener("pointerdown", pointerDown)
      canvas.removeEventListener("pointermove", pointerMove)
      canvas.removeEventListener("pointerup", pointerUp)
      canvas.removeEventListener("pointercancel", pointerUp)
      canvas.removeEventListener("wheel", wheel)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      vinylLabel.dispose()
      journalCover.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className={`side-b-canvas ${cameraMode ? "is-camera" : ""}`} aria-label="Mesa 3D interactiva con vinilo, journal y cámara" />
}
