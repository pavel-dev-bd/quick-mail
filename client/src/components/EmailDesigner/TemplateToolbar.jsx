// Add these props and button
const TemplateToolbar = ({
  currentTemplate,
  onUpdateTemplate,
  activeTab,
  onTabChange,
  onPreviewToggle,
  showPreview,
  loading,
  onToggleVariables, 
  showVariablesPanel, 
}) => {
  const handleSave = () => {
    if (currentTemplate) {
      onUpdateTemplate(currentTemplate);
    }
  };

  const handleDuplicate = () => {
    if (currentTemplate) {
      const duplicatedTemplate = {
        ...currentTemplate,
        id: null,
        name: `${currentTemplate.name} (Copy)`,
      };
      onUpdateTemplate(duplicatedTemplate);
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
      }}
    >
      {/* Left Side - Template Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h3 style={{ margin: 0 }}>{currentTemplate?.name || "New Template"}</h3>

        {currentTemplate && (
          <span
            style={{
              background: "#f1f5f9",
              color: "#475569",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.8rem",
            }}
          >
            {currentTemplate.category}
          </span>
        )}
      </div>

      {/* Center - Tabs */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {/* {includeDragDrop && (
          <button
            onClick={() => onTabChange('dragdrop')}
            className={`btn ${activeTab === 'dragdrop' ? '' : 'btn-secondary'}`}
          >
            <i className="fas fa-grip-horizontal" style={{ marginRight: '0.5rem' }}></i>
            Drag & Drop
          </button>
        )} */}
        {currentTemplate && !showPreview && (
          <>
            <button
              onClick={() => onTabChange("Editor")}
              className={`btn ${activeTab === "Editor" ? "" : "btn-secondary"}`}
            >
              <i
                className="fas fa-palette"
                style={{ marginRight: "0.5rem" }}
              ></i>
              Editor
            </button>

            <button
              onClick={() => onTabChange("design")}
              className={`btn ${activeTab === "design" ? "" : "btn-secondary"}`}
            >
              <i
                className="fas fa-palette"
                style={{ marginRight: "0.5rem" }}
              ></i>
              Design
            </button>
          </>
        )}
      </div>
      {/* Right Side - Actions */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {currentTemplate && (
          <>
            {/* Variables Toggle Button */}
            {/* <button
              onClick={() => onToggleVariables(!showVariablesPanel)}
              className={`btn ${showVariablesPanel ? "" : "btn-secondary"}`}
              title="Toggle Variables Panel"
            >
              <i className="fas fa-magic" style={{ marginRight: "0.5rem" }}></i>
              Variables
            </button> */}

            <button
              onClick={() => onPreviewToggle(!showPreview)}
              className="btn btn-secondary"
            >
              <i
                className={`fas ${showPreview ? "fa-edit" : "fa-eye"}`}
                style={{ marginRight: "0.5rem" }}
              ></i>
              {showPreview ? "Edit" : "Preview"}
            </button>

            <button
              onClick={handleDuplicate}
              className="btn btn-secondary"
              disabled={loading}
            >
              <i className="fas fa-copy" style={{ marginRight: "0.5rem" }}></i>
              Duplicate
            </button>

            {/* <button onClick={handleSave} className="btn" disabled={loading}>
              <i className="fas fa-save" style={{ marginRight: "0.5rem" }}></i>
              Save
            </button> */}
          </>
        )}
      </div>
    </div>
  );
};

export default TemplateToolbar;
