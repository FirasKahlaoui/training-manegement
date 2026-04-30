import React, { useState, useEffect } from 'react';
import Topbar from '../components/Layout/Topbar';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const emptyForm = { nom: '', prenom: '', email: '', tel: '', profilId: '', structureId: '' };

export default function ParticipantsPage() {
  const { hasRole } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [profils, setProfils] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', item: null });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  const fetchAll = async () => {
    try {
      const [p, pr, s] = await Promise.all([
        api.get('/api/participants'),
        api.get('/api/profils'),
        api.get('/api/structures'),
      ]);
      setParticipants(p.data);
      setProfils(pr.data);
      setStructures(s.data);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setForm(emptyForm); setErrors({}); setModal({ open: true, mode: 'add', item: null }); };
  const openEdit = (item) => {
    setForm({
      nom: item.nom || '', prenom: item.prenom || '',
      email: item.email || '', tel: item.tel || '',
      profilId: item.profil?.id || '', structureId: item.structure?.id || '',
    });
    setErrors({});
    setModal({ open: true, mode: 'edit', item });
  };
  const closeModal = () => setModal({ open: false, mode: 'add', item: null });

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Le nom est obligatoire';
    if (!form.prenom.trim()) e.prenom = 'Le prénom est obligatoire';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      nom: form.nom, prenom: form.prenom, email: form.email || null,
      tel: form.tel || null,
      profilId: form.profilId ? Number(form.profilId) : null,
      structureId: form.structureId ? Number(form.structureId) : null,
    };
    try {
      if (modal.mode === 'add') {
        await api.post('/api/participants', payload);
        toast.success('Participant ajouté !');
      } else {
        await api.put(`/api/participants/${modal.item.id}`, payload);
        toast.success('Participant mis à jour !');
      }
      closeModal(); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/participants/${deleteModal.item.id}`);
      toast.success('Participant supprimé');
      setDeleteModal({ open: false, item: null }); fetchAll();
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  const columns = [
    { header: 'Nom', accessor: 'nom' },
    { header: 'Prénom', accessor: 'prenom' },
    { header: 'Email', accessor: 'email' },
    { header: 'Téléphone', accessor: 'tel' },
    { header: 'Profil', key: 'profil', render: (r) => r.profil ? <span className="badge badge-blue">{r.profil.libelle}</span> : '—' },
    { header: 'Structure', key: 'structure', render: (r) => r.structure ? <span className="badge badge-gray">{r.structure.libelle}</span> : '—' },
  ];

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((p) => ({ ...p, [name]: e.target.value })),
    error: errors[name],
  });

  const isReadOnly = hasRole('responsable');

  return (
    <>
      <Topbar title="Participants" />
      <div className="app-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Participants</h1>
            <p className="page-subtitle">Gérer les participants aux formations</p>
          </div>
          {!isReadOnly && (
            <button className="btn btn-primary" onClick={openAdd} id="add-participant-btn">
              <Plus size={16} /> Nouveau participant
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <DataTable columns={columns} data={participants} onEdit={isReadOnly ? null : openEdit}
              onDelete={isReadOnly ? null : (item) => setDeleteModal({ open: true, item })} />
          </div>
        )}

        <Modal
          isOpen={modal.open} onClose={closeModal}
          title={modal.mode === 'add' ? 'Nouveau participant' : 'Modifier le participant'}
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
            <div className="form-grid form-grid-2">
              <FormField label="Nom" required {...field('nom')} />
              <FormField label="Prénom" required {...field('prenom')} />
            </div>
            <div className="form-grid form-grid-2">
              <FormField label="Email" type="email" {...field('email')} />
              <FormField label="Téléphone" {...field('tel')} />
            </div>
            <FormField label="Profil"
              options={profils.map((p) => ({ value: p.id, label: p.libelle }))}
              {...field('profilId')} />
            <FormField label="Structure"
              options={structures.map((s) => ({ value: s.id, label: s.libelle }))}
              {...field('structureId')} />
          </div>
        </Modal>

        <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, item: null })}
          title="Confirmer la suppression"
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setDeleteModal({ open: false, item: null })}>Annuler</button>
              <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
            </>
          }
        >
          <p>Supprimer <strong>{deleteModal.item?.nom} {deleteModal.item?.prenom}</strong> ?</p>
        </Modal>
      </div>
    </>
  );
}
