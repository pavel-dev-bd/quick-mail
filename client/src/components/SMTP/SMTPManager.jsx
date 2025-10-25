// ...existing code...
import React, { useState, useEffect } from 'react';
import { useSecureAPI } from '../../hooks/useSecureAPI';
import ErrorMessage from '../Common/ErrorMessage';
import Loading from '../Common/Loading';
import SMTPForm from './SMTPForm';
import apiAxios from '../../utils/api';

const SMTPManager = () => {
  const [configs, setConfigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [testingConfig, setTestingConfig] = useState(null);
  
  const { callAPI, loading, error, clearError } = useSecureAPI();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    await callAPI(async () => {
      const response = await apiAxios.get('/api/smtp');
      const data = response.data;
      const payload = data.data || data.configs || data;
      setConfigs(Array.isArray(payload) ? payload : (payload?.configs || []));
    });
  };

  const handleCreateConfig = async (configData) => {
    await callAPI(async () => {
      const response = await apiAxios.post('/api/smtp', configData);
      // axios throws on non-2xx; reaching here means success
      setShowForm(false);
      fetchConfigs();
    });
  };

  const handleUpdateConfig = async (configId, configData) => {
    await callAPI(async () => {
      await apiAxios.patch(`/api/smtp/${configId}`, configData);
      setEditingConfig(null);
      setShowForm(false);
      fetchConfigs();
    });
  };

  const handleTestConfig = async (configId) => {
    setTestingConfig(configId);
    
    await callAPI(async () => {
      await apiAxios.post(`/api/smtp/${configId}/test`);
      alert('SMTP configuration test successful!');
      fetchConfigs();
    });
    
    setTestingConfig(null);
  };

  const handleSetActive = async (configId) => {
    await callAPI(async () => {
      await apiAxios.patch(`/api/smtp/${configId}/set-active`);
      fetchConfigs();
    });
  };

  const handleSetDefault = async (configId) => {
    await callAPI(async () => {
      await apiAxios.patch(`/api/smtp/${configId}/set-default`);
      fetchConfigs();
    });
  };

  const handleDeleteConfig = async (configId) => {
    if (!window.confirm('Are you sure you want to delete this SMTP configuration?')) {
      return;
    }

    await callAPI(async () => {
      await apiAxios.delete(`/api/smtp/${configId}`);
      fetchConfigs();
    });
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingConfig(null);
  };

  const getStatusBadge = (config) => {
    if (!config.isActive) {
      return <span className="badge badge-secondary">Inactive</span>;
    }
    
    switch (config.testStatus) {
      case 'success':
        return <span className="badge badge-success">Active & Tested</span>;
      case 'failed':
        return <span className="badge badge-danger">Active & Failed</span>;
      default:
        return <span className="badge badge-warning">Active & Untested</span>;
    }
  };

  if (loading && configs.length === 0) {
    return <Loading message="Loading SMTP configurations..." />;
  }

  return (
    <div className="main-content">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1>SMTP Configuration</h1>
          <p className="text-muted">Manage your email sending configurations</p>
        </div>
        <button 
          className="btn"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
          Add SMTP Configuration
        </button>
      </div>

      <ErrorMessage message={error} onClose={clearError} />

      {showForm && (
        <SMTPForm
          config={editingConfig}
          onSubmit={editingConfig ? 
            (data) => handleUpdateConfig(editingConfig._id, data) : 
            handleCreateConfig
          }
          onClose={handleFormClose}
          loading={loading}
        />
      )}

      <div className="config-list">
        {configs.map((config) => (
          <div key={config._id} className="config-item" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '1rem',
            border: config.isActive ? '2px solid #28a745' : '1px solid #eee'
          }}>
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-2">
                  <h4 style={{ margin: 0 }}>{config.name}</h4>
                  {config.isDefault && (
                    <span className="badge badge-primary">Default</span>
                  )}
                  {getStatusBadge(config)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <strong>Host:</strong> {config.host}:{config.port}
                  </div>
                  <div>
                    <strong>Secure:</strong> {config.secure ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>Username:</strong> {config.username}
                  </div>
                  <div>
                    <strong>From:</strong> {config.fromName} &lt;{config.fromEmail}&gt;
                  </div>
                </div>

                {config.testStatus === 'failed' && config.testErrorMessage && (
                  <div style={{
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '0.75rem',
                    borderRadius: '5px',
                    marginBottom: '1rem'
                  }}>
                    <strong>Test Error:</strong> {config.testErrorMessage}
                  </div>
                )}

                {config.lastTested && (
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Last tested: {new Date(config.lastTested).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="config-actions" style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                {!config.isActive && (
                  <button 
                    onClick={() => handleSetActive(config._id)}
                    className="btn btn-success btn-sm"
                    disabled={loading}
                  >
                    Set Active
                  </button>
                )}
                
                {!config.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(config._id)}
                    className="btn btn-secondary btn-sm"
                    disabled={loading}
                  >
                    Set Default
                  </button>
                )}

                <button 
                  onClick={() => handleTestConfig(config._id)}
                  className="btn btn-info btn-sm"
                  disabled={loading || testingConfig === config._id}
                >
                  {testingConfig === config._id ? 'Testing...' : 'Test'}
                </button>

                <button 
                  onClick={() => handleEdit(config)}
                  className="btn btn-warning btn-sm"
                  disabled={loading}
                >
                  Edit
                </button>

                <button 
                  onClick={() => handleDeleteConfig(config._id)}
                  className="btn btn-danger btn-sm"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {configs.length === 0 && !loading && (
        <div className="text-center mt-3">
          <div style={{ 
            background: 'white', 
            padding: '3rem', 
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <i className="fas fa-server" style={{ fontSize: '3rem', color: '#6366f1', marginBottom: '1rem' }}></i>
            <h3>No SMTP Configurations</h3>
            <p className="text-muted mb-3">
              Add your first SMTP configuration to start sending emails with your own email provider.
            </p>
            <button 
              className="btn"
              onClick={() => setShowForm(true)}
            >
              Add Your First SMTP Configuration
            </button>
          </div>
        </div>
      )}

      {/* SMTP Provider Examples */}
      {configs.length === 0 && (
        <div className="mt-4">
          <h4>Popular SMTP Provider Settings:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            <div className="provider-example" style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '5px'
            }}>
              <h5>Gmail</h5>
              <ul style={{ fontSize: '0.9rem', margin: 0 }}>
                <li>Host: smtp.gmail.com</li>
                <li>Port: 587</li>
                <li>Secure: No</li>
                <li>Use App Password</li>
              </ul>
            </div>
            <div className="provider-example" style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '5px'
            }}>
              <h5>Outlook/Hotmail</h5>
              <ul style={{ fontSize: '0.9rem', margin: 0 }}>
                <li>Host: smtp-mail.outlook.com</li>
                <li>Port: 587</li>
                <li>Secure: No</li>
              </ul>
            </div>
            <div className="provider-example" style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '5px'
            }}>
              <h5>Yahoo</h5>
              <ul style={{ fontSize: '0.9rem', margin: 0 }}>
                <li>Host: smtp.mail.yahoo.com</li>
                <li>Port: 587</li>
                <li>Secure: No</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMTPManager;
