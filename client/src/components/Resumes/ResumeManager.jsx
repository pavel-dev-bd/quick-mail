import React, { useState, useEffect } from 'react';
import ResumeUpload from './ResumeUpload';
import { useSecureAPI } from '../../hooks/useSecureAPI';
import ErrorMessage from '../Common/ErrorMessage';
import Loading from '../Common/Loading';
import apiAxios from '../../utils/api';

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const { callAPI, loading, error, clearError } = useSecureAPI();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    await callAPI(async () => {
      const response = await apiAxios.get('/api/resumes');
      const payload = response.data;
      setResumes(payload.data?.resumes || payload?.resume || []);
    });
  };

  const handleUploadSuccess = () => {
    fetchResumes();
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    await callAPI(async () => {
      const response = await apiAxios.delete(`/api/resumes/${resumeId}`);
      if (response.status >= 200 && response.status < 300) {
        fetchResumes();
      } else {
        throw new Error(response.data?.message || 'Failed to delete resume');
      }
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading && resumes.length === 0) {
    return <Loading message="Loading resumes..." />;
  }

  return (
    <div className="main-content">
      <h1>Resume Management {resumes.length}</h1>
      <p className="text-muted mb-3">Upload and manage your resumes</p>

      <ErrorMessage message={error} onClose={clearError} />

      <ResumeUpload onUploadSuccess={handleUploadSuccess} />

      <div className="resume-list">
        {(Array.isArray(resumes) ? resumes : []).map((resume) => (
          <div key={resume._id} className="resume-item">
            <div className="flex items-center gap-2">
              <i className="fas fa-file-pdf" style={{ color: '#e74c3c', fontSize: '1.5rem' }}></i>
              <div>
                <h4 style={{ margin: 0 }}>{resume.originalName}</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  Uploaded: {new Date(resume.createdAt).toLocaleDateString()} | 
                  Size: {formatFileSize(resume.fileSize)}
                </p>
              </div>
            </div>
            <div className="company-actions">
              <button 
                onClick={() => handleDeleteResume(resume._id)}
                className="btn btn-danger"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {resumes.length === 0 && !loading && (
        <div className="text-center mt-3">
          <p>No resumes uploaded yet. Upload your first resume to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;