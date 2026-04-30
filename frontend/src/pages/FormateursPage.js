import React, { useState, useEffect } from 'react';
import Topbar from '../components/Layout/Topbar';
import Footer from '../components/Layout/Footer';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const emptyForm = { nom: '', prenom: '', email: '', tel: '', type: '', employeurId: '' };
const typeOptions = [
  { value: 'interne', label: 'Interne' },
  { value: 'externe', label: 'Externe' },
];

export default function FormateursPage() {
  const { hasRole } = useAuth();
  const [formateurs, setFormateurs] = useState([]);
  const [employeurs, setEmployeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', item: null });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [typeFilter, setTypeFilter] = useState('');

  const fetchAll = async () => {
    try {
      const [f, e] = await Promise.all([
        api.get('/api/formateurs'),
        api.get('/api/employeurs'),
      ]);
      setFormateurs(f.data);
      setEmployeurs(e.data);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = typeFilter
    ? formateurs.filter((f) => f.type?.toLowerCase() === typeFilter)
    : formateurs;

  const openAdd = () => { setForm(emptyForm); setErrors({}); setModal({ open: true, mode: 'add', item: null }); };
  const openEdit = (item) => {
    setForm({
      nom: item.nom || '', prenom: item.prenom || '',
      email: item.email || '', tel: item.tel || '',
      type: item.type || '', employeurId: item.employeur?.id || '',
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
      nom: form.nom, prenom: form.prenom,
      email: form.email || null, tel: form.tel || null,
      type: form.type || null,
      employeurId: form.employeurId ? Number(form.employeurId) : null,
    };
    try {
      if (modal.mode === 'add') {
        await api.post('/api/formateurs', payload);
        toast.success('Formateur créé !');
      } else {
        await api.put(`/api/formateurs/${modal.item.id}`, payload);
        toast.success('Formateur mis à jour !');
      }
      closeModal(); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/formateurs/${deleteModal.item.id}`);
      toast.success('Formateur supprimé');
      setDeleteModal({ open: false, item: null }); fetchAll();
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  const columns = [
    { header: 'Nom', accessor: 'nom' },
    { header: 'Prénom', accessor: 'prenom' },
    { header: 'Email', accessor: 'email' },
    { header: 'Téléphone', accessor: 'tel' },
    { header: 'Type', key: 'type', render: (r) => r.type
      ? <span className={`badge ${r.type === 'interne' ? 'badge-green' : 'badge-orange'}`}>{r.type}</span>
      : '—' },
    { header: 'Employeur', key: 'employeur', render: (r) => r.employeur?.nom || '—' },
  ];

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((p) => ({ ...p, [name]: e.target.value })),
    error: errors[name],
  });

  const isReadOnly = hasRole('responsable');

  return (
    <>
      <Topbar breadcrumbs={['Gestion', 'Formateurs']} />
      <div className="app-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Formateurs</h1>
            <p className="page-subtitle">Gérer les intervenants et formateurs</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select className="form-select" style={{ width: 150 }} value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)} id="formateur-type-filter">
              <option value="">Tous les types</option>
              <option value="interne">Interne</option>
              <option value="externe">Externe</option>
            </select>
            {!isReadOnly && (
              <button className="btn btn-primary" onClick={openAdd} id="add-formateur-btn">
                <Plus size={16} /> Nouveau formateur
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <DataTable columns={columns} data={filtered} onEdit={isReadOnly ? null : openEdit}
              onDelete={isReadOnly ? null : (item) => setDeleteModal({ open: true, item })} />
          </div>
        )}

        <Modal isOpen={modal.open} onClose={closeModal}
          title={modal.mode === 'add' ? 'Nouveau formateur' : 'Modifier le formateur'}
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
            <FormField label="Type" options={typeOptions} {...field('type')} />
            <FormField label="Employeur"
              options={employeurs.map((e) => ({ value: e.id, label: e.nom }))}
              {...field('employeurId')} />
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

        <Footer />
      </div>
    </>
  );
}
