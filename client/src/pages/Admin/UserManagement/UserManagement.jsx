import React, { useEffect, useState } from 'react'
import Table from './Table'
import { axiosAdminInstance } from '../../../axios';
import { AdminBaseURL } from '../../../API';
import { toast } from 'react-toastify';
// import { useSelector } from 'react-redux';

export default function UserManagement() {
  // const userOnline=useSelector((state)=>state.auth.online)
  let [users, setUsers] = useState([])
  const [updateUI, setUpdateUI] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axiosAdminInstance.get(`${AdminBaseURL}/allUsers`)
      .then((res) => {
        if (res.data.success) {
          setUsers(res.data.users)
        }
      })
      .catch((error) => {
        console.log(" admin fetch all users", error)

        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred while admin fetch all users.');
        }
      });
  }, [updateUI])

  users = users.filter((user) =>
    user?.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen pt-28 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-2">
        <h1 className="text-3xl font-semibold mb-7 dark:text-white">User Management</h1>
        <div className="flex justify-center items-center mb-7">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-full w-2/4 rounded-full bg-white border-gray-300 shadow-md text-sm font-medium text-navy-700 placeholder-gray-400 dark:bg-navy-700 dark:text-white dark:placeholder-white px-4 py-2"
          />
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-navy-900">
          <Table tableData={users} setUpdateUI={setUpdateUI} />
        </div>
      </div>
    </div>
  )
}
