import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Search, Bell, Plus } from 'lucide-react';

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

export default function Topbar({ breadcrumbs }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.login ? user.login.slice(0, 2).toUpperCase() : '?';
  const role = user?.role?.toLowerCase() || '';

  return (
    <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 500 }}>
        {breadcrumbs?.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <span style={{ color: idx === breadcrumbs.length - 1 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
              {crumb}
            </span>
            {idx < breadcrumbs.length - 1 && <span style={{ color: 'var(--color-border)' }}>/</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="topbar-search" style={{ position: 'relative', width: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Global Search..." 
            className="form-input" 
            style={{ paddingLeft: '36px', height: '36px', borderRadius: '18px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          />
        </div>

        <button className="btn-icon" style={{ position: 'relative' }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: '2px', right: '4px', width: '8px', height: '8px', backgroundColor: 'var(--color-error)', borderRadius: '50%' }}></span>
        </button>

        <button className="btn btn-primary btn-sm" style={{ padding: '6px 12px', borderRadius: '18px' }} onClick={() => navigate('/formations')}>
          <Plus size={16} /> Quick Action
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 8px' }}></div>

        <div className="topbar-user" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="topbar-user-info" style={{ textAlign: 'right' }}>
            <span className="topbar-username" style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>{user?.login}</span>
            <span className={roleBadges[role] || 'badge badge-gray'} style={{ fontSize: '11px', padding: '2px 6px' }}>
              {roleLabels[role] || role}
            </span>
          </div>
          <div className="topbar-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
            {initials}
          </div>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Déconnexion">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
