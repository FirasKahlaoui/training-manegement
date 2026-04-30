import React, { useState, useEffect } from 'react';
import Topbar from '../components/Layout/Topbar';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { titre: '', annee: '', duree: '', budget: '', domaineId: '', formateurId: '' };

export default function FormationsPage() {
  const [formations, setFormations] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', item: null });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  const fetchAll = async () => {
    try {
      const [f, d, fm] = await Promise.all([
        api.get('/api/formations'),
        api.get('/api/domaines'),
        api.get('/api/formateurs'),
      ]);
      setFormations(f.data);
      setDomaines(d.data);
      setFormateurs(fm.data);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => {
    setForm(emptyForm); setErrors({});
    setModal({ open: true, mode: 'add', item: null });
  };

  const openEdit = (item) => {
    setForm({
      titre: item.titre || '',
      annee: item.annee || '',
      duree: item.duree || '',
      budget: item.budget || '',
      domaineId: item.domaine?.id || '',
      formateurId: item.formateur?.id || '',
    });
    setErrors({});
    setModal({ open: true, mode: 'edit', item });
  };

  const closeModal = () => setModal({ open: false, mode: 'add', item: null });

  const validate = () => {
    const e = {};
    if (!form.titre.trim()) e.titre = 'Le titre est obligatoire';
    if (form.duree && Number(form.duree) <= 0) e.duree = 'Durée doit être positive';
    if (form.budget && Number(form.budget) <= 0) e.budget = 'Budget doit être positif';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      titre: form.titre,
      annee: form.annee ? Number(form.annee) : null,
      duree: form.duree ? Number(form.duree) : null,
      budget: form.budget ? Number(form.budget) : null,
      domaineId: form.domaineId ? Number(form.domaineId) : null,
      formateurId: form.formateurId ? Number(form.formateurId) : null,
    };
    try {
      if (modal.mode === 'add') {
        await api.post('/api/formations', payload);
        toast.success('Formation créée !');
      } else {
        await api.put(`/api/formations/${modal.item.id}`, payload);
        toast.success('Formation mise à jour !');
      }
      closeModal();
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/formations/${deleteModal.item.id}`);
      toast.success('Formation supprimée');
      setDeleteModal({ open: false, item: null });
      fetchAll();
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  const columns = [
    { header: 'Titre', accessor: 'titre' },
    { header: 'Année', accessor: 'annee' },
    { header: 'Durée (j)', accessor: 'duree' },
    { header: 'Budget', key: 'budget', render: (r) => r.budget ? `${r.budget.toLocaleString('fr-FR')} DA` : '—' },
    { header: 'Domaine', key: 'domaine', render: (r) => r.domaine ? (
      <span className="badge badge-purple">{r.domaine.libelle}</span>
    ) : '—' },
    { header: 'Formateur', key: 'formateur', render: (r) => r.formateur
      ? `${r.formateur.nom} ${r.formateur.prenom}` : '—' },
  ];

  const field = (name, label, ...rest) => ({
    value: form[name],
    onChange: (e) => setForm((p) => ({ ...p, [name]: e.target.value })),
    error: errors[name],
    label,
    ...rest[0],
  });

  return (
    <>
      <Topbar title="Formations" />
      <div className="app-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Formations</h1>
            <p className="page-subtitle">Gérer les sessions de formation</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd} id="add-formation-btn">
            ＋ Nouvelle formation
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <DataTable
              columns={columns}
              data={formations}
              onEdit={openEdit}
              onDelete={(item) => setDeleteModal({ open: true, item })}
            />
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modal.open}
          onClose={closeModal}
          title={modal.mode === 'add' ? '➕ Nouvelle formation' : '✏️ Modifier la formation'}
          footer={
            <>
              <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <FormField label="Titre" required {...field('titre', 'Titre')} />
            <div className="form-grid form-grid-2">
              <FormField label="Année" type="number" {...field('annee', 'Année')} placeholder="2025" />
              <FormField label="Durée (jours)" type="number" {...field('duree', 'Durée (jours)')} />
            </div>
            <FormField label="Budget (DA)" type="number" {...field('budget', 'Budget (DA)')} />
            <FormField
              label="Domaine"
              options={domaines.map((d) => ({ value: d.id, label: d.libelle }))}
              {...field('domaineId', 'Domaine')}
            />
            <FormField
              label="Formateur"
              options={formateurs.map((f) => ({ value: f.id, label: `${f.nom} ${f.prenom}` }))}
              {...field('formateurId', 'Formateur')}
            />
          </div>
        </Modal>

        {/* Delete Confirm */}
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, item: null })}
          title="🗑️ Confirmer la suppression"
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setDeleteModal({ open: false, item: null })}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
            </>
          }
        >
          <p>Êtes-vous sûr de vouloir supprimer la formation <strong>«{deleteModal.item?.titre}»</strong> ?</p>
        </Modal>
      </div>
    </>
  );
}
