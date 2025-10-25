import React from 'react';
import Loading from '../Common/Loading';

const CompanyList = ({ companies = [], onEdit = () => {}, onDelete = () => {}, loading = false }) => {
  const handleDelete = (company) => {
    if (window.confirm(`Delete "${company.name}"? This action cannot be undone.`)) {
      onDelete(company._id || company.id);
    }
  };

  if (loading && companies.length === 0) {
    return <Loading message="Loading companies..." />;
  }

  if (companies.length === 0) {
    return (
      <div className="text-center mt-3">
        <p>No companies found.</p>
      </div>
    );
  }

  return (
    <div className="company-list overflow-auto">
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Position</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Industry</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Contact</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Website</th>
            <th style={{ textAlign: 'right', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c._id || c.id} style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '8px', verticalAlign: 'top' }}>{c.name}</td>
              <td style={{ padding: '8px', verticalAlign: 'top' }}>
                <a href={`mailto:${c.email}`} onClick={(e) => !c.email && e.preventDefault()}>
                  {c.email || '—'}
                </a>
              </td>
              <td style={{ padding: '8px', verticalAlign: 'top' }}>{c.position || '—'}</td>
              <td style={{ padding: '8px', verticalAlign: 'top' }}>{c.industry || '—'}</td>
              <td style={{ padding: '8px', verticalAlign: 'top' }}>{c.contactPerson || '—'}</td>
              <td style={{ padding: '8px', verticalAlign: 'top' }}>
                {c.website ? (
                  <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer">
                    Visit
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td  style={{ padding: '8px', verticalAlign: 'top', textAlign: 'right' }}>
                <button
                  type="button"
                  className="btn w-50"
                  onClick={() => onEdit(c)}
                  style={{ marginRight: '0.5rem',marginBottom:'0.5rem', width:'fit-content' }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger w-50"
                  onClick={() => handleDelete(c)}
                  disabled={loading}
                   style={{ width:'fit-content' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default CompanyList;