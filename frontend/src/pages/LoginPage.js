import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, AlertTriangle, Loader2, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.login.trim() || !form.password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const user = await login({ login: form.login, password: form.password });
      toast.success(`Bienvenue, ${user.login} !`);
      const role = user.role?.toLowerCase();
      if (role === 'simple utilisateur') {
        navigate('/formations');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Identifiants incorrects. Veuillez réessayer.';
      setError(typeof msg === 'string' ? msg : 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon"><GraduationCap size={32} /></div>
          <h1>TrainingMS</h1>
          <p>Gestion des formations professionnelles</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="login-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} /> {error}</div>}
          <div className="form-grid" style={{ gap: 16, marginBottom: 24 }}>
            <div className="form-field">
              <label className="form-label" htmlFor="login-username">
                Identifiant
              </label>
              <input
                id="login-username"
                type="text"
                name="login"
                className="form-input"
                placeholder="Votre identifiant"
                value={form.login}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="login-password">
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
          </div>
          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={16} /> Connexion en cours...</>
            ) : (
              <><Lock size={16} /> Se connecter</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
