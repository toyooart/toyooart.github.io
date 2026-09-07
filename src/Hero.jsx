import { useRef, useEffect } from 'react'

function Hero() {
    const wrapperRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        const container = wrapperRef.current
        const canvas = canvasRef.current
        if (!container || !canvas) return

        let scene, camera, renderer, modelGroup, logoMesh
        let pointLight1, pointLight2
        let animFrameId = null
        let isVisible = true

        let isDragging = false
        let previousPointerPosition = { x: 0, y: 0 }
        let velocity = { x: 0, y: 0.008 }
        let targetRotation = { x: 0, y: 0 }
        let hoverTilt = { x: 0, y: 0 }
        const clock = new THREE.Clock()

        scene = new THREE.Scene()

        const width = container.clientWidth || 300
        const height = container.clientHeight || 220
        camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
        camera.position.set(0, 0, 6)

        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(width, height)
        if (THREE.sRGBEncoding) {
            renderer.outputEncoding = THREE.sRGBEncoding
        }

        modelGroup = new THREE.Group()
        scene.add(modelGroup)

        scene.add(new THREE.AmbientLight(0x1a2636, 2.0))

        const mainLight = new THREE.DirectionalLight(0xffffff, 2.0)
        mainLight.position.set(5, 8, 5)
        scene.add(mainLight)

        pointLight1 = new THREE.PointLight(0xa2d2ff, 4.5, 12)
        pointLight1.position.set(3, 2, 4)
        scene.add(pointLight1)

        pointLight2 = new THREE.PointLight(0x7dd3fc, 3.5, 10)
        pointLight2.position.set(-4, -2, -2)
        scene.add(pointLight2)

        const pointLight3 = new THREE.PointLight(0x9006c3, 2.5, 8)
        pointLight3.position.set(0, -4, 2)
        scene.add(pointLight3)

        function getPointerPos(e) {
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY }
            }
            return { x: e.clientX, y: e.clientY }
        }

        function onPointerDown(e) {
            isDragging = true
            previousPointerPosition = getPointerPos(e)
        }

        function onPointerMove(e) {
            const pos = getPointerPos(e)
            if (isDragging) {
                const deltaX = pos.x - previousPointerPosition.x
                const deltaY = pos.y - previousPointerPosition.y
                velocity.y = deltaX * 0.008
                velocity.x = deltaY * 0.008
                targetRotation.y += velocity.y
                targetRotation.x += velocity.x
                targetRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.x))
                previousPointerPosition = pos
            } else {
                const rect = canvas.getBoundingClientRect()
                const mouseX = ((pos.x - rect.left) / rect.width) * 2 - 1
                const mouseY = -(((pos.y - rect.top) / rect.height) * 2 - 1)
                if (mouseX >= -1 && mouseX <= 1 && mouseY >= -1 && mouseY <= 1) {
                    hoverTilt.y = mouseX * 0.2
                    hoverTilt.x = mouseY * 0.2
                }
            }
        }

        function onPointerUp() {
            isDragging = false
        }

        canvas.addEventListener('mousedown', onPointerDown)
        window.addEventListener('mousemove', onPointerMove)
        window.addEventListener('mouseup', onPointerUp)
        canvas.addEventListener('touchstart', onPointerDown, { passive: true })
        window.addEventListener('touchmove', onPointerMove, { passive: true })
        window.addEventListener('touchend', onPointerUp, { passive: true })

        function onWindowResize() {
            const w = container.clientWidth
            const h = container.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }
        window.addEventListener('resize', onWindowResize)

        function animate() {
            if (!isVisible) return
            animFrameId = requestAnimationFrame(animate)

            const elapsedTime = clock.getElapsedTime()

            if (modelGroup) {
                modelGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.15
                const wobbleZ = Math.sin(elapsedTime * 1.4) * 0.05
                const wobbleX = Math.cos(elapsedTime * 1.1) * 0.04

                if (isDragging) {
                    modelGroup.rotation.y = targetRotation.y
                    modelGroup.rotation.x = targetRotation.x
                } else {
                    velocity.y *= 0.95
                    velocity.x *= 0.95
                    if (Math.abs(velocity.y) < 0.003) velocity.y = 0.006
                    targetRotation.y += velocity.y
                    targetRotation.x += velocity.x * 0.9
                    targetRotation.x *= 0.96
                    modelGroup.rotation.y = targetRotation.y + hoverTilt.y * 0.1
                    modelGroup.rotation.x = targetRotation.x + wobbleX + hoverTilt.x * 0.1
                    modelGroup.rotation.z = wobbleZ
                }
            }

            if (pointLight1) pointLight1.intensity = 4.0 + Math.sin(elapsedTime * 2.2) * 0.8
            if (pointLight2) pointLight2.intensity = 3.0 + Math.cos(elapsedTime * 1.8) * 0.6

            renderer.render(scene, camera)
        }

        let observer
        function setupIntersectionObserver() {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            if (!isVisible) {
                                isVisible = true
                                clock.start()
                                animate()
                            }
                        } else {
                            isVisible = false
                            if (animFrameId) {
                                cancelAnimationFrame(animFrameId)
                                animFrameId = null
                            }
                        }
                    })
                },
                { threshold: 0.05 }
            )
            observer.observe(container)
        }
        setupIntersectionObserver()

        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('THREE.GLTFLoader no está disponible.')
        } else {
            const loader = new THREE.GLTFLoader()
            loader.load(
                '/assets/models/logoj2.glb',
                (gltf) => {
                    const loadedModel = gltf.scene
                    const box = new THREE.Box3().setFromObject(loadedModel)
                    const center = box.getCenter(new THREE.Vector3())
                    const size = box.getSize(new THREE.Vector3())

                    loadedModel.position.x = -center.x
                    loadedModel.position.y = -center.y
                    loadedModel.position.z = -center.z

                    const maxDim = Math.max(size.x, size.y, size.z)
                    const scale = maxDim > 0 ? 2.8 / maxDim : 1
                    loadedModel.scale.set(scale, scale, scale)

                    loadedModel.traverse((child) => {
                        if (child.isMesh && child.material) {
                            child.material.envMapIntensity = 1.5
                            if (child.material.metalness !== undefined) {
                                child.material.metalness = Math.max(child.material.metalness, 0.4)
                            }
                        }
                    })

                    logoMesh = loadedModel
                    modelGroup.add(logoMesh)
                    animate()
                },
                undefined,
                (error) => console.error('Error al cargar el logo 3D:', error)
            )
        }

        return () => {
            isVisible = false
            if (animFrameId) cancelAnimationFrame(animFrameId)
            if (observer) observer.disconnect()
            window.removeEventListener('mousemove', onPointerMove)
            window.removeEventListener('mouseup', onPointerUp)
            window.removeEventListener('touchmove', onPointerMove)
            window.removeEventListener('touchend', onPointerUp)
            window.removeEventListener('resize', onWindowResize)
            canvas.removeEventListener('mousedown', onPointerDown)
            canvas.removeEventListener('touchstart', onPointerDown)
            renderer.dispose()
        }
    }, [])

    return (
        <section id="home" className="hero">
            <video className="hero-video" autoPlay muted loop playsInline preload="none">
                <source src="/assets/videos/fondohero.webm" type="video/webm" />
                <source src="/assets/videos/fondohero.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div className="hero-3d-wrapper" ref={wrapperRef}>
                    <canvas ref={canvasRef}></canvas>
                </div>
                <h1 className="hero-title">Toyooner</h1>
                <p className="hero-subtitle">Realismo / Blackwork Dark</p>
                <p className="hero-description"> {'>>'} </p>
                <a
                    href="https://wa.me/34610609038?text=Hola,%20me%20gustaría%20reservar%20una%20cita"
                    className="cta-button"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Reservar Cita
                </a>
            </div>
            <div className="scroll-indicator">
                <span></span>
            </div>
        </section >
    )
}

export default Hero