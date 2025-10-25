import React, { useState, useRef ,useEffect} from 'react';
import apiAxios from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
//import './Profile.css';
import ErrorMessage from '../Common/ErrorMessage';
const Profile = () => {
  const {user ,logout}= useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avaterSubmitLoading, setAvaterSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    title: user?.title || '',
    experience: user?.experience || '',
    skills: user?.skills || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    github: user?.github || ''
  });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleUpadateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Simulate uploading and getting a URL
      setAvatarFile(file);
      const avatarUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      // const formData = new FormData();
      // formData.append('avatar', file);
      
      // try {
      //   const response = await apiAxios.post('/api/user/avatar', formData,
      //   );
        
      //   const data =  response.data;
      //   console.log(data);
        
      //   // if (data.success) {
      //   //  await handleUpadateProfile({ avatar: data.avatarUrl });
      //   // }
      // } catch (error) {
      //   console.error('Error uploading avatar:', error);
      // }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      title: user?.title || '',
      experience: user?.experience || '',
      skills: user?.skills || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
      website: user?.website || '',
      linkedin: user?.linkedin || '',
      github: user?.github || ''
    });
    setIsEditing(false);
  };
  const handleUpadateProfile = async (updatedData) => {
    try {
      const response = await apiAxios.put('/api/user/profile', updatedData);

        const data = response.data;
        setFormData(prev => ({ ...prev, ...data.user }));
      
    }
    catch (error) {
      console.error('Error updating profile:', error);
    }
    };
  const handleAvaterSubmit = async () => {
       const formData = new FormData();
       formData.append('avatar', avatarFile);
    try {
      setAvaterSubmitLoading(true);
      const response = await apiAxios.post('/api/user/avatar', formData);  
      const data = response.data;
      setFormData(prev => ({ ...prev, avatar: data.user?.avatar }));
      setAvaterSubmitLoading(false);
    }
    catch (error) {
      setAvaterSubmitLoading(false);
      console.error('Error updating avatar:', error);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="avatar-container">
            <img 
              src={formData.avatar || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-avatar"
            />
            {isEditing && (
              <button 
                className="avatar-edit-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fas fa-camera"></i>
              </button>
            )}
            {/* <form> */}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
             {isEditing && avatarFile && (
             <input
              className='btn btn-primary'
              type="button"
              onClick={() => handleAvaterSubmit()}
              disabled={avaterSubmitLoading}
              value={`${avaterSubmitLoading ? "Loading.." : 'Upload'}`}/>
            )}
            {/* </form> */}

          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-title">{user?.title}</p>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">24</span>
                <span className="stat-label">Applications</span>
              </div>
              <div className="stat">
                <span className="stat-number">12</span>
                <span className="stat-label">Interviews</span>
              </div>
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Offers</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Personal Info
            </button>
            <button 
              className={`nav-item ${activeTab === 'professional' ? 'active' : ''}`}
              onClick={() => setActiveTab('professional')}
            >
              <i className="fas fa-briefcase"></i>
              Professional
            </button>
            <button 
              className={`nav-item ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              <i className="fas fa-share-alt"></i>
              Social Links
            </button>
            <button 
              className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <i className="fas fa-sliders-h"></i>
              Preferences
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-shield-alt"></i>
              Security
            </button>
          </nav>
        </div>

        <div className="profile-main">
          {activeTab === 'profile' && (
            <PersonalInfoTab 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isEditing={isEditing} 
            />
          )}

          {activeTab === 'professional' && (
            <ProfessionalTab 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isEditing={isEditing} 
            />
          )}

          {activeTab === 'social' && (
            <SocialLinksTab 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isEditing={isEditing} 
            />
          )}

          {activeTab === 'preferences' && <PreferencesTab />}
          {activeTab === 'security' && <SecurityTab onLogout={logout} />}
        </div>
      </div>
    </div>
  );
};

// Tab Components
const PersonalInfoTab = ({ formData, handleInputChange, isEditing }) => (
  <div className="tab-content">
    <h2>Personal Information</h2>
    <form className="profile-form">
      <div className="form-row">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          disabled={!isEditing}
          rows="4"
          placeholder="Tell us about yourself..."
        />
      </div>
    </form>
  </div>
);

const ProfessionalTab = ({ formData, handleInputChange, isEditing }) => (
  <div className="tab-content">
    <h2>Professional Information</h2>
    <form className="profile-form">
      <div className="form-row">
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="e.g., 5 years"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Skills</label>
        <textarea
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
          disabled={!isEditing}
          rows="3"
          placeholder="List your skills separated by commas"
        />
      </div>
    </form>
  </div>
);

const SocialLinksTab = ({ formData, handleInputChange, isEditing }) => (
  <div className="tab-content">
    <h2>Social Links</h2>
    <form className="profile-form">
      <div className="form-group">
        <label>Website</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          disabled={!isEditing}
          placeholder="https://yourwebsite.com"
        />
      </div>
      <div className="form-group">
        <label>LinkedIn</label>
        <input
          type="url"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleInputChange}
          disabled={!isEditing}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>
      <div className="form-group">
        <label>GitHub</label>
        <input
          type="url"
          name="github"
          value={formData.github}
          onChange={handleInputChange}
          disabled={!isEditing}
          placeholder="https://github.com/yourusername"
        />
      </div>
    </form>
  </div>
);

const PreferencesTab = () => (
  <div className="tab-content">
    <h2>Preferences</h2>
    <div className="settings-list">
      <div className="setting-item">
        <div className="setting-info">
          <h4>Email Notifications</h4>
          <p>Receive email updates about your applications</p>
        </div>
        <label className="switch">
          <input type="checkbox" defaultChecked />
          <span className="slider"></span>
        </label>
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <h4>Job Alerts</h4>
          <p>Get notified about new job opportunities</p>
        </div>
        <label className="switch">
          <input type="checkbox" defaultChecked />
          <span className="slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <div className="setting-info">
          <h4>Weekly Reports</h4>
          <p>Receive weekly application summaries</p>
        </div>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  </div>
);


const SecurityTab = ({ onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [processing, setProcessing] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);

  // show/hide toggles for password fields
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // try to read 2FA status if endpoint exists; fail silently if not
    let mounted = true;
    (async () => {
      try {
        const res = await apiAxios.get('/api/user/2fa/status');
        if (mounted) setTwoFAEnabled(Boolean(res.data?.enabled));
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const clearAlerts = () => {
    setMsg('');
    setErr('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErr('Please fill all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErr('New password and confirmation do not match.');
      return;
    }

    setProcessing(true);
    try {
      await apiAxios.put('/api/user/password', {
        currentPassword,
        newPassword
      });
      setMsg('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggle2FA = async () => {
    clearAlerts();
    setTwoFALoading(true);
    try {
      if (twoFAEnabled) {
        await apiAxios.post('/api/user/2fa/disable');
        setTwoFAEnabled(false);
        setMsg('Two-factor authentication disabled.');
      } else {
        const res = await apiAxios.post('/api/user/2fa/enable');
        setTwoFAEnabled(true);
        setMsg(res.data?.message || 'Two-factor authentication enabled.');
      }
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to toggle 2FA.');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    clearAlerts();
    if (!window.confirm('This will permanently delete your account and all data. Continue?')) return;
    setProcessing(true);
    try {
      await apiAxios.delete('/api/user');
      onLogout?.();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to delete account.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="tab-content">
      <h2>Security Settings</h2>
      <ErrorMessage message={err}  />
      {msg && <div className="alert alert-success">{msg}</div>}
      {/* {err && <div className="alert alert-danger">{err}</div>} */}

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword} className="profile-form">
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Current Password</label>
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(s => !s)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '36px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#555'
              }}
              aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
            >
              {showCurrent ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label>New Password</label>
            <input
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(s => !s)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '36px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#555'
              }}
              aria-label={showNew ? 'Hide new password' : 'Show new password'}
            >
              {showNew ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label>Confirm New Password</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(s => !s)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '36px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#555'
              }}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" disabled={processing}>
              {processing ? 'Saving...' : 'Change Password'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => {
              setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); clearAlerts();
              setShowCurrent(false); setShowNew(false); setShowConfirm(false);
            }} disabled={processing}>
              Reset
            </button>
          </div>
        </form>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Two-Factor Authentication (2FA)</h3>
        <p className="text-muted">Add an extra layer of security to your account.</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className="btn"
            onClick={handleToggle2FA}
            disabled={twoFALoading}
          >
            {twoFALoading ? 'Processing...' : (twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA')}
          </button>
          <span style={{ color: '#666' }}>
            Status: {twoFAEnabled ? <strong>Enabled</strong> : <strong>Disabled</strong>}
          </span>
        </div>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Account Actions</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="security-btn logout-btn btn" onClick={onLogout}>
            <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i>
            Logout
          </button>
          <button
            className="security-btn btn btn-danger"
            onClick={handleDeleteAccount}
            disabled={processing}
          >
            <i className="fas fa-trash-alt" style={{ marginRight: '0.5rem' }}></i>
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
};


export default Profile;