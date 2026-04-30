import React, { useState, useEffect } from 'react';
import Topbar from '../components/Layout/Topbar';
import Footer from '../components/Layout/Footer';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

const emptyForm = { login: '', password: '', roleId: '' };

export default function UtilisateursPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', item: null });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  const fetchAll = async () => {
    try {
      const [u, r] = await Promise.all([
        api.get('/api/utilisateurs'),
        api.get('/api/roles'),
      ]);
      setUsers(u.data);
      setRoles(r.data);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setForm(emptyForm); setErrors({}); setModal({ open: true, mode: 'add', item: null }); };
  const openEdit = (item) => {
    setForm({ login: item.login || '', password: '', roleId: item.role?.id || '' });
    setErrors({});
    setModal({ open: true, mode: 'edit', item });
  };
  const closeModal = () => setModal({ open: false, mode: 'add', item: null });

  const validate = () => {
    const e = {};
    if (!form.login.trim()) e.login = 'Le login est obligatoire';
    if (modal.mode === 'add' && !form.password.trim()) e.password = 'Le mot de passe est obligatoire';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const selectedRole = roles.find((r) => String(r.id) === String(form.roleId));
    const payload = {
      login: form.login,
      ...(form.password ? { password: form.password } : {}),
      role: selectedRole || null,
    };
    try {
      if (modal.mode === 'add') {
        await api.post('/api/utilisateurs', payload);
        toast.success('Utilisateur créé !');
      } else {
        await api.put(`/api/utilisateurs/${modal.item.id}`, payload);
        toast.success('Utilisateur mis à jour !');
      }
      closeModal(); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/utilisateurs/${deleteModal.item.id}`);
      toast.success('Utilisateur supprimé');
      setDeleteModal({ open: false, item: null }); fetchAll();
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  const roleBadgeClass = (roleName) => {
    const r = roleName?.toLowerCase();
    if (r === 'administrateur') return 'badge badge-purple';
    if (r === 'utilisateur') return 'badge badge-blue';
    if (r === 'manager') return 'badge badge-green';
    return 'badge badge-gray';
  };

  const columns = [
    { header: '#', key: 'id', render: (r) => <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>#{r.id}</span> },
    { header: 'Login', accessor: 'login' },
    { header: 'Rôle', key: 'role', render: (r) => r.role
      ? <span className={roleBadgeClass(r.role.nom)}>{r.role.nom}</span>
      : '—' },
  ];

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((p) => ({ ...p, [name]: e.target.value })),
    error: errors[name],
  });

  return (
    <>
      <Topbar breadcrumbs={['Paramètres', 'Utilisateurs']} />
      <div className="app-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Utilisateurs</h1>
            <p className="page-subtitle">Gérer les comptes et accès (Admin uniquement)</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Nouvel utilisateur
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <DataTable columns={columns} data={users} onEdit={openEdit}
              onDelete={(item) => setDeleteModal({ open: true, item })} />
          </div>
        )}

        <Modal isOpen={modal.open} onClose={closeModal}
          title={modal.mode === 'add' ? 'Nouvel utilisateur' : 'Modifier l\'utilisateur'}
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
            <FormField label="Login" required {...field('login')} placeholder="Identifiant de connexion" />
            <FormField label={modal.mode === 'add' ? 'Mot de passe' : 'Nouveau mot de passe (optionnel)'}
              type="password" required={modal.mode === 'add'} {...field('password')} placeholder="••••••••" />
            <FormField label="Rôle"
              options={roles.map((r) => ({ value: r.id, label: r.nom }))}
              {...field('roleId')} />
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
          <p>Supprimer l'utilisateur <strong>«{deleteModal.item?.login}»</strong> ?</p>
        </Modal>

        <Footer />
      </div>
    </>
  );
}
