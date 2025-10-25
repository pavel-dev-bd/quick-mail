import React, { useState, useEffect } from 'react';

const SMTPForm = ({ config, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 587,
    secure: false,
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
    isActive: false,
    isDefault: false
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        name: config.name || '',
        host: config.host || '',
        port: config.port || 587,
        secure: config.secure || false,
        username: config.username || '',
        password: '', // Don't pre-fill password for security
        fromEmail: config.fromEmail || '',
        fromName: config.fromName || '',
        isActive: config.isActive || false,
        isDefault: config.isDefault || false
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const popularProviders = [
    {
      name: 'Gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false
    },
    {
      name: 'Outlook/Hotmail',
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false
    },
    {
      name: 'Yahoo',
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false
    },
    {
      name: 'Office 365',
      host: 'smtp.office365.com',
      port: 587,
      secure: false
    },
    {
      name: 'SendGrid',
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false
    },
    {
      name: 'Mailgun',
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false
    }
  ];

  const applyProviderSettings = (provider) => {
    setFormData({
      ...formData,
      host: provider.host,
      port: provider.port,
      secure: provider.secure
    });
  };

  return (
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
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2>{config ? 'Edit SMTP Configuration' : 'Add SMTP Configuration'}</h2>
        
        {/* Popular Providers Quick Select */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4>Quick Setup - Popular Providers:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {popularProviders.map((provider, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => applyProviderSettings(provider)}
                style={{ fontSize: '0.8rem' }}
              >
                {provider.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label>Configuration Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Gmail, Company SMTP"
              />
            </div>

            <div className="form-group">
              <label>From Name *</label>
              <input
                type="text"
                name="fromName"
                value={formData.fromName}
                onChange={handleChange}
                required
                placeholder="e.g., Your Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label>SMTP Host *</label>
              <input
                type="text"
                name="host"
                value={formData.host}
                onChange={handleChange}
                required
                placeholder="e.g., smtp.gmail.com"
              />
            </div>

            <div className="form-group">
              <label>SMTP Port *</label>
              <input
                type="number"
                name="port"
                value={formData.port}
                onChange={handleChange}
                required
                min="1"
                max="65535"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Your email or username"
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!config} // Password not required when editing (unless changing)
                  placeholder={config ? "Leave blank to keep current" : "Your SMTP password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {config && (
                <small className="text-muted">Leave password blank to keep current password</small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>From Email *</label>
            <input
              type="email"
              name="fromEmail"
              value={formData.fromEmail}
              onChange={handleChange}
              required
              placeholder="your-email@domain.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="secure"
                  checked={formData.secure}
                  onChange={handleChange}
                />
                Use SSL/TLS (Secure)
              </label>
              <small className="text-muted">Usually required for port 465</small>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Set as Active
              </label>
              <small className="text-muted">Use this configuration for sending emails</small>
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              Set as Default
            </label>
            <small className="text-muted">Default configuration for new setups</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : (config ? 'Update Configuration' : 'Add Configuration')}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SMTPForm;