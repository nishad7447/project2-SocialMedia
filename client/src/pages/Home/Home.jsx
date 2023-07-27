import React, { useEffect, useState } from 'react';
import { BiHeart, BiCommentDots, BiSolidShareAlt } from "react-icons/bi";
import { SiGooglemessages } from 'react-icons/si'
import { FaUserPlus } from "react-icons/fa";
import Card from '../../componets/Card/Card';
import CreatePost from '../../componets/CreatePost/CreatePost';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';


const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};
export default function Home() {

  const user = useSelector((state) => state.auth.user)
  const [loadingUser, setLoadingUser] = useState(true);
  const [posts, setPosts] = useState([]);
  const [updateUI,setUpdateUI]=useState(false)


  useEffect(() => {
    axiosInstance.get(`${UserBaseURL}/getAllPosts`)
      .then((res) => {
        console.log(res)
        setPosts(res.data)
      })
      .catch((error) => {
        console.error(error.message, "post fetch url err=>user not working");
      })
      .finally(() => {
        setLoadingUser(false); // Set loadingUser to false once the user details are fetched or the API call completes
      });
  }, [updateUI])


  const friends = [
    {
      id: 1,
      name: 'Jane Doe',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 2,
      name: 'Bob Smith',
      avatar: 'https://via.placeholder.com/40',
    },
    // Add more friends here...
  ];

  const friendSuggestions = [
    {
      id: 3,
      name: 'Alice Johnson',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 4,
      name: 'Michael Smith',
      avatar: 'https://via.placeholder.com/40',
    },
    // Add more friend suggestions here...
  ];

  return (
    <>
      {
        loadingUser ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12 ml-4 mr-4">

            {/* First Card - 1/4 of the row */}
            <div className="col-span-1">
              <Card>
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <img className="w-12 h-12 rounded-full mr-4" src={user?.ProfilePic} alt="User Avatar" />
                    <div>
                      <h2 className="text-xl font-bold">{user?.Name}</h2>
                      <p className="text-gray-600">@{user?.UserName}</p>
                    </div>
                  </div>
                  <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultricies facilisis justo, sit amet aliquam odio congue vitae.</p>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold">1200</h3>
                      <p className="text-gray-600">Followers</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">800</h3>
                      <p className="text-gray-600">Following</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">250</h3>
                      <p className="text-gray-600">Posts</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Friend Suggestion Card */}
              <Card extra="mt-4">
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2">Friend Suggestions</h2>
                  {/* Display the list of friend suggestions */}
                  {friendSuggestions.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full mr-2" src={friend.avatar} alt="Friend Avatar" />
                        <h3 className="text-sm font-bold">{friend.name}</h3>
                      </div>
                      <FaUserPlus className="w-5 h-5 text-blue-500 hover:text-blue-600" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            {/* Second Card - 1/2 of the row */}
            <div className="col-span-1 md:col-span-2 overflow-y-auto">
              <CreatePost setUpdateUI={setUpdateUI} />
              {posts.map((post) => (
                <Card key={post.id} extra='mb-4'>
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <img className="w-10 h-10 rounded-full mr-2" src={post?.userId?.ProfilePic} alt="User Avatar" />
                      <div>
                        <h3 className="text-sm font-bold">{post?.userId?.UserName}</h3>
                        <p className="text-xs text-gray-600">{new Date(post?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    {/* <img className="w-full h-auto rounded-lg mb-4" src="https://via.placeholder.com/800x400" alt="Post Image" /> */}
                    {/* Conditional rendering based on the file extension */}
                    {(() => {
                     if(post?.fileUrl){
                      const extension = post?.fileUrl.split('.').pop().toLowerCase();
                      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                        return <img className="w-full h-auto rounded-lg mb-4" src={post?.fileUrl} alt="Post " />;
                      } else if (extension === 'mp4') {
                        return (
                          <video className="w-full h-auto rounded-lg mb-4" controls>
                            <source src={post?.fileUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        );
                      } else if (extension === 'mp3') {
                        return (
                          <audio className="w-full" controls>
                            <source src={post?.fileUrl} type="audio/mp3" />
                            Your browser does not support the audio element.
                          </audio>
                        );
                      } else {
                        return <p>Unsupported file format</p>;
                      }
                     }
                    })()}
                    <p className="text-sm mb-4">
                    {post?.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <button className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                          <BiHeart />
                          {/* <span>Like</span> */}
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                          <BiCommentDots />
                          {/* <span>Comment</span> */}
                        </button>
                      </div>
                      <div className="flex items-center">
                        <button className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2H6C4.9 2 4 2.9 4 4V20L10 16H18C19.1 16 20 15.1 20 14V4C20 2.9 19.1 2 18 2M18 14H10.83L6 17.17V4H18V14Z" />
                          </svg>
                          {/* <span>Save</span> */}
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-blue-500">
                          <BiSolidShareAlt />
                          {/* <span>Share</span> */}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Third Card - 1/4 of the row */}
            <div className="col-span-1">
              <Card>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold mb-2">Sponsored Ad</h2>
                    <a className="text-gray-500 text-sm font-bold" href="https://www.example.com/create-ad" target="_blank" rel="noopener noreferrer">
                      Create Ad
                    </a>
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img className="w-full h-auto rounded-lg mb-4" src="https://via.placeholder.com/800x400" alt="Ad Image" />
                  <div className="flex justify-between">

                    <div className="flex items-center mb-2">
                      <p className="text-sm text-gray-500">Sponsored</p>
                    </div>
                    <div className="flex items-center mb-2">
                      <a className="text-sm text-blue-500" href="https://www.example.com" target="_blank" rel="noopener noreferrer">Example.com</a>
                    </div>

                  </div>
                  <p className="mb-4 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultricies facilisis justo, sit amet aliquam odio congue vitae.</p>

                </div>
              </Card>

              <Card extra="mt-4">
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2">Friends List</h2>
                  {/* Display the list of friends */}
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full mr-2" src={friend.avatar} alt="Friend Avatar" />
                        <h3 className="text-sm font-bold">{friend.name}</h3>
                      </div>
                      <SiGooglemessages className="w-5 h-5 text-blue-500 hover:text-blue-600" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          </div>
        )
      }
    </>
  );
}
