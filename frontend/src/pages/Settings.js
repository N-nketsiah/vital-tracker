import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Card, Button, Input, Select, Alert, LoadingSpinner } from '../components/UI';

const Settings = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    gender: user?.gender || '',
    healthGoals: user?.healthGoals || []
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.put(
        'http://localhost:5001/api/users/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await axios.put(
        'http://localhost:5001/api/users/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-md'>
        <div className='max-w-7xl mx-auto px-4 py-6 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Settings</h1>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant='secondary'>
            ← Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 flex gap-8'>
          {['profile', 'security', 'notifications', 'preferences', 'data'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-semibold transition ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='max-w-2xl mx-auto px-4 py-8'>
        {error && <Alert type='error' message={error} onClose={() => setError('')} />}
        {success && <Alert type='success' message={success} onClose={() => setSuccess('')} />}

        {activeTab === 'profile' && (
          <Card>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Profile Information</h2>
            <form onSubmit={handleProfileSubmit}>
              <Input
                label='Full Name'
                type='text'
                name='name'
                value={formData.name}
                onChange={handleProfileChange}
                required
              />

              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='Age'
                  type='number'
                  name='age'
                  value={formData.age}
                  onChange={handleProfileChange}
                />

                <Select
                  label='Gender'
                  name='gender'
                  value={formData.gender}
                  onChange={handleProfileChange}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' }
                  ]}
                />

                <Input
                  label='Height (cm)'
                  type='number'
                  name='height'
                  value={formData.height}
                  onChange={handleProfileChange}
                />

                <Input
                  label='Weight (kg)'
                  type='number'
                  name='weight'
                  value={formData.weight}
                  onChange={handleProfileChange}
                  step='0.1'
                />
              </div>

              <Button type='submit' disabled={isLoading} variant='primary'>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Security</h2>
            <form onSubmit={handlePasswordSubmit}>
              <Input
                label='Current Password'
                type='password'
                name='currentPassword'
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />

              <Input
                label='New Password'
                type='password'
                name='newPassword'
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />

              <Input
                label='Confirm Password'
                type='password'
                name='confirmPassword'
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />

              <Button type='submit' disabled={isLoading} variant='primary' className='mb-6'>
                {isLoading ? 'Updating...' : 'Change Password'}
              </Button>
            </form>

            <hr className='my-6' />

            <h3 className='text-lg font-bold mb-4 text-gray-800'>Account Actions</h3>
            <Button onClick={handleLogout} variant='danger'>
              Logout
            </Button>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Notification Preferences</h2>
            <div className='space-y-4'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  defaultChecked={user.notificationPreferences?.emailNotifications}
                  className='mr-3'
                />
                <span className='text-gray-700'>Receive email notifications</span>
              </label>

              <label className='flex items-center'>
                <input
                  type='checkbox'
                  defaultChecked={user.notificationPreferences?.weeklyReports}
                  className='mr-3'
                />
                <span className='text-gray-700'>Weekly health reports</span>
              </label>

              <label className='flex items-center'>
                <input
                  type='checkbox'
                  defaultChecked={user.notificationPreferences?.alertThresholds}
                  className='mr-3'
                />
                <span className='text-gray-700'>Alerts for health threshold violations</span>
              </label>
            </div>

            <Button type='submit' variant='primary' className='mt-6'>
              Save Preferences
            </Button>
          </Card>
        )}

        {activeTab === 'data' && (
          <Card>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Data Management</h2>
            <div className='space-y-4'>
              <div>
                <h3 className='font-bold text-gray-800 mb-2'>Export Your Data</h3>
                <p className='text-gray-600 mb-4'>Download a copy of your health data in CSV or PDF format.</p>
                <div className='flex gap-4'>
                  <Button variant='primary'>Export as CSV</Button>
                  <Button variant='secondary'>Export as PDF</Button>
                </div>
              </div>

              <hr className='my-6' />

              <div>
                <h3 className='font-bold text-gray-800 mb-2 text-red-600'>Delete Account</h3>
                <p className='text-gray-600 mb-4'>Permanently delete your account and all associated data.</p>
                <Button variant='danger'>Delete Account</Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'preferences' && (
          <Card>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Preferences</h2>
            
            <div className='space-y-6'>
              {/* Theme Settings */}
              <div>
                <h3 className='font-bold text-lg text-gray-800 mb-4'>Display</h3>
                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                  <div>
                    <p className='font-semibold text-gray-800'>Dark Mode</p>
                    <p className='text-sm text-gray-600'>Enable dark theme for the application</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative w-14 h-8 rounded-full transition ${
                      isDark ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition transform ${
                        isDark ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className='font-bold text-lg text-gray-800 mb-4'>Notifications</h3>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                    <span className='text-gray-700'>Daily health reminders</span>
                    <input type='checkbox' defaultChecked className='w-5 h-5' />
                  </div>
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                    <span className='text-gray-700'>Medication reminders</span>
                    <input type='checkbox' defaultChecked className='w-5 h-5' />
                  </div>
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                    <span className='text-gray-700'>Weekly insights</span>
                    <input type='checkbox' className='w-5 h-5' />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;
