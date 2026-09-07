import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from './motionVariants'

const tattoos = [
    { src: '/assets/images/tattoo1.webp', alt: 'Tatuaje espalda completa de dragon en negro, Barcelona por Jose Toyo', categoria: 'realismo' },
    { src: '/assets/images/tattoo2.webp', alt: 'Tatuaje blackwork brazo Barcelona Toyooner', categoria: 'blackwork' },
    { src: '/assets/images/tattoo3.webp', alt: 'Tatuaje dark gótico Barcelona Jose Toyo', categoria: 'dark' },
    { src: '/assets/images/tattoo4.webp', alt: 'Tatuaje realismo rostro Barcelona Toyooner', categoria: 'realismo' },
    { src: '/assets/images/tattoo5.webp', alt: 'Tatuaje realismo tigre Barcelona Jose Toyo', categoria: 'blackwork' },
    { src: '/assets/images/tattoo6.webp', alt: 'Tatuaje dark realismo antebrazo Barcelona Toyooner', categoria: 'dark' },
    { src: '/assets/images/tattoo7.webp', alt: 'Tatuaje araña Barcelona Jose Toyo', categoria: 'realismo' },
    { src: '/assets/images/tattoo8.webp', alt: 'Tatuaje blackwork Barcelona Toyooner', categoria: 'blackwork' },
    { src: '/assets/images/tattoo9.webp', alt: 'Tatuaje realismo colorBarcelona Jose Toyo', categoria: 'dark' },
    { src: '/assets/images/tattoo10.webp', alt: 'Tatuaje realismo Barcelona Toyooner', categoria: 'realismo' },
    { src: '/assets/images/tattoo11.webp', alt: 'Tatuaje color Barcelona Jose Toyo', categoria: 'blackwork' },
    { src: '/assets/images/tattoo12.webp', alt: 'Tatuaje dark color antebrazo Toyooner', categoria: 'dark' },
    { src: '/assets/images/tattoo13.webp', alt: 'Tatuaje realismo bíceps Barcelona Jose Toyo', categoria: 'realismo' },
    { src: '/assets/images/tattoo14.webp', alt: 'Tatuaje color Barcelona Toyooner', categoria: 'blackwork' },
    { src: '/assets/images/tattoo15.webp', alt: 'Tatuaje rostro realista gemelo Barcelona Jose Toyo', categoria: 'dark' },
    { src: '/assets/images/tattoo16.webp', alt: 'Tatuaje realista dark Barcelona Toyooner', categoria: 'realismo' },
    { src: '/assets/images/tattoo17.webp', alt: 'Tatuaje blackwork color Barcelona Jose Toyo', categoria: 'blackwork' },
    { src: '/assets/images/tattoo18.webp', alt: 'Tatuaje dark rostro Barcelona Toyooner', categoria: 'dark' },
    { src: '/assets/images/tattoo19.webp', alt: 'Tatuaje realista antebrazo Barcelona Jose Toyo', categoria: 'realismo' },
    { src: '/assets/images/tattoo20.webp', alt: 'Tatuaje blackwork realista Barcelona Toyooner', categoria: 'blackwork' },
    { src: '/assets/images/tattoo21.webp', alt: 'Tatuaje blackwork ojo Barcelona Toyooner', categoria: 'blackwork' },
    { src: '/assets/images/tattoo22.webp', alt: 'Tatuaje realista perroBarcelona Toyooner', categoria: 'blackwork' },
    { src: '/assets/images/tattoo23.webp', alt: 'Tatuaje perro realista Barcelona Toyooner', categoria: 'blackwork' },
]

