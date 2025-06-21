import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    group: ''
  });
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const navigate = useNavigate();
  
  // Get group ID from URL query parameter if available
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const groupId = queryParams.get('group');
    if (groupId) {
      setFormData(prev => ({ ...prev, group: groupId }));
    }
  }, []);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!isAuthenticated) return;
      
      try {
        // First get the user profile to get the user ID
        const profileResponse = await axios.get('profile/');
        const userId = profileResponse.data.id;
        
        // Then fetch the groups this user belongs to
        const groupsResponse = await axios.get(`users/${userId}/groups/`);
        
        // Check if the response is an array or has a results property
        let userGroups = [];
        if (Array.isArray(groupsResponse.data)) {
          userGroups = groupsResponse.data;
        } else if (groupsResponse.data.results) {
          userGroups = groupsResponse.data.results;
        }
        
        setGroups(userGroups);
        
        // If a group was pre-selected but user is not a member, clear the selection
        if (formData.group) {
          const isMember = userGroups.some(g => g.id === formData.group);
          if (!isMember) {
            setFormData(prev => ({ ...prev, group: '' }));
            setError('You can only create posts in groups you are a member of.');
          }
        }
        
        setIsLoadingGroups(false);
      } catch (err) {
        console.error('Error fetching user groups:', err);
        setError('Failed to load your groups. Please try again later.');
        setIsLoadingGroups(false);
      }
    };

    fetchUserGroups();
  }, [formData.group, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await axios.post('posts/', formData);
      
      // Navigate back to the group page if a group was selected, otherwise to the feed
      if (formData.group) {
        // Find the group slug from the groups array
        const selectedGroup = groups.find(g => g.id === formData.group);
        if (selectedGroup?.slug) {
          navigate(`/groups/${selectedGroup.slug}`);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.detail || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
          />
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your post content"
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
              Group <span className="text-red-500">*</span>
            </label>
            {groups.length > 0 ? (
              <>
                <select
                  id="group"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoadingGroups}
                  required
                >
                  <option value="">Select a group</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  You can only create posts in groups you are a member of.
                </p>
              </>
            ) : isLoadingGroups ? (
              <p className="mt-1 text-sm text-gray-500">Loading groups...</p>
            ) : (
              <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700 mb-2">
                  You aren't a member of any groups yet. You need to join a group before you can create a post.
                </p>
                <a 
                  href="/groups" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse groups to join →
                </a>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
