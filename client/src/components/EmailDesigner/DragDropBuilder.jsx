import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Drag & Drop Types
const ItemTypes = {
  ELEMENT: 'element',
  SECTION: 'section'
};

// Element Components
const TextElement = ({ content, onUpdate, onSelect, isSelected }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,
    item: { type: 'text' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1rem',
        background: 'white',
        marginBottom: '0.5rem',
        cursor: 'move',
        minHeight: '50px'
      }}
      onClick={() => onSelect('text')}
    >
      {content ? (
        <div 
          contentEditable
          dangerouslySetInnerHTML={{ __html: content }}
          onBlur={(e) => onUpdate(e.target.innerHTML)}
          style={{ outline: 'none' }}
        />
      ) : (
        <div 
          contentEditable
          onBlur={(e) => onUpdate(e.target.innerHTML)}
          style={{ 
            outline: 'none',
            color: '#666',
            fontStyle: 'italic'
          }}
        >
          Click to edit text...
        </div>
      )}
    </div>
  );
};

const ButtonElement = ({ text, url, onUpdate, onSelect, isSelected }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,
    item: { type: 'button' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1rem',
        background: 'white',
        marginBottom: '0.5rem',
        cursor: 'move'
      }}
      onClick={() => onSelect('button')}
    >
      <div style={{ textAlign: 'center' }}>
        <a
          href={url || '#'}
          style={{
            display: 'inline-block',
            background: '#6366f1',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {text || 'Click Me'}
        </a>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
          Double click to edit button
        </div>
      </div>
    </div>
  );
};

const ImageElement = ({ src, alt, onUpdate, onSelect, isSelected }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,
    item: { type: 'image' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({ src: event.target.result, alt: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1rem',
        background: 'white',
        marginBottom: '0.5rem',
        cursor: 'move',
        textAlign: 'center'
      }}
      onClick={() => onSelect('image')}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            borderRadius: '4px'
          }} 
        />
      ) : (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label 
            htmlFor="image-upload"
            style={{
              display: 'inline-block',
              padding: '2rem',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            <i className="fas fa-image" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
            Click to upload image
          </label>
        </div>
      )}
    </div>
  );
};

const DividerElement = ({ onSelect, isSelected }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,
    item: { type: 'divider' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1rem',
        background: 'white',
        marginBottom: '0.5rem',
        cursor: 'move'
      }}
      onClick={() => onSelect('divider')}
    >
      <hr style={{ 
        border: 'none', 
        borderTop: '2px solid #e2e8f0',
        margin: '1rem 0'
      }} />
    </div>
  );
};

// Section Component
const Section = ({ children, onDrop, id }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.ELEMENT, ItemTypes.SECTION],
    drop: (item) => onDrop(item, id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        background: isOver ? '#f0f9ff' : 'transparent',
        border: isOver ? '2px dashed #6366f1' : '2px dashed transparent',
        borderRadius: '8px',
        padding: '1rem',
        minHeight: '100px',
        marginBottom: '1rem',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </div>
  );
};

// Elements Panel
const ElementsPanel = () => {
  const elements = [
    { type: 'text', icon: 'fas fa-text-width', label: 'Text', description: 'Add text content' },
    { type: 'button', icon: 'fas fa-square', label: 'Button', description: 'Call-to-action button' },
    { type: 'image', icon: 'fas fa-image', label: 'Image', description: 'Insert an image' },
    { type: 'divider', icon: 'fas fa-minus', label: 'Divider', description: 'Horizontal line' },
    { type: 'spacer', icon: 'fas fa-arrows-alt-v', label: 'Spacer', description: 'Vertical space' },
    { type: 'social', icon: 'fas fa-share-alt', label: 'Social', description: 'Social media icons' }
  ];

  return (
    <div style={{
      width: '250px',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      padding: '1rem',
      height: '100%',
      overflow: 'auto'
    }}>
      <h4 style={{ margin: '0 0 1rem 0' }}>Elements</h4>
      <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 1rem 0' }}>
        Drag elements to the canvas
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {elements.map((element) => (
          <DraggableElement key={element.type} element={element} />
        ))}
      </div>
    </div>
  );
};

