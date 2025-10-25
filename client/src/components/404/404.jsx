import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './404.css';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Floating elements data
  const floatingElements = ['🔍', '📄', '❓', '🚧', '🔗', '🌐', '📱', '💻'];

  return (
    <div className="not-found-container">
      {/* Animated background */}
      <div className="animated-bg">
        {floatingElements.map((emoji, index) => (
          <div
            key={index}
            className="floating-element"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.5}s`,
              fontSize: `${Math.random() * 20 + 20}px`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="not-found-content">
        {/* Animated 404 text */}
        <div className="error-code">
          <span className="digit">4</span>
          <span className="digit">0</span>
          <span className="digit">4</span>
        </div>

        {/* Animated title */}
        <h1 className="error-title">
          Page Not Found
          <span className="title-underline"></span>
        </h1>

        {/* Error message */}
        <div className="error-message">
          <p>Oops! The page you're looking for seems to have wandered off.</p>
          <p>It might have been moved, deleted, or never existed in the first place.</p>
        </div>

        {/* Interactive search area */}
        <div className="search-suggestion">
          <div className="search-icon">🔍</div>
          <p>Try searching or check the URL for typos</p>
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={handleGoHome}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            🏠 Go Home
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleGoBack}
          >
            ↩️ Go Back
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Page
          </button>
        </div>

        {/* Additional help */}
        <div className="help-section">
          <p>Need help? <a href="/contact">Contact support</a> or <a href="/help">visit our help center</a></p>
        </div>
      </div>

      {/* Floating cursor follower */}
      <div 
        className="cursor-follower"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          opacity: isHovered ? 0.7 : 0.3
        }}
      ></div>
    </div>
  );
};

export default NotFoundPage;