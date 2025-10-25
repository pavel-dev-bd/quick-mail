     import React, { useState, useEffect } from 'react';
import { useSecureAPI } from '../../hooks/useSecureAPI';
import ErrorMessage from '../Common/ErrorMessage';
import Loading from '../Common/Loading';
import apiAxios from '../../utils/api';
import {Link} from 'react-router-dom';
const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: ''
  });
  
  const { callAPI, loading, error, clearError } = useSecureAPI();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    await callAPI(async () => {
      //const response = await apiAxios.get('/api/templates');
       const templateDeasing = await apiAxios.get('/api/template-designs');
       console.log(templateDeasing.data.data.templates);
      setTemplates(templateDeasing.data?.data?.templates || data?.templates || []);
    });
  };

  const handleCreateTemplate = async () => {
    await callAPI(async () => {
      const response = await apiAxios.post('/api/templates', formData);
      // success -> refresh
      setShowForm(false);
      setFormData({ name: '', subject: '', body: '' });
      fetchTemplates();
    });
  };

  const handleUpdateTemplate = async () => {
    await callAPI(async () => {
      const id = editingTemplate._id || editingTemplate.id;
      const response = await apiAxios.patch(`/api/templates/${id}`, formData);
      // success -> refresh
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({ name: '', subject: '', body: '' });
      fetchTemplates();
    });
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    await callAPI(async () => {
      await apiAxios.delete(`/api/template-designs/${templateId}`);
      fetchTemplates();
    });
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body
    });
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingTemplate) {
      handleUpdateTemplate();
    } else {
      handleCreateTemplate();
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setFormData({ name: '', subject: '', body: '' });
  };

  if (loading && templates.length === 0) {
    return <Loading message="Loading templates..." />;
  }

  return (
    <div className="main-content">
      <div className="flex justify-between items-center mb-3">
        <h1>Email Templates</h1>
        {/* <button 
          className="btn"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
          Create Template
        </button> */}
        <Link to="/email-designer" className="btn btn-primary">
          <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
          Create Template
        </Link>
      </div>

      <ErrorMessage message={error} onClose={clearError} />

      {/* Template Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2>{editingTemplate ? 'Edit Template' : 'Create New Template'}</h2>
            
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Template Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Software Engineer Application"
                />
              </div>

              <div className="form-group">
                <label>Email Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="e.g., Job Application - {position}"
                />
              </div>

              <div className="form-group">
                <label>Email Body *</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  required
                  rows="10"
                  placeholder={`Dear Hiring Team at {companyName},\n\nI am writing to express my interest in the {position} position...`}
                />
                <small className="text-muted">
                  Available placeholders: {"{companyName}"}, {"{position}"}, {"{userName}"}, {"{industry}"}, {"{contactPerson}"}
                </small>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  className="btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingTemplate ? 'Update Template' : 'Create Template')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleFormClose}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="template-list">
        {(Array.isArray(templates) ? templates : []).map((template) => (
          <div key={template._id} className="template-item">
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <h4>{template.name}</h4>
                <p><strong>Subject:</strong> {template.subject}</p>
                <p><strong>Body:</strong></p>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '5px',
                  maxHeight: '200px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {/* {template.htmlContent} */}
                   <div
                   dangerouslySetInnerHTML={{ __html: template.htmlContent }}
                   style={{
                      border: "1px solid #ccc",
                     padding: "10px",
                  borderRadius: "8px",
            marginTop: "10px",
                    }}
                 />
               </div>
               
              </div>
              <div className="company-actions">
                {/* <button 
                  onClick={() => handleEdit(template)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  <i className="fas fa-edit"></i>
                  Edit
                </button> */}
                <button 
                  onClick={() => handleDeleteTemplate(template._id)}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center mt-3">
          <p>No email templates found. Create your first template to get started.</p>
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;