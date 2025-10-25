import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// import './ProfileMenu.css';

const ProfileMenu = ({ user, onProfileClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    onProfileClick();
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button className="profile-menu-trigger" onClick={handleMenuToggle}>
        <img 
          src={user?.avatar || '/default-avatar.png'} 
          alt="Profile" 
          className="profile-menu-avatar"
        />
        <span className="profile-menu-name">{user?.name}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="profile-menu-dropdown">
          <div className="menu-header">
            <img 
              src={user?.avatar || '/default-avatar.png'} 
              alt="Profile" 
              className="menu-avatar"
            />
            <div className="menu-user-info">
              <div className="menu-user-name">{user?.name}</div>
              <div className="menu-user-email">{user?.email}</div>
            </div>
          </div>

          <div className="menu-divider"></div>

          <div className="menu-items">
            <Link to={'/profile'} className="menu-item" >
              <i className="fas fa-user"></i>
              My Profile
            </Link>
            <Link to={'/settings'} className="menu-item">
              <i className="fas fa-cog"></i>
              Settings
            </Link>
            <Link to={'/notifications'} className="menu-item">
              <i className="fas fa-bell"></i>
              Notifications
            </Link>
            <Link to={'/help'} className="menu-item">
              <i className="fas fa-question-circle"></i>
              Help & Support
            </Link>
          </div>

          <div className="menu-divider"></div>

          <div className="menu-items">
            <button className="menu-item logout-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;