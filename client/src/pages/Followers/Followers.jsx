import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../axios'
import { UserBaseURL } from '../../API'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import UnFollowBTN from '../../components/Follow/UnFollow/UnFollowBTN';
import FollowBTN from '../../components/Follow/UnFollow/FollowBTN';
import { useParams } from 'react-router-dom';

const Followers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [followers, setFollowers] = useState([])
  const [updateUI, setUpdateUI] = useState(false)
  const {user}=useSelector((state)=>state.auth)
  const {id}=useParams()

  useEffect(() => {
    axiosInstance.get(`${UserBaseURL}/getFollowers/${id}`)
      .then((res) => {
        console.log(res)
        setFollowers(res.data.followers.Followers)
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred while user fetch followers.');
        }
        console.error(error.message, "");
      })
  }, [updateUI])



  // Filter followers based on search query
  const filteredFollowers = followers.filter((follower) =>
    follower.UserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8" >
      <h1 className="text-3xl font-bold mt-5 mb-4 dark:text-white">Followers</h1>
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
              src={follower.ProfilePic}
              alt={`Profile Pic of ${follower.UserName}`}
              className="w-10 h-10 rounded-full mr-4"
            />
            <span className="text-gray-800 dark:text-white">{follower.UserName}</span>
            {
            user?._id !== follower?._id ?
            follower?.Followers.includes(user?._id ) ? (
              <UnFollowBTN friendId={follower?._id} setUpdateUI={setUpdateUI} />
            ) : (
              <FollowBTN friendId={follower?._id} setUpdateUI={setUpdateUI} />
            )
            : ""
          }
          </div>
        ))}
      </div>
    </div>
  );
};

export default Followers;
