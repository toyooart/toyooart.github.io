/* ========================================
   TOYOONER - LANDING PAGE JAVASCRIPT
   Funcionalidad interactiva y animaciones
   ======================================== */

// ========================================
// NAVEGACIÓN MÓVIL
// ========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle del menú móvil
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

const navbar = document.querySelector('.navbar');
let hideTimeout;

// 🔹 Configuración de umbrales
const FIXED_UNTIL = 300; // px: navbar fija al inicio
const HIDE_AT = 300;     // px: navbar empieza a ocultarse
const SHOW_AT = 850;     // px: altura desde la que el navbar vuelve al subir

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // ========================================
    // 1️⃣ NAVBAR FIJA (no se mueve)
    // ========================================
    if (scrollY < FIXED_UNTIL) {
        clearTimeout(hideTimeout);
        navbar.classList.remove('hide');
        navbar.style.transform = ''; // sin estiramiento
        navbar.style.opacity = '';
        lastScroll = scrollY;
        return;
    }

    // ========================================
    // 2️⃣ EFECTO DE ESTIRAMIENTO FLUIDO
    // ========================================
    if (scrollY >= FIXED_UNTIL && scrollY < HIDE_AT) {
        const y = Math.min(scrollY - FIXED_UNTIL, 120);
        const scale = 1 - (y / 500);
        const skew = -(y / 80);
        const opacity = 1 - (y / 120);

        navbar.style.transform = `
            translateY(${-y * 0.6}px)
            scaleY(${scale})
            skewY(${skew}deg)
        `;
        navbar.style.opacity = opacity;

        clearTimeout(hideTimeout);
        navbar.classList.remove('hide');
        lastScroll = scrollY;
        return;
    }

    // ========================================
    // 3️⃣ OCULTAR NAVBAR al pasar HIDE_AT
    // ========================================
    if (scrollY >= HIDE_AT && scrollY > lastScroll) {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            navbar.classList.add('hide');
        }, 10); // retraso antes de esconder
    }

    // ========================================
    // 4️⃣ VOLVER NAVBAR al subir (solo si scrollY < SHOW_AT)
    // ========================================
    if (scrollY < lastScroll && scrollY < SHOW_AT) {
        clearTimeout(hideTimeout);
        navbar.classList.remove('hide');
    }

    lastScroll = scrollY;
});

// ========================================
// SMOOTH SCROLL PARA NAVEGACIÓN
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 70; // Offset para el navbar fijo
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// video hero
const hero = document.querySelector('.hero');
const video = document.querySelector('.hero-video');

if (hero && video) {
    window.addEventListener('scroll', () => {
        const heroHeight = hero.offsetHeight;
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / heroHeight, 1);
        video.style.opacity = 1 - progress;
    });
}

// ========================================
// PORTFOLIO FILTROS
// ========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Añadir clase active al botón clickeado
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                item.classList.remove('hidden');
                // Animación de entrada
                item.style.animation = 'fadeInUp 0.5s ease';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ========================================
// MODAL DE IMAGEN (LIGHTBOX)
// ========================================
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentImageIndex = 0;
let visibleImages = [];

// Función para actualizar las imágenes visibles
function updateVisibleImages() {
    visibleImages = Array.from(portfolioItems).filter(item => !item.classList.contains('hidden'));
}

// Abrir modal al hacer click en una imagen del portfolio
portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        updateVisibleImages();
        currentImageIndex = visibleImages.indexOf(item);
        showImage(currentImageIndex);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    });
});

// Función para mostrar imagen en el modal
function showImage(index) {
    if (index < 0) {
        currentImageIndex = visibleImages.length - 1;
    } else if (index >= visibleImages.length) {
        currentImageIndex = 0;
    } else {
        currentImageIndex = index;
    }

    const img = visibleImages[currentImageIndex].querySelector('img');
    const category = visibleImages[currentImageIndex].querySelector('.portfolio-category').textContent;

    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalCaption.textContent = category;

    // Precargar imágenes adyacentes para navegación más fluida
    preloadAdjacentImages(currentImageIndex);
}

// Función para precargar imágenes adyacentes
function preloadAdjacentImages(currentIndex) {
    const prevIndex = currentIndex - 1 < 0 ? visibleImages.length - 1 : currentIndex - 1;
    const nextIndex = currentIndex + 1 >= visibleImages.length ? 0 : currentIndex + 1;

    // Precargar imagen anterior
    if (visibleImages[prevIndex]) {
        const prevImg = new Image();
        prevImg.src = visibleImages[prevIndex].querySelector('img').src;
    }

    // Precargar imagen siguiente
    if (visibleImages[nextIndex]) {
        const nextImg = new Image();
        nextImg.src = visibleImages[nextIndex].querySelector('img').src;
    }
}

// Cerrar modal
modalClose.addEventListener('click', closeModal);

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll del body
}

// Cerrar modal al hacer click fuera de la imagen
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Navegación entre imágenes
modalPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentImageIndex - 1);
});

modalNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentImageIndex + 1);
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        showImage(currentImageIndex - 1);
    } else if (e.key === 'ArrowRight') {
        showImage(currentImageIndex + 1);
    }
});

