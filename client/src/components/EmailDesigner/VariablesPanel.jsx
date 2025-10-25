import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { VARIABLE_CATEGORIES,CATEGORY_CONFIG,DEFAULT_VALUES} from '../../utils/constants';



const VariablesPanel = ({ onInsertVariable, userData = {}, companyData = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [livePreview, setLivePreview] = useState(false);
  const [previewVariable, setPreviewVariable] = useState(null);
  const [recentlyUsed, setRecentlyUsed] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Favorites persistence
  useEffect(() => {
    const savedFavorites = localStorage.getItem('variableFavorites');
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
  }, []);

  useEffect(() => {
    localStorage.setItem('variableFavorites', JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = useCallback((variableName, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.has(variableName) ? newFavorites.delete(variableName) : newFavorites.add(variableName);
      return newFavorites;
    });
  }, []);

  const addToRecentlyUsed = useCallback((variableName) => {
    setRecentlyUsed(prev => {
      const filtered = prev.filter(v => v !== variableName);
      return [variableName, ...filtered].slice(0, 5);
    });
  }, []);

  // Dynamic variable categories with loops
  const variableCategories = useMemo(() => {
    const categories = [];
    
    // Loop through all category keys from CATEGORY_CONFIG
    for (const categoryId in CATEGORY_CONFIG) {
      const category = { ...CATEGORY_CONFIG[categoryId], id: categoryId };
      
      if (categoryId === VARIABLE_CATEGORIES.FAVORITES) {
        // Populate favorites dynamically
        const favoriteVariables = [];
        for (const favName of favorites) {
          let foundVariable = null;
          // Search through all categories to find the variable
          for (const configCategoryId in CATEGORY_CONFIG) {
            if (configCategoryId === VARIABLE_CATEGORIES.FAVORITES || 
                configCategoryId === VARIABLE_CATEGORIES.RECENT) continue;
                
            const configCategory = CATEGORY_CONFIG[configCategoryId];
            for (const variable of configCategory.variables) {
              if (variable.name === favName) {
                foundVariable = variable;
                break;
              }
            }
            if (foundVariable) break;
          }
          
          favoriteVariables.push(foundVariable || { 
            name: favName, 
            description: 'Favorite variable', 
            placeholder: `{${favName}}` 
          });
        }
        category.variables = favoriteVariables;
      } 
      else if (categoryId === VARIABLE_CATEGORIES.RECENT) {
        // Populate recent variables dynamically
        const recentVariables = [];
        for (const recName of recentlyUsed) {
          let foundVariable = null;
          // Search through all categories to find the variable
          for (const configCategoryId in CATEGORY_CONFIG) {
            if (configCategoryId === VARIABLE_CATEGORIES.FAVORITES || 
                configCategoryId === VARIABLE_CATEGORIES.RECENT) continue;
                
            const configCategory = CATEGORY_CONFIG[configCategoryId];
            for (const variable of configCategory.variables) {
              if (variable.name === recName) {
                foundVariable = variable;
                break;
              }
            }
            if (foundVariable) break;
          }
          
          recentVariables.push(foundVariable || { 
            name: recName, 
            description: 'Recently used variable', 
            placeholder: `{${recName}}` 
          });
        }
        category.variables = recentVariables;
      }
      
      categories.push(category);
    }
    
    return categories;
  }, [favorites, recentlyUsed]);

  // Dynamic value mapping with loops
  const getVariableValue = useCallback((variableName) => {
    const values = {};
    
    // Map company data with fallbacks
    for (const key in DEFAULT_VALUES) {
      if (companyData[key] !== undefined) {
        values[key] = companyData[key];
      } else if (userData[key] !== undefined) {
        values[key] = userData[key];
      } else {
        values[key] = DEFAULT_VALUES[key];
      }
    }
    
    // Handle dynamic values
    values.currentDate = new Date().toLocaleDateString();
    values.currentYear = new Date().getFullYear().toString();
    
    return values[variableName] || `[${variableName}]`;
  }, [companyData, userData]);

  // Dynamic variable filtering with loops
  const filteredVariables = useMemo(() => {
    if (!debouncedSearch && selectedCategory === 'all') return [];

    const allVariables = [];
    
    // Loop through categories
    for (const category of variableCategories) {
      if (selectedCategory === 'all' || selectedCategory === category.id) {
        // Loop through variables in category
        for (const variable of category.variables) {
          if (!debouncedSearch || 
              variable.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              variable.description.toLowerCase().includes(debouncedSearch.toLowerCase())) {
            allVariables.push({
              ...variable,
              category: category.name,
              categoryColor: category.color,
              isFavorite: favorites.has(variable.name),
              isRecent: recentlyUsed.includes(variable.name)
            });
          }
        }
      }
    }
    
    return allVariables;
  }, [debouncedSearch, selectedCategory, variableCategories, favorites, recentlyUsed]);

  const handleVariableClick = useCallback((variable) => {
    onInsertVariable(variable.placeholder);
    addToRecentlyUsed(variable.name);
  }, [onInsertVariable, addToRecentlyUsed]);

  const handleVariableHover = useCallback((variable) => {
    setPreviewVariable(variable);
    setLivePreview(true);
  }, []);

  const handleVariableHoverLeave = useCallback(() => {
    setLivePreview(false);
  }, []);

  // Dynamic category buttons
  const renderCategoryButtons = () => {
    const buttons = [];
    
    // All button
    buttons.push(
      <button
        key="all"
        onClick={() => setSelectedCategory('all')}
        style={{
          background: selectedCategory === 'all' ? '#6366f1' : 'white',
          color: selectedCategory === 'all' ? 'white' : '#374151',
          border: `1px solid ${selectedCategory === 'all' ? '#6366f1' : '#e2e8f0'}`,
          padding: '0.4rem 0.6rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        All
      </button>
    );
    
    // Loop through categories to create buttons
    for (const category of variableCategories) {
      buttons.push(
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          style={{
            background: selectedCategory === category.id ? category.color : 'white',
            color: selectedCategory === category.id ? 'white' : '#374151',
            border: `1px solid ${selectedCategory === category.id ? category.color : '#e2e8f0'}`,
            padding: '0.4rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            opacity: category.variables.length === 0 ? 0.5 : 1
          }}
          disabled={category.variables.length === 0}
        >
          <i className={category.icon} style={{ fontSize: '0.7rem' }}></i>
          {category.name}
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div style={{ width: '100%', background: 'white', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
          <i className="fas fa-magic" style={{ marginRight: '0.5rem', color: '#6366f1' }}></i>
          Variables
        </h3>
        
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 2rem 0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem' }}
          />
          <i className="fas fa-search" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {renderCategoryButtons()}
        </div>
      </div>

      {/* Variables List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem' }}>
        {filteredVariables.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 1rem' }}>
            <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}></i>
            <p>No variables found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredVariables.map((variable, index) => (
              <VariableItem
                key={`${variable.name}-${index}`}
                variable={variable}
                getVariableValue={getVariableValue}
                onInsert={handleVariableClick}
                onHover={handleVariableHover}
                onHoverLeave={handleVariableHoverLeave}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {livePreview && previewVariable && (
        <VariablePreview 
          variable={previewVariable} 
          getVariableValue={getVariableValue} 
        />
      )}
    </div>
  );
};

const VariableItem = React.memo(({ variable, getVariableValue, onInsert, onHover, onHoverLeave, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onInsert(variable)}
      onMouseEnter={() => { setIsHovered(true); onHover(variable); }}
      onMouseLeave={() => { setIsHovered(false); onHoverLeave(); }}
      style={{
        background: 'white',
        border: `1px solid ${isHovered ? variable.categoryColor : '#e2e8f0'}`,
        borderRadius: '6px',
        padding: '0.75rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: variable.categoryColor }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '0.5rem' }}>
        <div>
          <code style={{ background: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
            {variable.placeholder}
          </code>
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>{variable.description}</div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={(e) => onToggleFavorite(variable.name, e)}
            style={{ background: 'transparent', border: 'none', color: variable.isFavorite ? '#f59e0b' : '#d1d5db', cursor: 'pointer' }}
          >
            <i className="fas fa-star"></i>
          </button>
        </div>
      </div>
    </div>
  );
});

const VariablePreview = React.memo(({ variable, getVariableValue }) => (
  <div style={{
    padding: '1rem',
    borderTop: '1px solid #e2e8f0',
    background: '#f8fafc',
    position: 'absolute',
    top: '68%',
    right: '295px',
  }}>
    <div style={{ background: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <code style={{ background: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          {variable.placeholder}
        </code>
        <span style={{ background: variable.categoryColor, color: 'white', padding: '0.1rem 0.4rem', borderRadius: '10px', fontSize: '0.7rem' }}>
          {variable.category}
        </span>
      </div>
      <div style={{ fontSize: '0.9rem', color: '#0c4a6e' }}>Example: {getVariableValue(variable.name)}</div>
    </div>
  </div>
));

export default VariablesPanel;
//export { EMAIL_PLACEHOLDERS, VARIABLE_CATEGORIES, CATEGORY_CONFIG, DEFAULT_VALUES };