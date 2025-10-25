 import React from "react";

const CodePrevew = ({ activeTab='' ,processedHtml}) => {
  return (<>
     {/* Live Preview */}
        <div style={{ 
        flex: 1, 
        background: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '1rem', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h4 style={{ margin: 0 }}>Email Preview</h4>
          {/* <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary"
          >
            <i className="fas fa-edit" style={{ marginRight: '0.5rem' }}></i>
            Edit HTML
          </button> */}
        </div>
        
        <div style={{ 
          flex: 1, 
          padding: '2rem',
          overflow: 'auto',
          background: '#f8f9fa'
        }}>
          <div 
            dangerouslySetInnerHTML={{ __html: processedHtml }}
            style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          />
        </div>
      </div>
  
  </>);
};

export default CodePrevew;