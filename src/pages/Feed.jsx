import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('feed/');
        // Extract the results array from the paginated response
        setPosts(response.data.results || []);
        // Store pagination info
        setPagination({
          count: response.data.count || 0,
          next: response.data.next,
          previous: response.data.previous
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); 

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

  const loadPage = async (url) => {
    if (!url) return;
    
    setLoading(true);
    try {
      const response = await axios.get(url.replace(axios.defaults.baseURL, ''));
      setPosts(response.data.results || []);
      setPagination({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous
      });
    } catch (err) {
      console.error('Error loading page:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recent Posts</h1>
      
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No posts available yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8">
            <div className="text-sm text-gray-600">
              Showing {posts.length} of {pagination.count} posts
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => loadPage(pagination.previous)}
                disabled={!pagination.previous}
                className={`px-4 py-2 rounded ${!pagination.previous ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                Previous
              </button>
              <button 
                onClick={() => loadPage(pagination.next)}
                disabled={!pagination.next}
                className={`px-4 py-2 rounded ${!pagination.next ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Feed;
