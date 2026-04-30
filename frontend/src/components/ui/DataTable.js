import React, { useState, useMemo } from 'react';

const PAGE_SIZE = 10;

export default function DataTable({ columns, data, onEdit, onDelete, searchable = true, searchPlaceholder = 'Rechercher...' }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
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
        <div className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={handleSearch}
              id="table-search-input"
            />
          </div>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
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
              {(onEdit || onDelete) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>Aucune donnée trouvée</p>
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
                    <td>
                      <div className="table-actions">
                        {onEdit && (
                          <button
                            className="btn-icon"
                            title="Modifier"
                            onClick={() => onEdit(row)}
                          >
                            ✏️
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="btn-icon danger"
                            title="Supprimer"
                            onClick={() => onDelete(row)}
                          >
                            🗑️
                          </button>
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
            Page {currentPage} / {totalPages} — {filtered.length} enregistrement{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="pagination-controls">
            <button
              className="page-btn"
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
            >«</button>
            <button
              className="page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={currentPage === 1}
            >‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
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
            <button
              className="page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >›</button>
            <button
              className="page-btn"
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
            >»</button>
          </div>
        </div>
      </div>
    </div>
  );
}
