import React, { useState, useMemo } from 'react';

const PAGE_SIZE = 10;

export default function DataTable({ columns, data, onEdit, onDelete, searchable = true, searchPlaceholder = 'Rechercher...', loading = false }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = col.accessor ? row[col.accessor] : null;
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      {searchable && (
        <div className="search-bar" style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="search-input-wrapper" style={{ position: 'relative', width: '300px' }}>
            <span className="search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
            <input
              type="text"
              className="form-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={handleSearch}
              id="table-search-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key || col.header}>{col.header}</th>
              ))}
              {(onEdit || onDelete) && <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skel-${idx}`}>
                  {columns.map((col, i) => (
                    <td key={`skel-td-${i}`}><div className="skeleton skeleton-row" style={{ height: '16px', width: i === 0 ? '40px' : '80%' }}></div></td>
                  ))}
                  {(onEdit || onDelete) && <td><div className="skeleton skeleton-row" style={{ height: '16px', width: '40px', marginLeft: 'auto' }}></div></td>}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}>
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 600 }}>Aucune donnée</p>
                    <p style={{ marginTop: '4px' }}>Nous n'avons trouvé aucun enregistrement correspondant.</p>
                  </div>
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map((col) => (
                    <td key={col.key || col.header}>
                      {col.render ? col.render(row) : row[col.accessor] ?? '—'}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        {onEdit && (
                          <button className="btn-icon" title="Modifier" onClick={() => onEdit(row)}>✏️</button>
                        )}
                        {onDelete && (
                          <button className="btn-icon danger" title="Supprimer" onClick={() => onDelete(row)}>🗑️</button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          <span className="pagination-info">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => setPage(1)} disabled={currentPage === 1}>«</button>
            <button className="page-btn" onClick={() => setPage((p) => p - 1)} disabled={currentPage === 1}>‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
              if (p <= 0) return null;
              return (
                <button
                  key={p}
                  className={`page-btn${currentPage === p ? ' active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
            <button className="page-btn" onClick={() => setPage((p) => p + 1)} disabled={currentPage === totalPages}>›</button>
            <button className="page-btn" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>»</button>
          </div>
        </div>
      </div>
    </div>
  );
}