// ========================================
// FAQ ACCORDION
// ========================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Cerrar todos los items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Abrir el item clickeado si no estaba activo
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ========================================
// FORMULARIOS CON PREVIEW Y MENSAJE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const startTime = Date.now();

    // Selecciona cualquier formulario que use FormBold
    const forms = document.querySelectorAll('form[action*="formbold.com"]');

    forms.forEach(form => {
        const fileInput = form.querySelector('input[type="file"]');
        const previewDiv = form.querySelector('.preview');
        const messageDiv = form.querySelector('.form-message');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Detectar idioma según el ID del formulario
        const isEN = form.id.includes('EN');

        // 1. PREVISUALIZACIÓN DE IMÁGENES
        if (fileInput && previewDiv) {
            fileInput.addEventListener('change', () => {
                previewDiv.innerHTML = '';
                const files = Array.from(fileInput.files);

                if (files.length > 5) {
                    alert(isEN ? 'Max 5 images allowed.' : 'Máximo 5 imágenes permitidas.');
                    fileInput.value = '';
                    return;
                }

                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.cssText = "width:70px; height:70px; object-fit:cover; border-radius:5px; border:1px solid #ccc;";
                        previewDiv.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
            });
        }

        // 2. ENVÍO MEDIANTE FETCH (Sin recargar página)
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Anti-bot: Mínimo 3 segundos para rellenar
            if ((Date.now() - startTime) < 3000) return;

            submitBtn.disabled = true;
            const originalText = submitBtn.innerText;
            submitBtn.innerText = isEN ? "Sending..." : "Enviando...";

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    messageDiv.style.color = "#28a745";
                    messageDiv.innerText = isEN ? "Success! Inquiry sent." : "¡Éxito! Consulta enviada correctamente.";
                    form.reset();
                    if (previewDiv) previewDiv.innerHTML = '';
                } else {
                    throw new Error();
                }
            } catch (err) {
                messageDiv.style.color = "#dc3545";
                messageDiv.innerText = isEN ? "Error. Please try again." : "Hubo un error. Inténtalo de nuevo.";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    });
});

// ========================================
// ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animación genérica (excluyendo portfolio y about)
const animatedElements = document.querySelectorAll('.contact-item, .faq-item, .stat-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ========================================
// ANIMACIÓN ELEGANTE (GALERÍA Y SOBRE MÍ)
// ========================================
const elegantObserverOptions = {
    threshold: 0.15, // Un poco más de umbral para que no salte apenas entra
    rootMargin: '0px 0px -50px 0px'
};

const elegantObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Añadir un pequeño delay escalonado si hay múltiples elementos entrando a la vez
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            elegantObserver.unobserve(entry.target);
        }
    });
}, elegantObserverOptions);

const elegantElements = document.querySelectorAll('.portfolio-item, .about-image');
elegantElements.forEach(el => {
    el.classList.add('elegant-scroll-reveal');
    elegantObserver.observe(el);
});

// ========================================
// SCROLL REVEAL PARA SECCIONES
// ========================================
const sections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
});

// ========================================
// CONTADOR ANIMADO PARA ESTADÍSTICAS
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element) => {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const number = parseInt(target.replace(/\D/g, ''));
    const duration = 2000; // 2 segundos
    const increment = number / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < number) {
            element.textContent = Math.floor(current) + (isPercentage ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ========================================
// PRELOADER (OPCIONAL)
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ========================================
// LAZY LOADING PARA IMÁGENES
// ========================================
const images = document.querySelectorAll('img[loading="lazy"]');

if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback para navegadores que no soportan lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// PARALLAX EFFECT PARA HERO
// ========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (hero) {
        hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
    }
});

// ========================================
// TRACKING DE EVENTOS PARA GOOGLE ANALYTICS
// ========================================
// Tracking de clicks en botones de WhatsApp
const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
whatsappButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'WhatsApp Button',
                'value': 1
            });
        }
    });
});

// Tracking de clicks en enlaces de Instagram
const instagramLinks = document.querySelectorAll('a[href*="instagram.com"]');
instagramLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Social',
                'event_label': 'Instagram Link',
                'value': 1
            });
        }
    });
});

// Tracking de envío de formulario
const tattooFormEl = document.getElementById('tattooFormES');

if (tattooFormEl) {
    tattooFormEl.addEventListener('submit', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'submit', {
                event_category: 'Form',
                event_label: 'Contact Form'
            });
        }
    });
}

// ========================================
// DETECCIÓN DE SCROLL PARA ANIMACIONES
// ========================================
let ticking = false;

function handleScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Aquí puedes añadir más efectos de scroll si lo deseas
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', handleScroll);

// ========================================
// CONSOLE MESSAGE (BRANDING)
// ========================================
console.log('%cToyooner - Tatuador Guest en Barcelona', 'font-size: 20px; font-weight: bold; color: #7dd3fc;');
console.log('%cRealismo, Blackwork Dark', 'font-size: 14px; color: #a3a3a3;');
console.log('%c¿Interesado en el código? Contáctame en @toyooner', 'font-size: 12px; color: #7dd3fc;');

// ========================================
// GALLERY SELECTOR (TATTOOS VS DESIGNS)
// ========================================
const selectorBtns = document.querySelectorAll('.selector-btn');
const galleryTattoos = document.getElementById('gallery-tattoos');
const galleryDesigns = document.getElementById('gallery-designs');

selectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        selectorBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Toggle galleries
        const target = btn.getAttribute('data-target');
        if (target === 'gallery-tattoos') {
            galleryTattoos.style.display = 'block';
            galleryDesigns.style.display = 'none';
        } else if (target === 'gallery-designs') {
            galleryTattoos.style.display = 'none';
            galleryDesigns.style.display = 'block';
        }

        // Re-initialize visible images for lightbox
        updateVisibleImages();

        // Re-trigger animations for new visible items
        const newVisibleItems = document.querySelectorAll(`#${target} .portfolio-item`);
        newVisibleItems.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight; /* trigger reflow */
            item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
        });
    });
});

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Toyooner Landing Page cargada correctamente');

    // Actualizar imágenes visibles al cargar
    updateVisibleImages();

    // Añadir clase loaded al body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
