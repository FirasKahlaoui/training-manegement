import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleLabels = {
  administrateur: 'Administrateur',
  utilisateur: 'Utilisateur',
  manager: 'Manager',
};

const roleBadges = {
  administrateur: 'badge badge-teal',
  utilisateur: 'badge badge-blue',
  manager: 'badge badge-green',
};

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.login
    ? user.login.slice(0, 2).toUpperCase()
    : '?';

  const role = user?.role?.toLowerCase() || '';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-user">
          <div className="topbar-avatar">{initials}</div>
          <div className="topbar-user-info">
            <span className="topbar-username">{user?.login}</span>
            <span className={roleBadges[role] || 'badge badge-gray'}>
              {roleLabels[role] || role}
            </span>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleLogout}
          id="logout-btn"
        >
          🚪 Déconnexion
        </button>
      </div>
    </header>
  );
}
