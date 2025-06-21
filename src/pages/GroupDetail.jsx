import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import PostCard from '../components/PostCard';

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    is_public: true
  });

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        // Fetch group details
        const groupResponse = await axios.get(`groups/${id}/`);
        setGroup(groupResponse.data);
        
        // Initialize edit form with current values
        setEditForm({
          name: groupResponse.data.name,
          description: groupResponse.data.description,
          is_public: groupResponse.data.is_public
        });
        
        // Fetch posts for this group
        const postsResponse = await axios.get(`groups/${id}/posts/`);
        // The API returns an array directly, not wrapped in results
        setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError('Failed to load group details. Please try again later.');
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);
  
  const fetchMembers = async () => {
    if (!group) return;
    
    setLoadingMembers(true);
    try {
      const response = await axios.get(`groups/${group.slug}/members/`);
      setMembers(Array.isArray(response.data) ? response.data : []);
      setShowMembers(true);
      setError(null);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to load group members. Please try again.');
    } finally {
      setLoadingMembers(false);
    }
  };
  
  const handleEditGroup = async (e) => {
    e.preventDefault();
    
    if (!window.confirm('Are you sure you want to update this group?')) {
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.patch(`groups/${group.slug}/`, editForm);
      // Refresh group data
      const groupResponse = await axios.get(`groups/${id}/`);
      setGroup(groupResponse.data);
      setShowEditForm(false);
      setError(null);
    } catch (error) {
      console.error('Error updating group:', error);
      setError('Failed to update group. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4 mx-auto max-w-4xl">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Group not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <div className="flex space-x-2">
            {group.is_member === true ? (
              <button
                onClick={async () => {
                  if (!window.confirm('Are you sure you want to leave this group?')) {
                    return;
                  }
                  
                  setSubmitting(true);
                  try {
                    await axios.post(`groups/${group.slug}/leave/`, {});
                    // Refresh group data after leaving
                    const groupResponse = await axios.get(`groups/${id}/`);
                    setGroup(groupResponse.data);
                    setError(null);
                  } catch (error) {
                    console.error('Error leaving group:', error);
                    setError('Failed to leave group. Please try again.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 disabled:opacity-50"
                disabled={submitting}
              >
                Leave Group
              </button>
            ) : (
              <button
                onClick={async () => {
                  setSubmitting(true);
                  try {
                    await axios.post(`groups/${group.slug}/join/`, {});
                    // Refresh group data after joining
                    const groupResponse = await axios.get(`groups/${id}/`);
                    setGroup(groupResponse.data);
                    setError(null);
                  } catch (error) {
                    console.error('Error joining group:', error);
                    setError('Failed to join group. Please try again.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={submitting}
              >
                Join Group
              </button>
            )}
          </div>
        </div>
        
        {/* Group description */}
        <p className="text-gray-600 mb-4">{group.description}</p>
        
        {/* Admin controls */}
        {group.user_role === 'admin' && (
          <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowEditForm(!showEditForm)}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
              >
                {showEditForm ? 'Cancel Edit' : 'Edit Group Details'}
              </button>
              <button 
                onClick={fetchMembers}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
              >
                View Members
              </button>
            </div>
            
            {/* Edit Group Form */}
            {showEditForm && (
              <form onSubmit={handleEditGroup} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Group Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    required
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <input
                    id="is_public"
                    name="is_public"
                    type="checkbox"
                    checked={editForm.is_public}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">Public Group</label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={submitting}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
            
            {/* Members List */}
            {showMembers && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Group Members</h4>
                {loadingMembers ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : members.length > 0 ? (
                  <div className="bg-white rounded-md shadow overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {members.map(member => (
                        <li key={member.id} className="px-4 py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            {member.user.profile_picture && (
                              <img 
                                src={member.user.profile_picture} 
                                alt={member.user.username} 
                                className="h-8 w-8 rounded-full mr-3"
                              />
                            )}
                            <div>
                              <p className="font-medium">{member.user.username}</p>
                              <p className="text-sm text-gray-500">{member.user.first_name} {member.user.last_name}</p>
                            </div>
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {member.role || 'Member'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">No members found</p>
                )}
                <button 
                  onClick={() => setShowMembers(false)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  Hide Members
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            {group.members_count || 0} members
          </div>
          {group.is_member === true && (
            <Link 
              to={`/posts/new?group=${group.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Post
            </Link>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Posts in this group</h2>
      
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No posts in this group yet.</p>
          {group.is_member === true ? (
            <Link 
              to={`/posts/new?group=${group.id}`}
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create the first post
            </Link>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              Join this group to create posts
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => {
            // Ensure post has the correct structure for PostCard
            const postWithFormattedGroup = {
              ...post,
              // Convert group ID to an object with id and name if needed
              group: typeof post.group === 'string' ? {
                id: post.group,
                name: post.group_name || group.name
              } : post.group
            };
            return <PostCard key={post.id} post={postWithFormattedGroup} />;
          })}
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