const disenos = [
    { src: '/assets/images/diseno1.webp', alt: 'Diseño tattoo 1', categoria: 'design' },
    { src: '/assets/images/diseno2.webp', alt: 'Diseño tattoo 2', categoria: 'design' },
    { src: '/assets/images/diseno3.webp', alt: 'Diseño tattoo 3', categoria: 'design' },
    { src: '/assets/images/diseno4.webp', alt: 'Diseño tattoo 4', categoria: 'design' },
    { src: '/assets/images/diseno5.webp', alt: 'Diseño tattoo 5', categoria: 'design' },
    { src: '/assets/images/diseno6.webp', alt: 'Diseño tattoo 6', categoria: 'design' },
    { src: '/assets/images/diseno7.webp', alt: 'Diseño tattoo 7', categoria: 'design' },
    { src: '/assets/images/diseno8.webp', alt: 'Diseño tattoo 8', categoria: 'design' },
    { src: '/assets/images/diseno9.webp', alt: 'Diseño tattoo 9', categoria: 'design' },
    { src: '/assets/images/diseno10.webp', alt: 'Diseño tattoo 10', categoria: 'design' },
    { src: '/assets/images/diseno11.webp', alt: 'Diseño tattoo 11', categoria: 'design' },
    { src: '/assets/images/diseno12.webp', alt: 'Diseño tattoo 12', categoria: 'design' },
    { src: '/assets/images/diseno13.webp', alt: 'Diseño tattoo 13', categoria: 'design' },
    { src: '/assets/images/diseno14.webp', alt: 'Diseño tattoo 14', categoria: 'design' },
    { src: '/assets/images/diseno15.webp', alt: 'Diseño tattoo 15', categoria: 'design' },
    { src: '/assets/images/diseno16.webp', alt: 'Diseño tattoo 16', categoria: 'design' },
]

function Portfolio() {
    const [galeria, setGaleria] = useState('tattoos')
    const [modalIndex, setModalIndex] = useState(null)
    const imagenes = galeria === 'tattoos' ? tattoos : disenos

    function cerrarModal() {
        setModalIndex(null)
    }

    function mostrarAnterior() {
        setModalIndex((indiceActual) =>
            indiceActual === 0 ? imagenes.length - 1 : indiceActual - 1
        )
    }

    function mostrarSiguiente() {
        setModalIndex((indiceActual) =>
            indiceActual === imagenes.length - 1 ? 0 : indiceActual + 1
        )
    }

    useEffect(() => {
        document.body.style.overflow = modalIndex !== null ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [modalIndex])

    useEffect(() => {
        function manejarTeclado(e) {
            if (modalIndex === null) return
            if (e.key === 'Escape') cerrarModal()
            else if (e.key === 'ArrowLeft') mostrarAnterior()
            else if (e.key === 'ArrowRight') mostrarSiguiente()
        }

        document.addEventListener('keydown', manejarTeclado)

        return () => {
            document.removeEventListener('keydown', manejarTeclado)
        }
    }, [modalIndex, imagenes])

    return (
        <motion.section id="portfolio" className="portfolio" {...fadeInUp}>
            <div className="container">
                <h2 className="section-title">Portfolio</h2>
                <p className="section-subtitle">Explora algunos de mis tatuajes y diseños</p>

                <div className="gallery-selector">
                    <button
                        className={galeria === 'tattoos' ? 'selector-btn active' : 'selector-btn'}
                        onClick={() => setGaleria('tattoos')}
                    >
                        Tattoo
                    </button>
                    <button
                        className={galeria === 'disenos' ? 'selector-btn active' : 'selector-btn'}
                        onClick={() => setGaleria('disenos')}
                    >
                        Diseños
                    </button>
                </div>

                <div className="portfolio-grid">
                    {imagenes.map((item, index) => (
                        <div
                            className="portfolio-item"
                            data-category={item.categoria}
                            key={index}
                            onClick={() => setModalIndex(index)}
                        >
                            <img src={item.src} alt={item.alt} loading="lazy" />
                            <div className="portfolio-overlay">
                                <span className="portfolio-category"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {modalIndex !== null && (
                <div
                    className="modal active"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) cerrarModal()
                    }}
                >
                    <button className="modal-close" onClick={cerrarModal}>&times;</button>
                    <button
                        className="modal-nav modal-prev"
                        onClick={(e) => { e.stopPropagation(); mostrarAnterior() }}
                    >
                        &#10094;
                    </button>
                    <button
                        className="modal-nav modal-next"
                        onClick={(e) => { e.stopPropagation(); mostrarSiguiente() }}
                    >
                        &#10095;
                    </button>
                    <img
                        src={imagenes[modalIndex].src}
                        alt={imagenes[modalIndex].alt}
                        className="modal-content"
                    />
                    <div className="modal-caption"></div>
                </div>
            )}
        </motion.section>
    )
}

export default Portfolio