import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import useIsMobile from '../utils/useIsMobile'; // Ruta donde guardes el hook

const WhatsAppButton = () => {
    const isMobile = useIsMobile();

    const phoneNumber = '5493424365585'; // Ej: 5491122334455
    const message = '¡Hola! Quisiera hacer una consulta.';
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`
                fixed z-50 
                ${isMobile ? 'bottom-4 left-4' : 'bottom-6 right-6'} 
                flex items-center 
                ${isMobile ? 'justify-center w-14 h-14' : 'bg-green-500 px-4 py-2'} 
                text-white rounded-full shadow-lg hover:bg-green-600 
                transition-all duration-300
            `}
        >
            <FaWhatsapp size={isMobile ? 28 : 22} />
            {!isMobile && <span className="ml-2 font-semibold">¡Hablá con nosotros!</span>}
        </a>
    );
};

export default WhatsAppButton;