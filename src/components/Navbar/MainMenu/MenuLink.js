// Navbar/MainMenu/MenuLink.js
import { Link } from 'react-router-dom';

const MenuLink = ({ to, label }) => (
    <Link to={to} className="text-gray-700 hover:text-gray-900">
      {label}
    </Link>
  );

export default MenuLink;
