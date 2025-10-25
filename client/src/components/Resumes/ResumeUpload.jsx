import React, { useState } from 'react';
import { useSecureAPI } from '../../hooks/useSecureAPI';
import ErrorMessage from '../Common/ErrorMessage';
import apiAxios from '../../utils/api';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { callAPI } = useSecureAPI();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setError('Please upload a PDF or Word document (PDF, DOC, DOCX)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    await callAPI(async () => {
      const {data,status} = await apiAxios.post('/api/resumes/upload', formData
      );
      
      //const data = await response.json();
      
      // if (response.ok) {
      //   onUploadSuccess();
      //   // Reset file input
      //   const fileInput = document.getElementById('file-input');
      //   if (fileInput) fileInput.value = '';
      // } else {
      //   throw new Error(data.message || 'Upload failed');
      // }
       if (status >= 200 && status < 300) {
         onUploadSuccess();
        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    });

    setUploading(false);
  };

  return (
    <div className="resume-upload">
      <h3>Upload New Resume</h3>
      
      <ErrorMessage message={error} onClose={() => setError('')} />

      <div
        className={`upload-area ${dragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx"
        />
        
        <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#6366f1', marginBottom: '1rem' }}></i>
        <h4>Drag & Drop your resume here</h4>
        <p>or click to browse</p>
        <p className="text-muted">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
      </div>

      {uploading && (
        <div className="text-center mt-2">
          <p>Uploading resume...</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;