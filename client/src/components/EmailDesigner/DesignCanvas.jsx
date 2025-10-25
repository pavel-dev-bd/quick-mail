import React, { useState, useRef, useEffect } from 'react';
import EmailTemplateEditor from './EmailTemplateEditor';

const DesignCanvas = ({
  htmlContent,
  designConfig,
  onHtmlContentChange,
  applyDesignToHtml,
  activeTab,
  showPreview,
  currentTemplate,
  textareaRef,
  handleTemplateUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // ensure processedHtml is always a string
  const processedHtml = applyDesignToHtml?.(htmlContent) ?? String(htmlContent ?? '');

  // normalize tab name for robust checks
  const tab = String(activeTab || '').toLowerCase();

  const variableSuggestions = [
    { name: 'companyName', description: 'Company name' },
    { name: 'position', description: 'Job position' },
    { name: 'userName', description: 'Your name' },
    { name: 'userEmail', description: 'Your email address' },
    { name: 'userPhone', description: 'Your phone number' },
    { name: 'userTitle', description: 'Your professional title' },
    { name: 'industry', description: 'Company industry' },
    { name: 'contactPerson', description: 'Contact person name' },
    { name: 'currentDate', description: 'Current date' },
    { name: 'currentYear', description: 'Current year' },
    { name: 'daysSinceApplication', description: 'Days since application' },
    { name: 'nextWeek', description: 'Date one week from now' },
    { name: 'nextMonth', description: 'Date one month from now' }
  ];

  const insertVariable = (variableName) => {
    const textarea = textareaRef?.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = (htmlContent ?? '').substring(0, start) + `{${variableName}}` + (htmlContent ?? '').substring(end);

    onHtmlContentChange?.(newText);

    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.focus();
      const pos = start + variableName.length + 4; // {x}
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  return (
    <div
      style={{
        flex: 1,
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h4 style={{ margin: 0, marginRight: '20px' }}>
          {tab === 'design' ? 'Design Editor' : 'HTML Editor'}
        </h4>
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {tab === 'design' && (
          <div
            style={{
              flex: 1,
              padding: '2rem',
              overflow: 'auto',
              background: '#f8f9fa',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: processedHtml }}
              style={{
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                maxWidth: '600px',
                width: '100%'
              }}
            />
          </div>
        )}

        {(tab === 'editor'  || tab === 'design') && (
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <EmailTemplateEditor
              value={htmlContent ?? ''}
              handleTemplateUpdate={handleTemplateUpdate}
            />
          </div>
        )}

        {/* Status Bar */}
        <div
          style={{
            padding: '0.5rem 1rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: '#666'
          }}
        >
          <span>Template: {currentTemplate?.name || 'Unsaved'}</span>
          <span>Variables: {variableSuggestions.length} available</span>
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;