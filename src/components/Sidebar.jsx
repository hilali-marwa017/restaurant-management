import { NavLink } from 'react-router-dom';
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>🍽️ Restaurant</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/tableau-bord" className="nav-btn">
          <span className="icon">📊</span>
          <span>Tableau de Bord</span>
        </NavLink>
        <NavLink to="/menu" className="nav-btn">
          <span className="icon">📋</span>
          <span>Menu</span>
        </NavLink>
        <NavLink to="/reservations" className="nav-btn">
          <span className="icon">📅</span>
          <span>Réservations</span>
        </NavLink>
        <NavLink to="/commandes" className="nav-btn">
          <span className="icon">🛎️</span>
          <span>Commandes</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;