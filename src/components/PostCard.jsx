import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Check if content is long enough to need expansion
  const needsExpansion = post.content && post.content.length > 150;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
          {post.group && (
            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700">
              {post.group.name}
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-4">
          {expanded || !needsExpansion ? post.content : `${post.content.substring(0, 150)}...`}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            <span>By {post.author ? (
              <Link 
                to={`/profile/${post.author.id}`} 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {post.author.username}
              </Link>
            ) : 'Anonymous'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          {needsExpansion && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="text-blue-600 hover:text-blue-800"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
