import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams(); // Get userId from URL if available
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const { isAuthenticated } = useAuth();
  const isOwnProfile = !userId || (currentUserId && userId === currentUserId);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await axios.get('profile/');
        setCurrentUserId(response.data.id);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    fetchCurrentUser();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        
        // If viewing someone else's profile
        if (userId) {
          const response = await axios.get(`users/${userId}/`);
          setProfile(response.data);
          setError('');
        } else {
          // Viewing own profile
          const response = await axios.get('profile/');
          setProfile(response.data);
          setEditForm({
            username: response.data.username || '',
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            bio: response.data.bio || ''
          });
          setError('');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form to current profile values when toggling edit mode
    if (!isEditing && profile) {
      setEditForm({
        username: profile.username || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axios.patch('profile/', editForm);
      setProfile(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || 'Unable to load profile. Please try again later.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {isOwnProfile ? 'My Profile' : `${profile.username}'s Profile`}
            </h1>
            {isOwnProfile && (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={submitting}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <FormInput
                label="Username"
                name="username"
                value={editForm.username}
                onChange={handleChange}
                required
              />
              <FormInput
                label="First Name"
                name="first_name"
                value={editForm.first_name}
                onChange={handleChange}
              />
              <FormInput
                label="Last Name"
                name="last_name"
                value={editForm.last_name}
                onChange={handleChange}
              />
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={editForm.bio || ''}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                {profile.profile_picture ? (
                  <img 
                    src={profile.profile_picture} 
                    alt={profile.username} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
                    {profile.first_name && profile.last_name 
                      ? `${profile.first_name[0]}${profile.last_name[0]}`
                      : profile.username[0].toUpperCase()}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Username</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{profile.username}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{profile.first_name || '—'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{profile.last_name || '—'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {new Date(profile.date_joined).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {profile.bio && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                  <p className="text-gray-900 whitespace-pre-line">{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
