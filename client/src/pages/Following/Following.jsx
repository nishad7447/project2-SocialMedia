import React, { useState } from 'react';
import { SiGooglemessages } from 'react-icons/si';

const Following = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // Sample data for followers list
  const followers = [
    { id: 1, name: 'John Doe', profilePic: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Jane Smith', profilePic: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Mike Johnson', profilePic: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Emily Brown', profilePic: 'https://via.placeholder.com/150' },
    // Add more followers as needed
  ];

  // Filter followers based on search query
  const filteredFollowers = followers.filter((follower) =>
    follower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mt-5 mb-4 dark:text-white">Followings</h1>
      <div className="flex justify-center items-center mb-7">
      <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-full w-2/4 rounded-full bg-white border-gray-300 shadow-md text-sm font-medium text-navy-700 placeholder-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder-white px-4 py-2"
          />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFollowers.map((follower) => (
          <div
            key={follower.id}
            className="bg-white dark:bg-navy-800 p-4 shadow rounded-lg flex items-center justify-between"
          >
            <img
              src={follower.profilePic}
              alt={`Profile Pic of ${follower.name}`}
              className="w-10 h-10 rounded-full mr-4"
            />
            <span className="text-gray-800 dark:text-white">{follower.name}</span>
            <button className="text-blue-500 "><SiGooglemessages className='w-5 h-5'/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Following;
