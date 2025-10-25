import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSecureAPI } from "../../hooks/useSecureAPI";
import ErrorMessage from "../Common/ErrorMessage";
import Loading from "../Common/Loading";
import TemplateSidebar from "./TemplateSidebar";
import DesignCanvas from "./DesignCanvas";
import PropertiesPanel from "./PropertiesPanel";
import TemplateToolbar from "./TemplateToolbar";
//import DragDropBuilder from './DragDropBuilder';
import apiaxios from "../../utils/api";
import VariablesPanel from "./VariablesPanel";
import { useAuth } from "../../contexts/AuthContext";
import CodePrevew from "./CodePrevew";
const EmailDesigner = () => {
  const { user } = useAuth();
  const textareaRef = useRef(null);
  const EditorRef = useRef(null);
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [designConfig, setDesignConfig] = useState({
    backgroundColor: "#ffffff",
    textColor: "#333333",
    primaryColor: "#6366f1",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    borderRadius: "8px",
    padding: "20px",
  });
  const [htmlContent, setHtmlContent] = useState("");
  const [activeTab, setActiveTab] = useState("Editor"); // New tab for drag & drop
  const [showPreview, setShowPreview] = useState(false);
  const [builderContent, setBuilderContent] = useState("");
  const [showVariablesPanel, setShowVariablesPanel] = useState(false);
  const { callAPI, loading, error, clearError } = useSecureAPI();
  const defaultTemplate = `<div style="font-family: Arial, sans-serif; color: #333; background: #fff; padding: 20px; max-width: 600px; margin: 0 auto;">
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

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (currentTemplate) {
      setHtmlContent(currentTemplate.htmlContent);
      setDesignConfig(currentTemplate.designConfig);
      setBuilderContent(currentTemplate.builderContent || "");
    }
  }, [currentTemplate]);

  const fetchTemplates = async () => {
    await callAPI(async () => {
      const response = await apiaxios("/api/template-designs");
      setTemplates(response?.data.data?.templates || []);
    });
  };

  const handleTemplateUpdate = async (newHtmlContent, name,category,subject, builderData = null) => {
    if (currentTemplate) {
      await callAPI(async () => {
        const response = await apiaxios.patch(
          `/api/template-designs/${currentTemplate._id}`,
          {
            name,
            category,
            subject,
            htmlContent: newHtmlContent,
            builderContent: builderData || builderContent,
          }
        );
        setCurrentTemplate(response?.data.data.template);
        setHtmlContent(newHtmlContent);
        fetchTemplates();
      });
    }
  };

  const handleCreateTemplate = async (templateData) => {
    await callAPI(async () => {
      const response = await apiaxios.post(
        "/api/template-designs",
        templateData
      );
      const data = response?.data;
      setCurrentTemplate(data.data.template);
      fetchTemplates();
    });
  };
  const handleCreateFromDefault = (template) => {
    const date = new Date();
    handleCreateTemplate({
      name: `New Template ${date.getTime()}`,
      category: "professional",
      subject: "Job Application - {position}",
      htmlContent: defaultTemplate,
      variables: [
        { name: "companyName", description: "Company name", defaultValue: "" },
        { name: "position", description: "Job position", defaultValue: "" },
        { name: "userName", description: "Your name", defaultValue: "" },
      ],
    });
  };
  const handleTemplateSelect = (template) => {
    setCurrentTemplate(template);
    setHtmlContent(template.htmlContent);
    setDesignConfig(template.designConfig);
    setBuilderContent(template.builderContent || "");
  };

  const applyDesignToHtml = (html) => {
    // normalize input: sometimes a non-string (object/null) is passed in
    if (html && typeof html === "object" && "htmlContent" in html) {
      html = html.htmlContent;
    }
    html = html == null ? "" : String(html);

    const safe = (value) => (value == null ? "" : String(value));

    return html
      .replace(/{{backgroundColor}}/g, safe(designConfig.backgroundColor))
      .replace(/{{textColor}}/g, safe(designConfig.textColor))
      .replace(/{{primaryColor}}/g, safe(designConfig.primaryColor))
      .replace(/{{fontFamily}}/g, safe(designConfig.fontFamily))
      .replace(/{{fontSize}}/g, safe(designConfig.fontSize))
      .replace(/{{borderRadius}}/g, safe(designConfig.borderRadius))
      .replace(/{{padding}}/g, safe(designConfig.padding));
  };

  const handelShowPreview = useCallback((show) => {
    setShowPreview(show);
  }, []);

  const handleInsertVariable = (variableName) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      htmlContent.substring(0, start) +
      `${variableName}` +
      htmlContent.substring(end);

    setHtmlContent(newText);
    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + variableName.length + 4,
        start + variableName.length + 4
      );
    }, 0);
  };

  if (loading && templates.length === 0) {
    return <Loading message="Loading email designer..." />;
  }

  return (
    <div
      className="email-designer"
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        backgroundColor: "#f5f7fa",
        flexDirection: "column"
      }}
    >
      <ErrorMessage message={error} onClose={clearError} />

      {/* Toolbar */}
      {currentTemplate && (
        <TemplateToolbar
          currentTemplate={currentTemplate}
          onUpdateTemplate={handleTemplateUpdate}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPreviewToggle={handelShowPreview}
          showPreview={showPreview}
          loading={loading}
          includeDragDrop={true}
          onToggleVariables={() => setShowVariablesPanel(!showVariablesPanel)} // Add this
          showVariablesPanel={showVariablesPanel}
        />
      )}
      <div
        style={{
          flex: 1,
          display: "flex",
          height: "100%",
        }}
      >
        {/* Left Sidebar - Templates */}
        <TemplateSidebar
          templates={templates}
          currentTemplate={currentTemplate}
          onTemplateSelect={handleTemplateSelect}
          onCreateTemplate={handleCreateTemplate}
          loading={loading}
        />
        {!currentTemplate ? (
          <div
            className="flex justify-between items-center"
            style={{
              flex: 1,
              color: "#666",
              fontSize: "1.2rem",
            }}
          >
            <div
              style={{ flexDirection: "column", gap: "5px", width: "100%" }}
              className="flex justify-between items-center"
            >
              <p>
                Please select or create a template to start designing your
                email.
              </p>
              <button
                onClick={() =>
                  handleCreateFromDefault({
                    name: "Default Template",
                    category: "professional",
                  })
                }
                className="btn btn-primary"
                style={{ marginLeft: "1rem" }}
              >
                Create from Default Template
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* Main Content Area */}
        {currentTemplate && (           
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          {showPreview ? (
            <CodePrevew
              activeTab={activeTab}
              processedHtml={applyDesignToHtml(htmlContent)}
            />
          ) : (
            <DesignCanvas
              htmlContent={htmlContent}
              designConfig={designConfig}
              onHtmlContentChange={(content) => {
                setHtmlContent(content);
                if (currentTemplate) {
                  handleTemplateUpdate(content);
                }
              }}
              applyDesignToHtml={applyDesignToHtml}
              activeTab={activeTab}
              showPreview={false}
              currentTemplate={currentTemplate}
              handleTemplateUpdate={handleTemplateUpdate}
            />
          )}
        </div>
            )}

        {/* Right Sidebar - Variables Panel */}

        {/* Properties Panel (only show for non-dragdrop tabs) */}
        {currentTemplate && !showPreview && (
          <div
            style={{
              width: "300px",
              borderLeft: "1px solid #e2e8f0",
              padding: "0",
              overflowY: "auto",
            }}
          >
            {showVariablesPanel && !showPreview && (
              <VariablesPanel
                onInsertVariable={handleInsertVariable}
                userData={user || {}}
                companyData={currentTemplate?.companyData || {}}
              />
            )}
            <PropertiesPanel
              designConfig={designConfig}
              onDesignConfigChange={setDesignConfig}
              currentTemplate={currentTemplate}
              onUpdateTemplate={handleTemplateUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDesigner;
