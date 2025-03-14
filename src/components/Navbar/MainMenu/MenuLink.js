// Navbar/MainMenu/MenuLink.js
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

const MenuLink = ({ to, label }) => {
  // Esto resuelve la ruta completa teniendo en cuenta rutas relativas
  const resolvedPath = useResolvedPath(to);
  // Verifica si la ruta actual coincide con este enlace
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link 
      to={to} 
      className={`
        relative px-2 py-1 text-gray-700 transition-all duration-300
        hover:text-black
        after:content-[''] after:absolute after:w-0 after:h-0.5 
        after:bg-black after:left-0 after:bottom-0 
        after:transition-all after:duration-300
        hover:after:w-full
        ${isActive ? 'text-black font-medium after:w-full' : ''}
      `}
    >
      {label}
    </Link>
  );
};

export default MenuLink;