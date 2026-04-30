import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, GraduationCap, Users, UserCheck, 
  Tag, Building2, IdCard, Settings 
} from 'lucide-react';

const navItems = [
  {
    section: 'Principal',
    links: [
      { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Tableau de bord', roles: ['administrateur', 'responsable'] },
    ],
  },
  {
    section: 'Gestion',
    links: [
      { to: '/formations',  icon: <GraduationCap size={18} />, label: 'Formations',   roles: ['administrateur', 'utilisateur', 'responsable', 'simple utilisateur'] },
      { to: '/participants', icon: <Users size={18} />, label: 'Participants', roles: ['administrateur', 'utilisateur', 'responsable', 'simple utilisateur'] },
      { to: '/formateurs',  icon: <UserCheck size={18} />, label: 'Formateurs',  roles: ['administrateur', 'utilisateur', 'responsable', 'simple utilisateur'] },
    ],
  },
  {
    section: 'Référentiels',
    links: [
      { to: '/domaines',   icon: <Tag size={18} />,  label: 'Domaines',   roles: ['administrateur'] },
      { to: '/structures', icon: <Building2 size={18} />,  label: 'Structures',  roles: ['administrateur'] },
      { to: '/profils',    icon: <IdCard size={18} />,  label: 'Profils',     roles: ['administrateur'] },
    ],
  },
  {
    section: 'Administration',
    links: [
      { to: '/utilisateurs', icon: <Settings size={18} />, label: 'Utilisateurs', roles: ['administrateur'] },
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
