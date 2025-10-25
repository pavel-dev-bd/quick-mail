import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileMenu from '../Profile/ProfileMenu';
import logo from '../../assets/logo/quick-logo.png';
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
 const handleProfileClick = () => {
    // Navigate to profile page
    window.location.href = '/profile';
  };


  return (
    <header className="header">
      <div className="header-content">
    <nav className="navbar">
      <div className="nav-brand">
        <img src={logo} alt="logo" height={50} width={50} />
        {import.meta.env.VITE_APP_NAME || 'Quick 4 Apply'}
      </div>
      <div className="nav-links">
        <button 
          onClick={() => handleNavigation('/dashboard')}
          className={isActive('/dashboard')}
        >
          <i className="fas fa-tachometer-alt" style={{ marginRight: '0.5rem' }}></i>
          Dashboard
        </button>
        <button 
          onClick={() => handleNavigation('/companies')}
          className={isActive('/companies')}
        >
          <i className="fas fa-building" style={{ marginRight: '0.5rem' }}></i>
          Companies
        </button>
        <button 
          onClick={() => handleNavigation('/resumes')}
          className={isActive('/resumes')}
        >
          <i className="fas fa-file-alt" style={{ marginRight: '0.5rem' }}></i>
          Resumes
        </button>
        <button 
          onClick={() => handleNavigation('/send-emails')}
          className={isActive('/send-emails')}
        >
          <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
          Send Emails
        </button>
        {/* <button 
          onClick={() => handleNavigation('/templates')}
          className={isActive('/templates')}
        >
          <i className="fas fa-pencil-alt" style={{ marginRight: '0.5rem' }}></i>
          Templates
        </button> */}
        <button 
          onClick={() => handleNavigation('/email-designer')}
          className={isActive('/email-designer')}
        >
          <i className="fas fa-paint-brush" style={{ marginRight: '0.5rem' }}></i>
          Email Designer
        </button>
        <button 
          onClick={() => handleNavigation('/smtp')}
          className={isActive('/smtp')}
        >
          <i className="fas fa-server" style={{ marginRight: '0.5rem' }}></i>
          SMTP Settings
        </button>
        <button 
          onClick={() => handleNavigation('/history')}
          className={isActive('/history')}
        >
          <i className="fas fa-history" style={{ marginRight: '0.5rem' }}></i>
          History
        </button>
        {/* <button onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i>
          Logout ({user?.name})
        </button> */}
      </div>
       <ProfileMenu 
          user={user}

          onLogout={handleLogout}
        />
    </nav>
    </div>
  </header>
  );
};
// App.js or Header component


const Navbar2 = () => {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/path/to/avatar.jpg',
    title: 'Senior Developer'
  };

  const handleProfileClick = () => {
    // Navigate to profile page
    window.location.href = '/profile';
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">JobTracker</div>
        <ProfileMenu 
          user={user}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};
export default Navbar;

