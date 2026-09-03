(function () {
    'use strict';

    let scene, camera, renderer, modelGroup, logoMesh;
    let pointLight1, pointLight2, pointLight3;
    let animFrameId = null;
    let isVisible = true;

    // Control de interacción
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0.008 }; // Rotación inicial Y
    let targetRotation = { x: 0, y: 0 };
    let hoverTilt = { x: 0, y: 0 };

    // Tiempos para animaciones gravitacionales
    let clock = new THREE.Clock();

    function init() {
        const container = document.getElementById('hero3dWrapper');
        const canvas = document.getElementById('hero3dCanvas');

        if (!container || !canvas) return;

        // 1. Escena
        scene = new THREE.Scene();

        // 2. Cámara
        const width = container.clientWidth || 300;
        const height = container.clientHeight || 220;
        camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0, 6);

        // 3. Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        if (THREE.sRGBEncoding) {
            renderer.outputEncoding = THREE.sRGBEncoding;
        }

        // 4. Grupo principal del modelo
        modelGroup = new THREE.Group();
        scene.add(modelGroup);

        // 5. ILUMINACIÓN CON LOS COLORES DEL LOGO (#A2D2FF / Azul Glaciar / Ciano)
        // Luz ambiental suave azulada
        const ambientLight = new THREE.AmbientLight(0x1a2636, 2.0);
        scene.add(ambientLight);

        // Luz principal blanca suave desde arriba
        const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
        mainLight.position.set(5, 8, 5);
        scene.add(mainLight);

        // Luz de acento 1: Azul Glaciar (#A2D2FF) - Frontal / Lateral
        pointLight1 = new THREE.PointLight(0xa2d2ff, 4.5, 12);
        pointLight1.position.set(3, 2, 4);
        scene.add(pointLight1);

        // Luz de acento 2: Ciano Brillo (#7DD3FC) - Trasera / Contraluz
        pointLight2 = new THREE.PointLight(0x7dd3fc, 3.5, 10);
        pointLight2.position.set(-4, -2, -2);
        scene.add(pointLight2);

        // Luz de acento 3: Púrpura Gótico (#9006C3) - Inferior sutil
        pointLight3 = new THREE.PointLight(0x9006c3, 2.5, 8);
        pointLight3.position.set(0, -4, 2);
        scene.add(pointLight3);

        // 6. Cargar Modelo GLB
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('THREE.GLTFLoader no está disponible.');
            return;
        }

        const loader = new THREE.GLTFLoader();
        loader.load(
            'assets/models/logoj2.glb',
            function (gltf) {
                const loadedModel = gltf.scene;

                // Centrar el modelo en su origen de geometría
                const box = new THREE.Box3().setFromObject(loadedModel);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                loadedModel.position.x = -center.x;
                loadedModel.position.y = -center.y;
                loadedModel.position.z = -center.z;

                // Escalar de forma óptima para que se ajuste perfectamente a la vista
                const maxDim = Math.max(size.x, size.y, size.z);
                const targetSize = 2.8;
                const scale = maxDim > 0 ? targetSize / maxDim : 1;
                loadedModel.scale.set(scale, scale, scale);

                // Ajustar materiales si existen para resaltar los reflejos de luz
                loadedModel.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.envMapIntensity = 1.5;
                        if (child.material.metalness !== undefined) {
                            child.material.metalness = Math.max(child.material.metalness, 0.4);
                        }
                    }
                });

                logoMesh = loadedModel;
                modelGroup.add(logoMesh);

                // Iniciar loop de renderizado una vez cargado
                animate();
            },
            undefined,
            function (error) {
                console.error('Error al cargar el logo 3D:', error);
            }
        );

        // 7. Eventos de Interacción (Touch & Mouse Contact)
        setupInteractions(canvas, container);

        // 8. Resizing responsivo
        window.addEventListener('resize', onWindowResize);

        // 9. Optimización para móviles con IntersectionObserver
        setupIntersectionObserver(container);
    }

    function setupInteractions(canvas, container) {
        function getPointerPos(e) {
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }

        function onPointerDown(e) {
            isDragging = true;
            const pos = getPointerPos(e);
            previousPointerPosition = pos;
        }

        function onPointerMove(e) {
            const pos = getPointerPos(e);

            if (isDragging) {
                const deltaX = pos.x - previousPointerPosition.x;
                const deltaY = pos.y - previousPointerPosition.y;

                velocity.y = deltaX * 0.008;
                velocity.x = deltaY * 0.008;

                targetRotation.y += velocity.y;
                targetRotation.x += velocity.x;

                targetRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.x));

                previousPointerPosition = pos;
            } else {
                const rect = canvas.getBoundingClientRect();
                const mouseX = ((pos.x - rect.left) / rect.width) * 2 - 1;
                const mouseY = -(((pos.y - rect.top) / rect.height) * 2 - 1);

                if (mouseX >= -1 && mouseX <= 1 && mouseY >= -1 && mouseY <= 1) {
                    hoverTilt.y = mouseX * 0.2;
                    hoverTilt.x = mouseY * 0.2;
                }
            }
        }

        function onPointerUp() {
            isDragging = false;
        }

        // Mouse Events
        canvas.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        // Touch Events (optimizado para pantallas táctiles en móviles)
        canvas.addEventListener('touchstart', onPointerDown, { passive: true });
        window.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('touchend', onPointerUp, { passive: true });
    }

    function animate() {
        if (!isVisible) return;

        animFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        if (modelGroup) {
            // A. EFECTO GRAVITACIONAL / FLOTACIÓN CONTINUA
            modelGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.15;

            const wobbleZ = Math.sin(elapsedTime * 1.4) * 0.05;
            const wobbleX = Math.cos(elapsedTime * 1.1) * 0.04;

            // B. ROTACIÓN E INERCIA
            if (isDragging) {
                modelGroup.rotation.y = targetRotation.y;
                modelGroup.rotation.x = targetRotation.x;
            } else {
                velocity.y *= 0.95;
                velocity.x *= 0.95;

                if (Math.abs(velocity.y) < 0.003) {
                    velocity.y = 0.006;
                }

                targetRotation.y += velocity.y;
                targetRotation.x += velocity.x * 0.9;

                targetRotation.x *= 0.96;

                modelGroup.rotation.y = targetRotation.y + hoverTilt.y * 0.1;
                modelGroup.rotation.x = targetRotation.x + wobbleX + hoverTilt.x * 0.1;
                modelGroup.rotation.z = wobbleZ;
            }
        }

        // C. PARPADEO Y PULSO FLUIDO DE LUCES (Color del logo)
        if (pointLight1) {
            pointLight1.intensity = 4.0 + Math.sin(elapsedTime * 2.2) * 0.8;
        }
        if (pointLight2) {
            pointLight2.intensity = 3.0 + Math.cos(elapsedTime * 1.8) * 0.6;
        }

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const container = document.getElementById('hero3dWrapper');
        if (!container || !renderer || !camera) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    function setupIntersectionObserver(container) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isVisible) {
                        isVisible = true;
                        clock.start();
                        animate();
                    }
                } else {
                    isVisible = false;
                    if (animFrameId) {
                        cancelAnimationFrame(animFrameId);
                        animFrameId = null;
                    }
                }
            });
        }, { threshold: 0.05 });

        observer.observe(container);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
