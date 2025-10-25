import React ,{useEffect, useState} from 'react';
import { useSecureAPI } from '../../hooks/useSecureAPI';
import apiaxios from '../../utils/api';
const PropertiesPanel = ({ designConfig, onDesignConfigChange, currentTemplate, onUpdateTemplate }) => {
   const [template,setTemplate]=useState(currentTemplate || '')
   const { callAPI, loading, error, clearError } = useSecureAPI();
   useEffect(()=>{
    setTemplate(currentTemplate)
   },[currentTemplate])
   useEffect(()=>{
    setTemplate(currentTemplate || null)
   },[currentTemplate])

   // merge patch into local state and persist via onUpdateTemplate if provided
   const handleTemplateUpdate = async (updatedata = {}) => {
    if (!template) return;
    
      await callAPI(async () => {
        const response = await apiaxios.patch(`/api/template-designs/${currentTemplate._id}`,updatedata);
      
      });
  };

  const colorPresets = {
    primary: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    background: ['#ffffff', '#f8fafc', '#f1f5f9', '#fef7ed', '#f0f9ff', '#fdf2f8'],
    text: ['#000000', '#333333', '#4b5563', '#6b7280', '#374151', '#1f2937']
  };

  const fontFamilies = [
    'Arial, sans-serif',
    'Helvetica, Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Verdana, sans-serif',
    'Trebuchet MS, sans-serif'
  ];

  const handleColorChange = (key, value) => {
    onDesignConfigChange(key, value);
  };

  const handleTemplatePropertyChange = (key, value) => {
    const patch = { [key]: value };
    // update local preview state immediately
    setTemplate(prev => prev ? { ...prev, ...patch } : { ...patch });
    // persist change
    handleTemplateUpdate(patch)
  };

  return (
    <div style={{
      width: '100%',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: 0 }}>Design Properties</h4>
        <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.8rem' }}>
          Customize your email template appearance
        </p>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        padding: '1rem'
      }}>
        {/* Template Properties */}
        {currentTemplate && (
          <div style={{ marginBottom: '2rem' }}>
            <h5 style={{ margin: '0 0 1rem 0' }}>Template Settings</h5>
            
            <div className="form-group">
              <label>Template Name</label>
              <input
                type="text"
                value={template.name || ''}
                onChange={(e) => handleTemplatePropertyChange('name', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label>Email Subject</label>
              <input
                type="text"
                value={template.subject || ''}
                onChange={(e) => handleTemplatePropertyChange('subject', e.target.value)}
                style={{ width: '100%' }}
                placeholder="e.g., Job Application - {{position}}"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={template.category || 'professional'}
                onChange={(e) => handleTemplatePropertyChange('category', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="professional">Professional</option>
                <option value="creative">Creative</option>
                <option value="minimal">Minimal</option>
                <option value="modern">Modern</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={template.isPublic || false}
                  onChange={(e) => handleTemplatePropertyChange('isPublic', e.target.checked)}
                />
                Make Template Public
              </label>
              <small className="text-muted">
                Other users can see and use this template
              </small>
            </div>
          </div>
        )}

        {/* Color Properties
        <div style={{ marginBottom: '2rem' }}>
          <h5 style={{ margin: '0 0 1rem 0' }}>Colors</h5>

          
          <div className="form-group">
            <label>Background Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="color"
                value={designConfig.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                style={{ width: '40px', height: '40px' }}
              />
              <input
                type="text"
                value={designConfig.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
              {colorPresets.background.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange('backgroundColor', color)}
                  style={{
                    width: '20px',
                    height: '20px',
                    background: color,
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          Text Color
          <div className="form-group">
            <label>Text Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="color"
                value={designConfig.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                style={{ width: '40px', height: '40px' }}
              />
              <input
                type="text"
                value={designConfig.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
              {colorPresets.text.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange('textColor', color)}
                  style={{
                    width: '20px',
                    height: '20px',
                    background: color,
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          Primary Color
          <div className="form-group">
            <label>Primary Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="color"
                value={designConfig.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                style={{ width: '40px', height: '40px' }}
              />
              <input
                type="text"
                value={designConfig.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
              {colorPresets.primary.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange('primaryColor', color)}
                  style={{
                    width: '20px',
                    height: '20px',
                    background: color,
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div> */}

        {/* Typography */}
        {/* <div style={{ marginBottom: '2rem' }}>
          <h5 style={{ margin: '0 0 1rem 0' }}>Typography</h5>

          <div className="form-group">
            <label>Font Family</label>
            <select
              value={designConfig.fontFamily}
              onChange={(e) => handleColorChange('fontFamily', e.target.value)}
              style={{ width: '100%' }}
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>
                  {font.split(',')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Font Size</label>
            <select
              value={designConfig.fontSize}
              onChange={(e) => handleColorChange('fontSize', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Medium (16px)</option>
              <option value="18px">Large (18px)</option>
              <option value="20px">Extra Large (20px)</option>
            </select>
          </div>
        </div> */}

        {/* Layout */}
        {/* <div style={{ marginBottom: '2rem' }}>
          <h5 style={{ margin: '0 0 1rem 0' }}>Layout</h5>

          <div className="form-group">
            <label>Padding</label>
            <select
              value={designConfig.padding}
              onChange={(e) => handleColorChange('padding', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="10px">Small (10px)</option>
              <option value="20px">Medium (20px)</option>
              <option value="30px">Large (30px)</option>
              <option value="40px">Extra Large (40px)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Border Radius</label>
            <select
              value={designConfig.borderRadius}
              onChange={(e) => handleColorChange('borderRadius', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="0px">None (0px)</option>
              <option value="4px">Small (4px)</option>
              <option value="8px">Medium (8px)</option>
              <option value="12px">Large (12px)</option>
              <option value="20px">Extra Large (20px)</option>
            </select>
          </div>
        </div> */}

        {/* Quick Presets */}
        {/* <div>
          <h5 style={{ margin: '0 0 1rem 0' }}>Quick Presets</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => {
                handleColorChange('backgroundColor', '#ffffff');
                handleColorChange('textColor', '#333333');
                handleColorChange('primaryColor', '#6366f1');
              }}
              className="btn btn-secondary btn-sm"
            >
              Professional Blue
            </button>
            <button
              onClick={() => {
                handleColorChange('backgroundColor', '#f8fafc');
                handleColorChange('textColor', '#1f2937');
                handleColorChange('primaryColor', '#10b981');
              }}
              className="btn btn-secondary btn-sm"
            >
              Modern Green
            </button>
            <button
              onClick={() => {
                handleColorChange('backgroundColor', '#ffffff');
                handleColorChange('textColor', '#000000');
                handleColorChange('primaryColor', '#000000');
              }}
              className="btn btn-secondary btn-sm"
            >
              Minimal Black
            </button>
          </div>
        </div> */}
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '1rem', 
        borderTop: '1px solid #e2e8f0',
        background: '#f8f9fa'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: '0.8rem', 
          color: '#666',
          textAlign: 'center'
        }}>
          Changes are saved automatically without html content updates.
        </p>
      </div>
    </div>
  );
};

export default PropertiesPanel;