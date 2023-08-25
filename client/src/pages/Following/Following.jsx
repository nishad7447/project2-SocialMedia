import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../axios'
import { UserBaseURL } from '../../API'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import FollowBTN from '../../components/FollowUnFollow/FollowBTN';
import UnFollowBTN from '../../components/FollowUnFollow/UnFollowBTN';
import { useParams } from 'react-router-dom';

const Following = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [followings, setFollowings] = useState([])
  const [updateUI, setUpdateUI] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const {id}=useParams()

  useEffect(() => {
    axiosInstance.get(`${UserBaseURL}/getFollowings/${id}`)
      .then((res) => {
        console.log(res)
        setFollowings(res.data.followings.Followings)
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred while user fetch followings.');
        }
        console.error(error.message, "");
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUI])

  // Filter Followings based on search query
  const filteredFollowings = followings.filter((following) =>
    following.UserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(followings)

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
        {filteredFollowings.map((following) => (
          <div
            key={following._id}
            className="bg-white dark:bg-navy-800 p-4 shadow rounded-lg flex items-center justify-between"
          >
            <img
              src={following.ProfilePic}
              alt={`Profile Pic of ${following.UserName}`}
              className="w-10 h-10 rounded-full mr-4"
            />
            <span className="text-gray-800 dark:text-white">{following.UserName}</span>
            {
             user?._id !== following?._id ?
            following?.Followings.includes(user?._id) ? (
              <UnFollowBTN friendId={following?._id} setUpdateUI={setUpdateUI} />
            ) : (
              <FollowBTN friendId={following?._id} setUpdateUI={setUpdateUI} />
            ) : ""}         
           </div>
        ))}
      </div>
    </div>
  );
};

export default Following;
