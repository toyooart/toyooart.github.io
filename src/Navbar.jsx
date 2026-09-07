import { useEffect, useState } from "react";

function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [oculto, setOculto] = useState(false);

    useEffect(() => {
        const hero = document.getElementById("home");

        const handleScroll = () => {
            if (!hero) return;

            const heroBottom = hero.offsetTop + hero.offsetHeight;

            // Se oculta cuando termina el hero
            setOculto(window.scrollY > heroBottom - 80);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            id="navbar"
            className={`navbar ${oculto ? "hide" : "show"}`}
        >
            <div className="nav-container">
                <div className="nav-logo">
                    <a href="#home">
                        <img
                            src="/assets/images/logo.webp"
                            alt="Toyooner Logo"
                            className="logo-img"
                        />
                    </a>
                </div>

                <button
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    className="nav-toggle"
                    aria-label="Abrir menú"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={menuAbierto ? "nav-menu active" : "nav-menu"}>
                    <li><a href="#portfolio" className="nav-link">Portfolio</a></li>
                    <li><a href="#sobre-mi" className="nav-link">Sobre Mí</a></li>
                    <li><a href="#contacto" className="nav-link">Contacto</a></li>
                    <li><a href="#faq" className="nav-link">FAQ</a></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;