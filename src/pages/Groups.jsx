import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leavingGroups, setLeavingGroups] = useState({});
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async (url = 'groups/') => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setGroups(response.data.results || []);
      setPagination({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again later.');
      setLoading(false);
    }
  };

  // Join functionality now only available on the group detail page

  const handleLeaveGroup = async (groupSlug) => {
    if (!window.confirm('Are you sure you want to leave this group?')) {
      return;
    }
    
    setLeavingGroups(prev => ({ ...prev, [groupSlug]: true }));
    try {
      await axios.post(`groups/${groupSlug}/leave/`, {});
      // Refresh the groups list to update membership status
      fetchGroups();
      setError(null);
    } catch (err) {
      console.error('Error leaving group:', err);
      setError('Failed to leave group. Please try again.');
    } finally {
      setLeavingGroups(prev => ({ ...prev, [groupSlug]: false }));
    }
  };

  const handlePagination = (url) => {
    if (!url) return;
    
    // Extract the relative path from the full URL
    const baseUrl = axios.defaults.baseURL || '';
    const relativePath = url.replace(baseUrl, '');
    
    fetchGroups(relativePath);
  };

  if (loading && groups.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Link 
          to="/groups/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Group
        </Link>
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

      {groups.length === 0 && !loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No groups found.</p>
          <Link 
            to="/groups/new"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create the first group
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {group.cover_image && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={group.cover_image} 
                    alt={group.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  <Link to={`/groups/${group.slug}`} className="text-blue-600 hover:text-blue-800">
                    {group.name}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{group.members_count} members</span>
                  <span>{group.posts_count} posts</span>
                </div>
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/groups/${group.slug}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    View Group
                  </Link>
                  {group.is_member === true && (
                    <button
                      onClick={() => handleLeaveGroup(group.slug)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 disabled:opacity-50"
                      disabled={leavingGroups[group.slug]}
                    >
                      {leavingGroups[group.slug] ? 'Leaving...' : 'Leave'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {(pagination.next || pagination.previous) && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => handlePagination(pagination.previous)}
            disabled={!pagination.previous}
            className={`px-4 py-2 rounded-md ${
              pagination.previous
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePagination(pagination.next)}
            disabled={!pagination.next}
            className={`px-4 py-2 rounded-md ${
              pagination.next
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Groups;
