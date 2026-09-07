import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp } from './motionVariants'

const preguntas = [
    {
        pregunta: '¿Cómo puedo reservar una cita?',
        respuesta: 'Puedes reservar tu cita contactándome directamente por WhatsApp al +34 610 609 038 o a través de Instagram @jtoyo.inks. También puedes usar el formulario de contacto en esta página. Te responderé lo antes posible para coordinar fecha y horario.'
    },
    {
        pregunta: '¿Cuánto cuesta un tatuaje?',
        respuesta: 'El precio varía según el tamaño, complejidad y tiempo estimado del diseño, te daré un presupuesto personalizado después de ver tu idea y referencias.'
    },
    {
        pregunta: '¿Necesito dejar un depósito?',
        respuesta: 'Sí, se requiere un depósito para reservar tu cita. Este depósito se descuenta del precio final del tatuaje. El depósito no es reembolsable en caso de cancelación con menos de 48 horas de antelación'
    },
    {
        pregunta: '¿Cuánto tiempo tarda en sanar un tatuaje?',
        respuesta: 'La sanación superficial tarda entre 2-3 semanas, pero la sanación completa puede tomar hasta 2-3 meses. Te proporcionaré instrucciones detalladas de cuidado después de tu sesión. Es importante seguir estas indicaciones para asegurar la mejor sanación y resultado final.'
    },
    {
        pregunta: '¿Puedo traer mi propio diseño?',
        respuesta: '¡Por supuesto! Puedes traer tus propias ideas, referencias o diseños. Trabajaré contigo para adaptar el diseño a tu piel y asegurarme de que el resultado sea perfecto. También puedo crear diseños personalizados desde cero basándome en tus ideas.'
    },
    {
        pregunta: '¿Qué debo hacer antes de mi cita?',
        respuesta: 'Asegúrate de comer bien antes de tu cita, mantente hidratado y descansa bien la noche anterior. Evita el alcohol 24 horas antes. Usa ropa cómoda que permita acceso fácil a la zona a tatuar. Si tienes alguna condición médica o tomas medicamentos, infórmame con antelación.'
    },
    {
        pregunta: '¿Puedo cancelar o reprogramar mi cita?',
        respuesta: 'Puedes reprogramar tu cita avisando con al menos 48 horas de antelación. Si cancelas con menos de 48 horas de aviso, el depósito no será reembolsable. Entiendo que pueden surgir imprevistos, así que comunícate conmigo lo antes posible si necesitas hacer cambios.'
    },
    {
        pregunta: '¿Trabajas con diseños a color o solo en negro?',
        respuesta: 'Trabajo principalmente en negro y grises, pero si tu diseño lo pide, puedo incorporar color. Cada tatuaje es único: hablemos de tu idea y encontraremos la mejor manera de hacerla realidad.'
    },
]

function Faq() {
    const [mostrarLista, setMostrarLista] = useState(false)
    const [abierta, setAbierta] = useState(null)

    return (
        <motion.section id="faq" className="faq" {...fadeInUp}>
            <div className="container">

                <h2 className="section-title">
                    Preguntas Frecuentes
                </h2>

                <button
                    className="section-subtitle"
                    onClick={() => setMostrarLista(!mostrarLista)}
                >
                    Todo lo que necesitas saber antes de tu cita
                </button>

                <AnimatePresence>
                    {mostrarLista && (
                        <motion.div
                            className="faq-list"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                        >
                            {preguntas.map((item, index) => (
                                <div className="faq-item" key={index}>

                                    <button
                                        className="faq-question"
                                        onClick={() =>
                                            setAbierta(
                                                abierta === index ? null : index
                                            )
                                        }
                                    >
                                        <span>{item.pregunta}</span>
                                    </button>

                                    <AnimatePresence>
                                        {abierta === index && (
                                            <motion.div
                                                className="faq-answer"
                                                initial={{
                                                    height: 0,
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    height: 'auto',
                                                    opacity: 1
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0
                                                }}
                                                transition={{
                                                    duration: 0.3
                                                }}
                                                style={{
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <p>{item.respuesta}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.section>
    )
}

export default Faq