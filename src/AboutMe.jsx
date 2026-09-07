import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from './motionVariants'

function AboutMe() {
    const [contador, setContador] = useState(0)
    const statRef = useRef(null)

    useEffect(() => {
        const numeroObjetivo = 10
        const duracion = 2000
        const incremento = numeroObjetivo / (duracion / 16)

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    let actual = 0
                    function actualizar() {
                        actual += incremento
                        if (actual < numeroObjetivo) {
                            setContador(Math.floor(actual))
                            requestAnimationFrame(actualizar)
                        } else {
                            setContador(numeroObjetivo)
                        }
                    }
                    actualizar()
                    observer.unobserve(entry.target)
                }
            })
        })

        if (statRef.current) observer.observe(statRef.current)

        return () => observer.disconnect()
    }, [])

    return (
        <motion.section id="sobre-mi" className="about" {...fadeInUp}>
            <div className="container">
                <div className="about-content">
                    <div className="about-image">
                        <img
                            src="/assets/images/sobremi.webp"
                            alt="Jose Toyo - Toyooner - Tatuador en Barcelona"
                            loading="lazy"
                        />
                        <div className="about-image-overlay"></div>
                    </div>
                    <div className="about-text">
                        <h2 className="section-title">Jose Toyo</h2>
                        <h3 className="about-name">//</h3>
                        <p className="about-description">
                            Artista del tatuaje especializado en realismo y blackwork dark.
                            Más de 13 años trabajando el tatuaje desde la técnica y el detalle.
                        </p>
                        <p className="about-description">
                            Cada pieza nace de una idea, un diálogo y una lectura del cuerpo.
                            No busco solo impactar; busco que el tatuaje tenga sentido hoy y con el paso del tiempo.
                            Trabajo con calma y precisión.
                            El proceso es tan importante como el resultado.
                        </p>
                        <p className="about-description">
                            Trayectoria internacional
                            Europa · Latinoamérica {'>>'}
                            Tu piel no es un lienzo cualquiera.
                            El compromiso es total.
                        </p>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number" ref={statRef}>{contador}+</span>
                                <span className="stat-label">Años de Experiencia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default AboutMe