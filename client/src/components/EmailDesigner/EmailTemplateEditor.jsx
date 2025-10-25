import React, { useRef ,useCallback,useState, useEffect} from "react";
import Editor from "@monaco-editor/react";

const EmailTemplateEditor = ({ value, handleTemplateUpdate }) => {
// EmailTemplateMonaco.jsx
  const [htmlContent, setHtmlContent] = useState(value || "");
  const editorRef = useRef(null);   // Monaco editor instance
  const monacoRef = useRef(null);   // Monaco namespace

  // onMount receives (editor, monaco) from @monaco-editor/react
  const handleEditorMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }, []);

  const handleInsertVariable = useCallback((variableName) => {
    // ensure editor + monaco ready
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    // Get current selection (works for cursor or selection)
    const selection = editor.getSelection(); // Selection object
    // Build a range from that selection
    const range = new monaco.Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn
    );

    // The text to insert (you can wrap with braces here if needed)
    const textToInsert = `{${variableName}}`; // e.g. {username}

    // Apply the edit
    editor.executeEdits("insert-variable", [
      {
        range,
        text: textToInsert,
        forceMoveMarkers: true,
      },
    ]);

    // Calculate new cursor position:
    // If selection was single-line, keep in same line; otherwise place at end of inserted text
    const newLineNumber = range.startLineNumber + (textToInsert.split("\n").length - 1);
    // If inserted text is multi-line we position column accordingly; otherwise startColumn + length
    const lastLine = textToInsert.split("\n").slice(-1)[0];
    const newColumn = (textToInsert.includes("\n") ? lastLine.length + 1 : range.startColumn + lastLine.length);

    // Set cursor after inserted text
    editor.setPosition({ lineNumber: newLineNumber, column: newColumn });
    editor.focus();

    // Update React state with editor value (keeps parent in sync)
    const updated = editor.getValue();
    setHtmlContent(updated);
  }, [setHtmlContent]);
  
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
    { name: 'nextMonth', description: 'Date one month from now' },
  ];
  useEffect(() => {
    setHtmlContent(value);
  }, [value]);
  return (
    <div>
      <div style={{    padding: '1rem', 
        borderBottom: '1px solid #e2e8f0',display: 'flex', gap: '0.25rem', flexWrap: 'wrap',marginBottom: 12 }} >
        {variableSuggestions.map((variable, index) => (
              <button
                key={index}
                onClick={() => handleInsertVariable(variable.name)}
                className="btn btn-secondary btn-sm"
                title={variable.description}
                style={{padding:'6px'}}
              >
                {variable.name}
              </button>
            ))}
      </div>

      <Editor
        height="450px"
        defaultLanguage="html"
        value={htmlContent}
        onChange={(val) => setHtmlContent(val || "")}
        onMount={handleEditorMount}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
        }}
      />
      <button className="btn btn-primary" onClick={()=> handleTemplateUpdate(htmlContent)}>Save</button>
    </div>
  );
};

export default EmailTemplateEditor;

