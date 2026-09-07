import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from './motionVariants'

const FORM_ID = 'rg22hvtgwqo'

function Contacto() {
    const formRef = useRef(null)
    const [previews, setPreviews] = useState([])
    const [enviando, setEnviando] = useState(false)
    const [mensaje, setMensaje] = useState(null)

    function manejarCambioImagenes(e) {
        const files = Array.from(e.target.files)
        setPreviews([])

        if (files.length > 5) {
            alert('Máximo 5 imágenes permitidas.')
            e.target.value = ''
            return
        }

        files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = (event) => {
                setPreviews((anteriores) => [...anteriores, event.target.result])
            }
            reader.readAsDataURL(file)
        })
    }

    async function manejarEnvio(e) {
        e.preventDefault()
        setEnviando(true)
        setMensaje(null)

        try {
            const forminit = new Forminit()
            const formData = new FormData(formRef.current)
            const { data, error } = await forminit.submit(FORM_ID, formData)

            if (error) {
                setMensaje({ tipo: 'error', texto: 'Error: ' + error.message })
                return
            }

            setMensaje({ tipo: 'exito', texto: '¡Consulta enviada correctamente!' })
            formRef.current.reset()
            setPreviews([])
        } catch (err) {
            setMensaje({ tipo: 'error', texto: 'Error inesperado: ' + err.message })
        } finally {
            setEnviando(false)
        }
    }

    return (
        <motion.section id="contacto" className="contact" {...fadeInUp}>
            <div className="container">
                <h2 className="section-title">Reserva Tu Cita</h2>
                <p className="section-subtitle">Hablemos de tu próximo tatuaje</p>

                <div className="contact-content">
                    <div className="tattoo-form-container">
                        <form ref={formRef} className="tattoo-form" onSubmit={manejarEnvio}>
                            <h2>Consulta tu idea</h2>

                            <div className="form-group">
                                <input type="text" name="fi-sender-fullName" placeholder="Nombre" required />
                            </div>

                            <div className="form-group">
                                <input type="text" name="fi-sender-email" placeholder="Email / Teléfono" required />
                            </div>

                            <div className="form-group">
                                <textarea name="fi-text-idea" rows="4" placeholder="Describe tu idea" required></textarea>
                            </div>

                            <div className="form-group">
                                <label>Imágenes de referencia (máx. 5)</label>
                                <input
                                    type="file"
                                    name="fi-file-images"
                                    multiple
                                    accept="image/*"
                                    onChange={manejarCambioImagenes}
                                />
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', minHeight: '10px' }}>
                                    {previews.map((src, index) => (
                                        <img
                                            key={index}
                                            src={src}
                                            style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="fi-checkbox-consent" required />
                                    He leído y acepto la <a href="/privacy.html" target="_blank">Política de Privacidad</a>.
                                </label>
                            </div>

                            {mensaje && (
                                <div
                                    className="form-message"
                                    style={{
                                        margin: '10px 0',
                                        fontWeight: 'bold',
                                        color: mensaje.tipo === 'error' ? '#dc3545' : '#28a745',
                                    }}
                                >
                                    {mensaje.texto}
                                </div>
                            )}

                            <button type="submit" disabled={enviando}>
                                {enviando ? 'Enviando...' : 'Enviar consulta'}
                            </button>
                        </form>
                    </div>

                    <div className="contact-info">
                        <div className="contact-item">
                            <div className="contact-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </div>
                            <div className="contact-details">
                                <h3>WhatsApp</h3>
                                <a href="https://wa.me/34610609038?text=Hola,%20me%20gustaría%20reservar%20una%20cita" target="_blank" rel="noopener noreferrer">
                                    +34 610 609 038
                                </a>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                            <div className="contact-details">
                                <h3>Instagram</h3>
                                <a href="https://instagram.com/jtoyo.inks" target="_blank" rel="noopener noreferrer">
                                    @jtoyo.inks
                                </a>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                            </div>
                            <div className="contact-details">
                                <h3>Ubicación</h3>
                                <p>Barcelona, España / (Guest)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default Contacto