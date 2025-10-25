export const API_BASE_URL =import.meta.env.VITE_API_BASE_URL|| 'http://localhost:5000';

export const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Email placeholder constants
export const EMAIL_PLACEHOLDERS = {
  companyName: '{companyName}',
  position: '{position}',
  userName: '{userName}',
  userEmail: '{userEmail}',
  userTitle: '{userTitle}',
  industry: '{industry}',
  jobLocation: '{jobLocation}',
  salaryRange: '{salaryRange}',
  currentDate: '{currentDate}',
  currentYear: '{currentYear}',
  userPhone: '{userPhone}',
  userLocation: '{userLocation}',
  companyEmail: '{companyEmail}',
  companyWebsite: '{companyWebsite}',
  contactPerson: '{contactPerson}',
  hiringManager: '{hiringManager}'
};

// Variable categories with constants
export const VARIABLE_CATEGORIES = {
  FAVORITES: 'favorites',
  RECENT: 'recent',
  COMPANY: 'company',
  PERSONAL: 'personal',
  JOB: 'job',
  DYNAMIC: 'dynamic',
  CONTACT: 'contact'
};

// Category configuration
export const CATEGORY_CONFIG = {
  [VARIABLE_CATEGORIES.FAVORITES]: {
    name: 'Favorites',
    icon: 'fas fa-star',
    color: '#f59e0b',
    variables: []
  },
  [VARIABLE_CATEGORIES.RECENT]: {
    name: 'Recently Used',
    icon: 'fas fa-history',
    color: '#8b5cf6',
    variables: []
  },
  [VARIABLE_CATEGORIES.COMPANY]: {
    name: 'Company Info',
    icon: 'fas fa-building',
    color: '#6366f1',
    variables: [
      { name: 'companyName', description: 'Company name', placeholder: EMAIL_PLACEHOLDERS.companyName },
      { name: 'companyEmail', description: 'Company email', placeholder: EMAIL_PLACEHOLDERS.companyEmail },
      { name: 'companyWebsite', description: 'Company website', placeholder: EMAIL_PLACEHOLDERS.companyWebsite },
      { name: 'industry', description: 'Company industry', placeholder: EMAIL_PLACEHOLDERS.industry }
    ]
  },
  [VARIABLE_CATEGORIES.PERSONAL]: {
    name: 'Personal Info',
    icon: 'fas fa-user',
    color: '#f59e0b',
    variables: [
      { name: 'userName', description: 'Your full name', placeholder: EMAIL_PLACEHOLDERS.userName },
      { name: 'userEmail', description: 'Your email', placeholder: EMAIL_PLACEHOLDERS.userEmail },
      { name: 'userTitle', description: 'Your title', placeholder: EMAIL_PLACEHOLDERS.userTitle },
      { name: 'userPhone', description: 'Your phone', placeholder: EMAIL_PLACEHOLDERS.userPhone },
      { name: 'userLocation', description: 'Your location', placeholder: EMAIL_PLACEHOLDERS.userLocation }
    ]
  },
  [VARIABLE_CATEGORIES.JOB]: {
    name: 'Job Details',
    icon: 'fas fa-briefcase',
    color: '#10b981',
    variables: [
      { name: 'position', description: 'Job position', placeholder: EMAIL_PLACEHOLDERS.position },
      { name: 'jobLocation', description: 'Job location', placeholder: EMAIL_PLACEHOLDERS.jobLocation },
      { name: 'salaryRange', description: 'Salary range', placeholder: EMAIL_PLACEHOLDERS.salaryRange }
    ]
  },
  [VARIABLE_CATEGORIES.DYNAMIC]: {
    name: 'Dynamic Content',
    icon: 'fas fa-sync',
    color: '#8b5cf6',
    variables: [
      { name: 'currentDate', description: 'Current date', placeholder: EMAIL_PLACEHOLDERS.currentDate },
      { name: 'currentYear', description: 'Current year', placeholder: EMAIL_PLACEHOLDERS.currentYear }
    ]
  },
  [VARIABLE_CATEGORIES.CONTACT]: {
    name: 'Contact Info',
    icon: 'fas fa-address-book',
    color: '#ef4444',
    variables: [
      { name: 'contactPerson', description: 'Contact person', placeholder: EMAIL_PLACEHOLDERS.contactPerson },
      { name: 'hiringManager', description: 'Hiring manager', placeholder: EMAIL_PLACEHOLDERS.hiringManager }
    ]
  }
};

// Default values for variables
export const DEFAULT_VALUES = {
  companyName: 'ABC Company',
  companyEmail: 'hr@company.com',
  companyWebsite: 'www.company.com',
  industry: 'Technology',
  userName: 'Your Name',
  userEmail: 'your@email.com',
  userTitle: 'Your Title',
  userPhone: '+1234567890',
  userLocation: 'New York, NY',
  position: 'Software Developer',
  jobLocation: 'Remote',
  salaryRange: '$70,000 - $90,000',
  contactPerson: 'Hiring Manager',
  hiringManager: 'Hiring Manager'
};