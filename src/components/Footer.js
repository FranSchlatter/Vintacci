const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between">
                <div>
                    <p className="text-sm">© 2024 Vintacci. Todos los derechos reservados.</p>
                </div>
                <div className="flex space-x-4">
                    <p>Sobre Nosotros</p>
                    <p>Contactar</p>
                    <p>Política de Privacidad</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
