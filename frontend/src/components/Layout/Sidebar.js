import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  {
    section: 'Principal',
    links: [
      { to: '/dashboard', icon: '📊', label: 'Tableau de bord', roles: null },
    ],
  },
  {
    section: 'Gestion',
    links: [
      { to: '/formations',  icon: '🎓', label: 'Formations',   roles: ['administrateur','utilisateur'] },
      { to: '/participants', icon: '👥', label: 'Participants', roles: ['administrateur','utilisateur'] },
      { to: '/formateurs',  icon: '👨‍🏫', label: 'Formateurs',  roles: ['administrateur','utilisateur'] },
    ],
  },
  {
    section: 'Référentiels',
    links: [
      { to: '/domaines',   icon: '🏷️',  label: 'Domaines',   roles: ['administrateur','utilisateur'] },
      { to: '/structures', icon: '🏢',  label: 'Structures',  roles: ['administrateur','utilisateur'] },
      { to: '/profils',    icon: '🪪',  label: 'Profils',     roles: ['administrateur','utilisateur'] },
    ],
  },
  {
    section: 'Administration',
    links: [
      { to: '/utilisateurs', icon: '⚙️', label: 'Utilisateurs', roles: ['administrateur'] },
    ],
  },
];

export default function Sidebar() {
  const { hasRole } = useAuth();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">TM</div>
        <div className="sidebar-logo-text">
          TrainingMS
          <small>Gestion des formations</small>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((section) => {
          const visibleLinks = section.links.filter(
            (l) => !l.roles || hasRole(...l.roles)
          );
          if (visibleLinks.length === 0) return null;
          return (
            <div key={section.section}>
              <div className="sidebar-section-label">{section.section}</div>
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    'sidebar-link' + (isActive ? ' active' : '')
                  }
                >
                  <span className="icon">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