const DraggableElement = ({ element }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,
    item: { type: element.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        background: '#f8f9fa',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '0.75rem',
        cursor: 'move',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#e3f2fd';
        e.currentTarget.style.borderColor = '#6366f1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f8f9fa';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <i className={element.icon} style={{ color: '#6366f1', fontSize: '1.1rem' }}></i>
        <div>
          <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{element.label}</div>
          <div style={{ color: '#666', fontSize: '0.7rem' }}>{element.description}</div>
        </div>
      </div>
    </div>
  );
};

// Main Builder Component
const DragDropBuilder = ({ onTemplateUpdate, initialContent }) => {
  const [sections, setSections] = useState([
    {
      id: 'section-1',
      elements: []
    }
  ]);
  
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeSection, setActiveSection] = useState('section-1');

  // Initialize with default content if provided
  useEffect(() => {
    if (initialContent) {
      // Parse initial content and set sections
      try {
        const parsed = JSON.parse(initialContent);
        setSections(parsed.sections || []);
      } catch (error) {
        // If not JSON, treat as HTML and create a text element
        setSections([{
          id: 'section-1',
          elements: [
            { id: 'element-1', type: 'text', content: initialContent }
          ]
        }]);
      }
    }
  }, [initialContent]);

  // Generate unique IDs
  const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Handle element drop
  const handleDrop = (item, sectionId) => {
    const newElement = {
      id: generateId('element'),
      type: item.type,
      ...getDefaultContent(item.type)
    };

    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, elements: [...section.elements, newElement] }
        : section
    ));
  };

  // Get default content for element type
  const getDefaultContent = (type) => {
    switch (type) {
      case 'text':
        return { content: '<p>Start typing your text here...</p>' };
      case 'button':
        return { text: 'Click Here', url: '#' };
      case 'image':
        return { src: '', alt: 'Image' };
      case 'divider':
        return {};
      default:
        return {};
    }
  };

  // Update element content
  const updateElement = (sectionId, elementId, updates) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            elements: section.elements.map(element =>
              element.id === elementId
                ? { ...element, ...updates }
                : element
            )
          }
        : section
    ));
  };

  // Delete element
  const deleteElement = (sectionId, elementId) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            elements: section.elements.filter(element => element.id !== elementId)
          }
        : section
    ));
    setSelectedElement(null);
  };

  // Add new section
  const addSection = () => {
    const newSection = {
      id: generateId('section'),
      elements: []
    };
    setSections(prev => [...prev, newSection]);
    setActiveSection(newSection.id);
  };

  // Delete section
  const deleteSection = (sectionId) => {
    if (sections.length > 1) {
      setSections(prev => prev.filter(section => section.id !== sectionId));
      setActiveSection(sections.find(section => section.id !== sectionId)?.id || '');
    }
  };

  // Move element
  const moveElement = (fromSectionId, toSectionId, elementId) => {
    const element = sections
      .find(s => s.id === fromSectionId)
      ?.elements.find(e => e.id === elementId);

    if (element) {
      setSections(prev => prev.map(section => {
        if (section.id === fromSectionId) {
          return {
            ...section,
            elements: section.elements.filter(e => e.id !== elementId)
          };
        }
        if (section.id === toSectionId) {
          return {
            ...section,
            elements: [...section.elements, element]
          };
        }
        return section;
      }));
    }
  };

  // Export template as HTML
  const exportAsHtml = () => {
    const html = generateHtml();
    onTemplateUpdate(html);
    return html;
  };

  // Generate HTML from sections
  const generateHtml = () => {
    let html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">';
    
    sections.forEach(section => {
      html += '<div style="margin-bottom: 20px;">';
      
      section.elements.forEach(element => {
        switch (element.type) {
          case 'text':
            html += `<div>${element.content}</div>`;
            break;
          case 'button':
            html += `
              <div style="text-align: center; margin: 20px 0;">
                <a href="${element.url || '#'}" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  ${element.text || 'Click Here'}
                </a>
              </div>
            `;
            break;
          case 'image':
            if (element.src) {
              html += `
                <div style="text-align: center; margin: 20px 0;">
                  <img src="${element.src}" alt="${element.alt || 'Image'}" style="max-width: 100%; height: auto; border-radius: 4px;" />
                </div>
              `;
            }
            break;
          case 'divider':
            html += '<hr style="border: none; border-top: 2px solid #e2e8f0; margin: 20px 0;" />';
            break;
        }
      });
      
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  };

  // Render element based on type
  const renderElement = (element, sectionId) => {
    const commonProps = {
      key: element.id,
      onUpdate: (updates) => updateElement(sectionId, element.id, updates),
      onSelect: () => setSelectedElement({ ...element, sectionId }),
      isSelected: selectedElement?.id === element.id
    };

    switch (element.type) {
      case 'text':
        return <TextElement content={element.content} {...commonProps} />;
      case 'button':
        return <ButtonElement text={element.text} url={element.url} {...commonProps} />;
      case 'image':
        return <ImageElement src={element.src} alt={element.alt} {...commonProps} />;
      case 'divider':
        return <DividerElement {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Elements Panel */}
        <ElementsPanel />

        {/* Main Canvas */}
        <div style={{ 
          flex: 1, 
          background: '#f8f9fa',
          padding: '1rem',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '2rem',
            minHeight: '500px',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            {sections.map(section => (
              <Section 
                key={section.id} 
                id={section.id}
                onDrop={handleDrop}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h5 style={{ margin: 0 }}>Section</h5>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="btn btn-danger btn-sm"
                    disabled={sections.length <= 1}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                
                {section.elements.map(element => renderElement(element, section.id))}
                
                {section.elements.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#666', 
                    padding: '2rem',
                    border: '2px dashed #e2e8f0',
                    borderRadius: '8px'
                  }}>
                    <i className="fas fa-arrow-down" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                    <p>Drag elements here</p>
                  </div>
                )}
              </Section>
            ))}

            {/* Add Section Button */}
            <button
              onClick={addSection}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
              Add New Section
            </button>
          </div>
        </div>

        {/* Properties Panel */}
        <div style={{
          width: '300px',
          background: 'white',
          borderLeft: '1px solid #e2e8f0',
          padding: '1rem',
          height: '100%',
          overflow: 'auto'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Properties</h4>
          
          {selectedElement ? (
            <ElementProperties 
              element={selectedElement}
              onUpdate={(updates) => updateElement(selectedElement.sectionId, selectedElement.id, updates)}
              onDelete={() => deleteElement(selectedElement.sectionId, selectedElement.id)}
            />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '2rem' 
            }}>
              <i className="fas fa-mouse-pointer" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
              <p>Select an element to edit its properties</p>
            </div>
          )}

          {/* Export Button */}
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={exportAsHtml}
              className="btn"
              style={{ width: '100%' }}
            >
              <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i>
              Save Template
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

// Element Properties Panel
const ElementProperties = ({ element, onUpdate, onDelete }) => {
  const [properties, setProperties] = useState(element);

  useEffect(() => {
    setProperties(element);
  }, [element]);

  const handleUpdate = (key, value) => {
    const newProperties = { ...properties, [key]: value };
    setProperties(newProperties);
    onUpdate(newProperties);
  };

  const renderProperties = () => {
    switch (element.type) {
      case 'text':
        return (
          <div>
            <div className="form-group">
              <label>Text Content</label>
              <textarea
                value={properties.content || ''}
                onChange={(e) => handleUpdate('content', e.target.value)}
                rows="6"
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Enter your text content..."
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div>
            <div className="form-group">
              <label>Button Text</label>
              <input
                type="text"
                value={properties.text || ''}
                onChange={(e) => handleUpdate('text', e.target.value)}
                style={{ width: '100%' }}
                placeholder="Button text..."
              />
            </div>
            <div className="form-group">
              <label>Button URL</label>
              <input
                type="text"
                value={properties.url || ''}
                onChange={(e) => handleUpdate('url', e.target.value)}
                style={{ width: '100%' }}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={properties.backgroundColor || '#6366f1'}
                onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={properties.src || ''}
                onChange={(e) => handleUpdate('src', e.target.value)}
                style={{ width: '100%' }}
                placeholder="Image URL or upload..."
              />
            </div>
            <div className="form-group">
              <label>Alt Text</label>
              <input
                type="text"
                value={properties.alt || ''}
                onChange={(e) => handleUpdate('alt', e.target.value)}
                style={{ width: '100%' }}
                placeholder="Description for accessibility..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div style={{ color: '#666', textAlign: 'center' }}>
            No configurable properties for this element
          </div>
        );
    }
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h5 style={{ margin: 0, textTransform: 'capitalize' }}>
          {element.type} Properties
        </h5>
        <button
          onClick={onDelete}
          className="btn btn-danger btn-sm"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>

      {renderProperties()}
    </div>
  );
};

export default DragDropBuilder;