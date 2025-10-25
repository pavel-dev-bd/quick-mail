import React, { useState } from 'react';

const TemplateSidebar = ({ templates, currentTemplate, onTemplateSelect, onCreateTemplate, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Templates', count: templates.length },
    { value: 'professional', label: 'Professional', count: templates.filter(t => t.category === 'professional').length },
    { value: 'creative', label: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { value: 'minimal', label: 'Minimal', count: templates.filter(t => t.category === 'minimal').length },
    { value: 'modern', label: 'Modern', count: templates.filter(t => t.category === 'modern').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const defaultTemplates = [
    {
      name: 'Professional Blue',
      category: 'professional',
      description: 'Clean and professional design with blue accent',
      preview: '<div style="background: #6366f1; color: white; padding: 20px; text-align: center;">Professional</div>'
    },
    {
      name: 'Modern Gradient',
      category: 'modern',
      description: 'Modern design with gradient background',
      preview: '<div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; text-align: center;">Modern</div>'
    },
    {
      name: 'Minimal Clean',
      category: 'minimal',
      description: 'Minimalist design with clean layout',
      preview: '<div style="background: #f8f9fa; color: #333; padding: 20px; text-align: center; border: 1px solid #ddd;">Minimal</div>'
    }
  ];

  const handleCreateFromDefault = (template) => {
    const date= new Date();
    onCreateTemplate({
      name: `New Template ${date.getTime()}`,
      category: template.category,
      subject: 'Job Application - {position}',
      htmlContent: defaultTemplate,
      designConfig: {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        primaryColor: '#6366f1',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        borderRadius: '8px',
        padding: '20px'
      },
      variables: [
        { name: 'companyName', description: 'Company name', defaultValue: '' },
        { name: 'position', description: 'Job position', defaultValue: '' },
        { name: 'userName', description: 'Your name', defaultValue: '' }
      ]
    });
  };

  const defaultTemplate =`<div style="font-family: Arial, sans-serif; color: #333; background: #fff; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #6366f1; margin: 0;">Job Application</h1>
      </div>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <p>Dear Hiring Team at <strong>{companyName}</strong>,</p>
        <p>I am writing to express my interest in the <strong>{position}</strong> position...</p>
        <p>Best regards,<br>
        <strong>{userName}</strong></p>
      </div>
    </div>`;

  return (
    <div style={{
      width: '300px',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Email Templates</h3>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}
        />

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              style={{
                background: selectedCategory === category.value ? '#6366f1' : 'transparent',
                color: selectedCategory === category.value ? 'white' : '#333',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '4px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>{category.label}</span>
              <span style={{ 
                background: selectedCategory === category.value ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                color: selectedCategory === category.value ? 'white' : '#666',
                padding: '0.1rem 0.4rem',
                borderRadius: '10px',
                fontSize: '0.75rem'
              }}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
        {/* Default Templates */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#666' }}>Quick Start</h4>
          {defaultTemplates.map((template, index) => (
            <div
              key={index}
              onClick={() => handleCreateFromDefault(template)}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: template.preview }}
                style={{ marginBottom: '0.5rem', borderRadius: '4px', overflow: 'hidden' }}
              />
              <h5 style={{ margin: '0 0 0.25rem 0' }}>{template.name}</h5>
              <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>{template.description}</p>
              <span style={{
                background: '#f1f5f9',
                color: '#475569',
                padding: '0.1rem 0.4rem',
                borderRadius: '10px',
                fontSize: '0.7rem',
                marginTop: '0.5rem',
                display: 'inline-block'
              }}>
                {template.category}
              </span>
            </div>
          ))}
        </div>

        {/* User Templates */}
        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: '#666' }}>My Templates</h4>
          {filteredTemplates.map(template => (
            <div
              key={template._id}
              onClick={() => onTemplateSelect(template)}
              style={{
                background: currentTemplate?._id === template._id ? '#f0f9ff' : 'white',
                border: `2px solid ${currentTemplate?._id === template._id ? '#6366f1' : '#e2e8f0'}`,
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentTemplate?._id !== template._id) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentTemplate?._id !== template._id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <h5 style={{ margin: '0 0 0.25rem 0' }}>{template.name}</h5>
              <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>
                {template.plainText?.substring(0, 100)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px',
                  fontSize: '0.7rem'
                }}>
                  {template.category}
                </span>
                {template.isPublic && (
                  <span style={{
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '10px',
                    fontSize: '0.7rem'
                  }}>
                    Public
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            <p>No templates found</p>
            <button
              onClick={() => handleCreateFromDefault(defaultTemplates[0])}
              className="btn"
              style={{ marginTop: '1rem' }}
            >
              Create First Template
            </button>
          </div>
        )}
      </div>

      {/* Create New Button */}
      <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
        <button
          onClick={() => onCreateTemplate({
            name: 'New Template',
            category: 'professional',
            subject: 'Job Application - {{position}}',
            htmlContent: defaultTemplate,
            designConfig: {
              backgroundColor: '#ffffff',
              textColor: '#333333',
              primaryColor: '#6366f1',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              borderRadius: '8px',
              padding: '20px'
            }
          })}
          className="btn"
          disabled={loading}
          style={{ width: '100%' }}
        >
          <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
          Create New Template
        </button>
      </div>
    </div>
  );
};

export default TemplateSidebar;