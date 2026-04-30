import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Topbar from '../components/Layout/Topbar';
import api from '../api/axios';
import { formatCurrencyTND, formatNumber } from '../utils/formatters';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { GraduationCap, Users, Briefcase, Wallet } from 'lucide-react';

// Strict color palette matching the SaaS design tokens
const COLORS = {
  primary: '#0B1F3A',
  secondary: '#3A506B',
  accent: '#2EC4B6',
  accentDark: '#25A599',
  muted: '#94A3B8',
  chartPalette: ['#0B1F3A', '#2EC4B6', '#3A506B', '#E2E8F0', '#64748B']
};

export default function DashboardPage() {
  const [allFormations, setAllFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    year: '',
    domain: '',
    structure: '',
    trainerType: ''
  });

  const fetchData = useCallback(async () => {
    try {
      // Fetch all data once to enable instant client-side cross-filtering
      const res = await api.get('/api/formations');
      setAllFormations(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Derived Filter Options (Unique values from the dataset)
  const filterOptions = useMemo(() => {
    const years = new Set();
    const domains = new Set();
    const structures = new Set();
    const trainerTypes = new Set();

    allFormations.forEach(f => {
      if (f.annee) years.add(f.annee);
      if (f.domaine?.libelle) domains.add(f.domaine.libelle);
      if (f.formateur?.type) trainerTypes.add(f.formateur.type);
      if (f.participants) {
        f.participants.forEach(p => {
          if (p.structure?.libelle) structures.add(p.structure.libelle);
        });
      }
    });

    return {
      years: Array.from(years).sort((a, b) => b - a),
      domains: Array.from(domains).sort(),
      structures: Array.from(structures).sort(),
      trainerTypes: Array.from(trainerTypes).sort()
    };
  }, [allFormations]);

  // Apply filters to get the active dataset
  const activeFormations = useMemo(() => {
    return allFormations.filter(f => {
      if (filters.year && String(f.annee) !== String(filters.year)) return false;
      if (filters.domain && f.domaine?.libelle !== filters.domain) return false;
      if (filters.trainerType && f.formateur?.type !== filters.trainerType) return false;
      if (filters.structure) {
        const hasStructure = f.participants?.some(p => p.structure?.libelle === filters.structure);
        if (!hasStructure) return false;
      }
      return true;
    });
  }, [allFormations, filters]);

  // Calculate reactive KPIs
  const kpis = useMemo(() => {
    const uniqueParticipants = new Set();
    const uniqueTrainers = new Set();
    let totalBudget = 0;

    activeFormations.forEach(f => {
      totalBudget += f.budget || 0;
      if (f.formateur?.id) uniqueTrainers.add(f.formateur.id);
      if (f.participants) {
        f.participants.forEach(p => uniqueParticipants.add(p.id));
      }
    });

    return {
      formations: activeFormations.length,
      participants: uniqueParticipants.size,
      trainers: uniqueTrainers.size,
      budget: totalBudget
    };
  }, [activeFormations]);

  // Chart Data: Formations by Domain
  const domainData = useMemo(() => {
    const counts = {};
    activeFormations.forEach(f => {
      const label = f.domaine?.libelle || 'Inconnu';
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [activeFormations]);

  // Chart Data: Budget by Year
  const budgetByYearData = useMemo(() => {
    const sums = {};
    activeFormations.forEach(f => {
      const y = f.annee || 'N/A';
      sums[y] = (sums[y] || 0) + (f.budget || 0);
    });
    return Object.entries(sums)
      .map(([name, value]) => ({ name: String(name), value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeFormations]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Custom Tooltip component for Recharts to ensure TND formatting
  const CurrencyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="custom-tooltip-label">{label}</p>
          <p className="custom-tooltip-value">
            {formatCurrencyTND(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Topbar title="Analytics" />
      <div className="app-content">
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="page-title">Tableau de Bord</h1>
            <p className="page-subtitle">Aperçu en temps réel des indicateurs de performance</p>
          </div>
        </div>

        {/* Reactive Filters Bar */}
        <div className="filters-bar">
          <div className="filter-item">
            <label>Année</label>
            <select className="form-select" value={filters.year} onChange={(e) => handleFilterChange('year', e.target.value)}>
              <option value="">Toutes les années</option>
              {filterOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="filter-item">
            <label>Domaine</label>
            <select className="form-select" value={filters.domain} onChange={(e) => handleFilterChange('domain', e.target.value)}>
              <option value="">Tous les domaines</option>
              {filterOptions.domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="filter-item">
            <label>Structure (Participants)</label>
            <select className="form-select" value={filters.structure} onChange={(e) => handleFilterChange('structure', e.target.value)}>
              <option value="">Toutes les structures</option>
              {filterOptions.structures.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="filter-item">
            <label>Type Formateur</label>
            <select className="form-select" value={filters.trainerType} onChange={(e) => handleFilterChange('trainerType', e.target.value)}>
              <option value="">Tous les types</option>
              {filterOptions.trainerTypes.map(t => <option key={t} value={t}>{t === 'interne' ? 'Interne' : 'Externe'}</option>)}
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Formations', value: formatNumber(kpis.formations), icon: <GraduationCap size={24} /> },
            { label: 'Participants', value: formatNumber(kpis.participants), icon: <Users size={24} /> },
            { label: 'Formateurs', value: formatNumber(kpis.trainers), icon: <Briefcase size={24} /> },
            { label: 'Budget Global', value: formatCurrencyTND(kpis.budget), isCurrency: true, icon: <Wallet size={24} /> }
          ].map((stat, idx) => (
            <div className="stat-card" key={idx}>
              {loading ? (
                <>
                  <div className="skeleton skeleton-row" style={{ width: '40%' }}></div>
                  <div className="skeleton skeleton-row" style={{ width: '80%', height: '32px', marginTop: '12px' }}></div>
                </>
              ) : (
                <>
                  <div className="stat-header">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-icon">{stat.icon}</div>
                  </div>
                  <div className="stat-value" style={{ color: stat.isCurrency ? COLORS.accentDark : COLORS.primary, fontSize: stat.isCurrency ? '24px' : '32px' }}>
                    {stat.value}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Répartition par Domaine</h3>
            {loading ? (
              <div className="skeleton skeleton-card" style={{ height: '280px' }}></div>
            ) : domainData.length === 0 ? (
              <div className="empty-state"><p>Aucune donnée disponible pour ces filtres</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={domainData}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {domainData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS.chartPalette[idx % COLORS.chartPalette.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(11, 31, 58, 0.08)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Évolution du Budget</h3>
            {loading ? (
              <div className="skeleton skeleton-card" style={{ height: '280px' }}></div>
            ) : budgetByYearData.length === 0 ? (
              <div className="empty-state"><p>Aucune donnée disponible pour ces filtres</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={budgetByYearData} margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fill: COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis 
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
                    tick={{ fill: COLORS.muted, fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                    dx={-10}
                  />
                  <RechartsTooltip content={<CurrencyTooltip />} cursor={{ fill: '#F1F5F9' }} />
                  <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
