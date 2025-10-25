// ...existing code...
import React, { useState, useEffect } from 'react';
import CompanyForm from './CompanyForm';
import CompanyList from './CompanyList';
import { useSecureAPI } from '../../hooks/useSecureAPI';
import ErrorMessage from '../Common/ErrorMessage';
import Loading from '../Common/Loading';
import apiAxios from '../../utils/api';
const CompanyManager = () => {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { callAPI, loading, error, clearError } = useSecureAPI();

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm]);

  const fetchCompanies = async () => {
    await callAPI(async () => {
      const { data } = await apiAxios.get(`/api/companies?search=${encodeURIComponent(searchTerm)}&limit=1000`);
      setCompanies(data.data?.companies || []);
    });
  };

  const handleCreateCompany = async (companyData) => {
    await callAPI(async () => {
      const response = await apiAxios.post('/api/companies', companyData);
      // assume success on 2xx
      if (response.status >= 200 && response.status < 300) {
        setShowForm(false);
        await fetchCompanies();
      } else {
        throw new Error(response.data?.message || 'Failed to create company');
      }
    });
  };

  const handleUpdateCompany = async (companyId, companyData) => {
    await callAPI(async () => {
      const response = await apiAxios.patch(`/api/companies/${companyId}`, companyData);
      if (response.status >= 200 && response.status < 300) {
        setEditingCompany(null);
        await fetchCompanies();
      } else {
        throw new Error(response.data?.message || 'Failed to update company');
      }
    });
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    await callAPI(async () => {
      const response = await apiAxios.delete(`/api/companies/${companyId}`);
      if (response.status >= 200 && response.status < 300) {
        await fetchCompanies();
      } else {
        throw new Error(response.data?.message || 'Failed to delete company');
      }
    });
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  if (loading && companies.length === 0) {
    return <Loading message="Loading companies..." />;
  }

  return (
    <div className="main-content">
      <div className="flex justify-between items-center mb-3">
        <h1>Company Management</h1>
        <button 
          className="btn"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
          Add Company
        </button>
      </div>

      <ErrorMessage message={error} onClose={clearError} />

      {showForm && (
        <CompanyForm
          company={editingCompany}
          onSubmit={editingCompany ? 
            (data) => handleUpdateCompany(editingCompany._id, data) : 
            handleCreateCompany
          }
          onClose={handleFormClose}
          loading={loading}
        />
      )}

      <div className="company-manager">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search companies by name, position, or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CompanyList
          companies={companies}
          onEdit={handleEdit}
          onDelete={handleDeleteCompany}
          loading={loading}
        />

        {companies.length === 0 && !loading && (
          <div className="text-center mt-3">
            <p>No companies found. Add your first company to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyManager;
// ...existing code...