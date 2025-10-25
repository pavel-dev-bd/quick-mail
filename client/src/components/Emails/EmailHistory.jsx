import React, { useState, useEffect } from 'react';
import { useSecureAPI } from '../../hooks/useSecureAPI';
import ErrorMessage from '../Common/ErrorMessage';
import Loading from '../Common/Loading';
import apiAxios from '../../utils/api';
const EmailHistory = () => {
  const [history, setHistory] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const { callAPI, loading, error, clearError } = useSecureAPI();

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const fetchHistory = async () => {
     await callAPI(async () => {
    //   const queryParams = new URLSearchParams();
    //   if (filters.status) queryParams.append('status', filters.status);
    //   if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    //   if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);

    //   const response = await fetch(`/api/emails/history?${queryParams}`);
    //   const data = await response.json();
    //   setHistory(data.data?.history || []);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    const response = await apiAxios.get('/api/emails/history', { params });
    const data = response.data;
    setHistory(data.data?.history || data.history || data.data || []);
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && history.length === 0) {
    return <Loading message="Loading email history..." />;
  }

  return (
    <div className="main-content">
      <h1>Email History</h1>
      <p className="text-muted mb-3">View your email sending history and status</p>

      <ErrorMessage message={error} onClose={clearError} />

      {/* Filters */}
      <div className="history-filters">
        <div className="form-group" style={{ margin: 0 }}>
          <label>Status</label>
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label>From Date</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label>To Date</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>

        <button 
          onClick={clearFilters}
          className="btn btn-secondary"
          style={{ alignSelf: 'flex-end' }}
        >
          Clear Filters
        </button>
      </div>

      {/* History List */}
      <div className="history-list">
        {history.map((item) => (
          <div key={item._id} className="history-item">
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{item.companyName}</h4>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>
                <strong>Position:</strong> {item.position} | 
                <strong> Email:</strong> {item.email}
              </p>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                Sent: {formatDate(item.sentAt)} | 
                <strong> Resume:</strong> {item.resumeId?.filename}
              </p>
              {item.errorMessage && (
                <p style={{ margin: '0.25rem 0', color: '#dc3545', fontSize: '0.9rem' }}>
                  <strong>Error:</strong> {item.errorMessage}
                </p>
              )}
            </div>
            <div className={`history-status ${item.status}`}>
              {item.status === 'sent' ? (
                <span className="text-success">
                  <i className="fas fa-check-circle"></i> Sent
                </span>
              ) : (
                <span className="text-danger">
                  <i className="fas fa-times-circle"></i> Failed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {history.length === 0 && !loading && (
        <div className="text-center mt-3">
          <p>No email history found.</p>
        </div>
      )}
    </div>
  );
};

export default EmailHistory;