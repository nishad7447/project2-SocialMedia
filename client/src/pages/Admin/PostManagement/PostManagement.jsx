import React, { useEffect, useState } from 'react'
import Table from './Table'
import { axiosAdminInstance } from '../../../axios';
import { AdminBaseURL } from '../../../API';
// import { useSelector } from 'react-redux';

export default function PostManagement() {
  const [allposts, setPosts] = useState([])
  const [updateUI, setUpdateUI] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axiosAdminInstance.get(`${AdminBaseURL}/allposts`)
      .then((res) => {
        if (res.data.success) {
          setPosts(res.data.posts)
        }
      })
  }, [updateUI])
  const regex = new RegExp(searchQuery.trim(), "i");
  const posts = allposts.filter((post) =>
    regex.test(post?.userId?.Name)
  );

  return (
    <div className="bg-gray-100 min-h-screen pt-28 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-2">
        <h1 className="text-3xl font-semibold mb-7 dark:text-white">Posts Management</h1>
        <div className="flex justify-center items-center mb-7">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-full w-2/4 rounded-full bg-white border-gray-300 shadow-md text-sm font-medium text-navy-700 placeholder-gray-400 dark:bg-navy-700 dark:text-white dark:placeholder-white px-4 py-2"
          />
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-navy-900">
          {posts.length > 0 ?
            <Table tableData={posts} setUpdateUI={setUpdateUI} />
            :
            <Table tableData={allposts} setUpdateUI={setUpdateUI} />
          }
        </div>
      </div>
    </div>
  )
}
