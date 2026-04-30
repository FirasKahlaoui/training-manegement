import React, { useState, useEffect } from 'react';
import Topbar from '../components/Layout/Topbar';
import Footer from '../components/Layout/Footer';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, X, Save } from 'lucide-react';

function SimpleCrudPage({ title, subtitle, apiPath, entityLabel, topbarTitle }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', item: null });
  const [libelle, setLibelle] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  const fetchAll = async () => {
    try { const res = await api.get(apiPath); setItems(res.data); }
    catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setLibelle(''); setError(''); setModal({ open: true, mode: 'add', item: null }); };
  const openEdit = (item) => { setLibelle(item.libelle || ''); setError(''); setModal({ open: true, mode: 'edit', item }); };
  const closeModal = () => setModal({ open: false, mode: 'add', item: null });

  const handleSave = async () => {
    if (!libelle.trim()) { setError('Le libellé est obligatoire'); return; }
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        await api.post(apiPath, { libelle });
        toast.success(`${entityLabel} créé !`);
      } else {
        await api.put(`${apiPath}/${modal.item.id}`, { libelle });
        toast.success(`${entityLabel} mis à jour !`);
      }
      closeModal(); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${apiPath}/${deleteModal.item.id}`);
      toast.success(`${entityLabel} supprimé`);
      setDeleteModal({ open: false, item: null }); fetchAll();
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  const columns = [
    { header: '#', key: 'id', render: (r) => <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>#{r.id}</span> },
    { header: 'Libellé', accessor: 'libelle' },
  ];

  return (
    <>
      <Topbar breadcrumbs={['Référentiels', topbarTitle]} />
      <div className="app-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd} id={`add-${apiPath.replace('/api/','')}-btn`}>
            ＋ {entityLabel}
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <DataTable columns={columns} data={items} onEdit={openEdit}
              onDelete={(item) => setDeleteModal({ open: true, item })} />
          </div>
        )}

        <Modal isOpen={modal.open} onClose={closeModal}
          title={modal.mode === 'add' ? `Ajouter un(e) ${entityLabel}` : `Modifier le/la ${entityLabel}`}
          footer={
            <>
              <button className="btn btn-ghost" onClick={closeModal}><X size={16} /> Annuler</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={16} /> {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </>
          }
        >
          <FormField label="Libellé" required value={libelle}
            onChange={(e) => setLibelle(e.target.value)} error={error} />
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
          <p>Supprimer <strong>«{deleteModal.item?.libelle}»</strong> ?</p>
        </Modal>

        <Footer />
      </div>
    </>
  );
}

export function DomainesPage() {
  return <SimpleCrudPage title="Domaines" subtitle="Gérer les domaines de formation"
    apiPath="/api/domaines" entityLabel="Domaine" topbarTitle="Domaines" />;
}

export function StructuresPage() {
  return <SimpleCrudPage title="Structures" subtitle="Gérer les structures / départements"
    apiPath="/api/structures" entityLabel="Structure" topbarTitle="Structures" />;
}

export function ProfilsPage() {
  return <SimpleCrudPage title="Profils" subtitle="Gérer les profils de postes"
    apiPath="/api/profils" entityLabel="Profil" topbarTitle="Profils" />;
}
