import React, { useState, useEffect, useCallback } from 'react';
import Topbar from '../components/Layout/Topbar';
import api from '../api/axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#f59e0b','#22c55e','#ef4444','#ec4899'];

const currentYear = new Date().getFullYear();

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [formations, setFormations] = useState([]);
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, formationsRes] = await Promise.all([
        api.get('/api/stats/dashboard' + (year ? `?annee=${year}` : '')),
        api.get('/api/formations'),
      ]);
      setStats(statsRes.data);
      setFormations(formationsRes.data);
    } catch (err) {
      console.error('Dashboard fetch error', err);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Group by domain for pie chart
  const byDomain = formations.reduce((acc, f) => {
    const label = f.domaine?.libelle || 'Non défini';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const domainData = Object.entries(byDomain).map(([name, value]) => ({ name, value }));

  // Group by year for bar chart
  const byYear = formations.reduce((acc, f) => {
    const y = f.annee || 'N/A';
    acc[y] = (acc[y] || 0) + 1;
    return acc;
  }, {});
  const yearData = Object.entries(byYear)
    .sort(([a], [b]) => a - b)
    .map(([name, value]) => ({ name, value }));

  const statCards = stats
    ? [
        { label: 'Formations', value: stats.totalFormations,    icon: '🎓', bg: '#eef2ff', color: '#6366f1' },
        { label: 'Participants', value: stats.totalParticipants, icon: '👥', bg: '#f0fdf4', color: '#22c55e' },
        { label: 'Formateurs',  value: stats.totalFormateurs,    icon: '👨‍🏫', bg: '#fff7ed', color: '#f59e0b' },
        { label: 'Budget total', value: `${(stats.budgetTotal || 0).toLocaleString('fr-FR')} DA`,
          icon: '💰', bg: '#fdf4ff', color: '#a855f7' },
      ]
    : [];

  return (
    <>
      <Topbar title="Tableau de bord" />
      <div className="app-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Vue d'ensemble</h1>
            <p className="page-subtitle">Statistiques globales des formations</p>
          </div>
          <select
            className="form-select"
            style={{ width: 140 }}
            value={year}
            onChange={(e) => { setYear(e.target.value); setLoading(true); }}
            id="dashboard-year-filter"
          >
            <option value="">Toutes années</option>
            {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="stats-grid">
              {statCards.map((card) => (
                <div className="stat-card" key={card.label}>
                  <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                    {card.icon}
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{card.value}</div>
                    <div className="stat-label">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3 className="chart-title">📊 Formations par domaine</h3>
                {domainData.length === 0 ? (
                  <div className="empty-state"><p>Aucune donnée</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={domainData}
                        cx="50%" cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {domainData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="chart-card">
                <h3 className="chart-title">📅 Formations par année</h3>
                {yearData.length === 0 ? (
                  <div className="empty-state"><p>Aucune donnée</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={yearData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" name="Formations" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
