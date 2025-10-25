 import React, { useState, useEffect } from 'react';
import { useSecureAPI } from '../../hooks/useSecureAPI';
import ErrorMessage from '../Common/ErrorMessage';
import Loading from '../Common/Loading';
import apiAxios from '../../utils/api';
import {Link} from 'react-router-dom'
const BulkSender = () => {
  const [companies, setCompanies] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState(null);
  
  const { callAPI, loading, error, clearError } = useSecureAPI();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await callAPI(async () => {
      const [companiesRes, resumesRes, templatesRes] = await Promise.all([
        apiAxios.get('/api/companies', { params: { limit: 1000 } }),
        apiAxios.get('/api/resumes'),
        apiAxios.get('/api/template-designs')
      ]);

      setCompanies(companiesRes.data?.data?.companies || companiesRes.data?.data || companiesRes.data?.companies || []);
      setResumes( resumesRes.data?.data.resumes || resumesRes.data || []);
      setTemplates( templatesRes.data?.data.templates || templatesRes.data || []);
    });
  };

  const handleCompanySelect = (companyId, isSelected) => {
    if (isSelected) {
      setSelectedCompanies(prev => [...prev, companyId]);
    } else {
      setSelectedCompanies(prev => prev.filter(id => id !== companyId));
    }
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === companies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(companies.map(c => c._id || c.id));
    }
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t._id === templateId || t.id === templateId);
    if (template) {
      setCustomSubject(template.subject || '');
      setCustomMessage(template.body || '');
    }
  };

  const handleSendEmails = async () => {
    if (selectedCompanies.length === 0) {
      alert('Please select at least one company');
      return;
    }

    setSending(true);
    setResults(null);
    clearError();

    await callAPI(async () => {
      const response = await apiAxios.post('/api/emails/send-bulk', {
        companyIds: selectedCompanies,
        resumeId: selectedResume,
        templateId: selectedTemplate || undefined,
        customSubject: customSubject || undefined,
        customMessage: customMessage || undefined
      });

      const data = response.data;

      if (response.status >= 200 && response.status < 300) {
        setResults(data.data || data);
        // Clear selections after successful send
        setSelectedCompanies([]);
        setSelectedResume('');
        setSelectedTemplate('');
        setCustomSubject('');
        setCustomMessage('');
      } else {
        throw new Error(data.message || 'Failed to send emails');
      }
    });

    setSending(false);
  };

  if (loading && companies.length === 0) {
    return <Loading message="Loading data..." />;
  }

  return (
    <div className="main-content">
      <h1>Bulk Email Sender</h1>
      <p className="text-muted mb-3">Send your resume to multiple companies at once</p>

      <ErrorMessage message={error} onClose={clearError} />

      <div className="bulk-sender">
        {/* Company Selection Panel */}
        <div className="selection-panel">
          <h3>
            Select Companies 
            <span style={{ color: '#6366f1', marginLeft: '0.5rem' }}>
              ({selectedCompanies.length} selected)
            </span>
          </h3>
          <button onClick={handleSelectAll} className="select-all-btn">
            {selectedCompanies.length === companies.length ? 'Deselect All' : 'Select All'}
          </button>
          <Link className='btn btn-primary' to={'/companies'}>Add Company</Link>

          <div className="company-selection">
            {(Array.isArray(companies) ? companies : []).map(company => (
              <div key={company._id || company.id} className="company-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company._id || company.id)}
                    onChange={(e) => handleCompanySelect(company._id || company.id, e.target.checked)}
                  />
                  <div>
                    <strong>{company.name}</strong>
                    <br />
                    <small>
                      {company.position} | {company.email}
                      {company.industry && ` | ${company.industry}`}
                    </small>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="config-panel">
          <div className="form-group">
            <label>Select Resume *  <Link to={'/resumes'}>Create Reume</Link></label>
            <select 
              value={selectedResume} 
              onChange={(e) => setSelectedResume(e.target.value)}
              required
            >
              <option value="">Choose a resume</option>
              {(Array.isArray(resumes) ? resumes : []).map(resume => (
                <option key={resume._id || resume.id} value={resume._id || resume.id}>
                  {resume.originalName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Email Template <Link to={'/email-designer'}>Create Template</Link></label>
            <select 
              value={selectedTemplate} 
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              <option value="">Custom Message</option>
              {(Array.isArray(templates) ? templates : []).map(template => (
                <option key={template._id || template.id} value={template._id || template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Email Subject *</label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="e.g., Job Application - Software Engineer Position"
              required
            />
          </div>
          {selectedTemplate === '' && (
          <div className="form-group">
            <label>Email Message *</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your email message here..."
              rows="8"
              required
            />
            <small className="text-muted">
              You can use placeholders like: {"{companyName}"}, {"{position}"}, {"{userName}"}
            </small>
          </div>)}

          <button 
            onClick={handleSendEmails}
            disabled={sending || selectedCompanies.length === 0 || !customSubject }
            className="btn send-btn"
          >
            {sending ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                Sending Emails...
              </>
            ) : (
              `Send to ${selectedCompanies.length} ${selectedCompanies.length === 1 ? 'Company' : 'Companies'}`
            )}
          </button>
        </div>
      </div>

      {/* Results Panel */}
      {results && (
        <div className="results-panel mt-3">
          <h3>Send Results</h3>
          <div className="results-summary">
            <p className="text-success">
              <i className="fas fa-check-circle"></i> Successful: {results.sentCount}
            </p>
            <p className="text-danger">
              <i className="fas fa-times-circle"></i> Failed: {results.failedCount}
            </p>
          </div>
          
          {results.results && results.results.length > 0 && (
            <div className="detailed-results">
              <h4>Detailed Results:</h4>
              {results?.results.map((result, index) => (
                <div key={index} className={`result-item ${result.status}`}>
                  <strong>{result.company}:</strong> 
                  {result.status === 'success' ? ' ✅ Sent' : ' ❌ Failed'}
                  {result.error && <small> - {result.error}</small>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkSender;