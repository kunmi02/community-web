import React from 'react';
import { Link } from 'react-router-dom';

const GroupCard = ({ group }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{group.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Members: {group.member_count || 0}</span>
          <Link 
            to={`/groups/${group.id}`} 
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            View Group
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
