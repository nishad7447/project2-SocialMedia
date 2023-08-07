import React, { useEffect, useRef, useState } from 'react';
import { BiHeart, BiCommentDots, BiSolidShareAlt } from "react-icons/bi";
import { SiGooglemessages } from 'react-icons/si'
import { FaUserPlus } from "react-icons/fa";
import Card from '../../components/Card/Card';
import CreatePost from '../../components/CreatePost/CreatePost';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';
import CommentModal from '../../components/CommentModal/CommentModal';
import { toast } from 'react-toastify';
import { AiFillHeart } from 'react-icons/ai';
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import { SlOptionsVertical } from 'react-icons/sl'
import { useNavigate } from 'react-router-dom';
import { MdDeleteForever, MdReportProblem } from 'react-icons/md';
import Modal from '../../components/Modal/Modal';


const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};
export default function Home() {
  const nav = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [loadingUser, setLoadingUser] = useState(true);
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [updateUI, setUpdateUI] = useState(false)


  useEffect(() => {
    axiosInstance.get(`${UserBaseURL}/getAllPosts`)
      .then((res) => {
        console.log(res)
        setPosts(res.data.posts)
        setSuggestedUsers(res.data.users)
      })
      .catch((error) => {
        console.error(error.message, "post fetch url err=>user not working");
      })
      .finally(() => {
        setLoadingUser(false); // Set loadingUser to false once the user details are fetched or the API call completes
      });
  }, [updateUI])

  // comment
  const [clickedPostId, setClickedPostId] = useState(null);

  const handleCommentClick = (postId) => {
    setClickedPostId(postId);
  };

  const closeModal = () => {
    setClickedPostId(null);
  };


  //like
  const handleLikeClick = (postId) => {
    axiosInstance.get(`${UserBaseURL}/like/${postId}`)
      .then((res) => {
        console.log(res.data)
        toast.success(res?.data.message)
        setUpdateUI((prevState) => !prevState)
      })
      .catch((err) => {
        console.log(err, "Error clicking like")
        toast.error(err?.data?.message)
      })
  }
  const renderLikeInfo = (post) => {
    const likeCount = post.likes.length;
    const userLiked = post.likes.includes(user?._id);

    if (likeCount === 0) {
      return '';
    }

    if (userLiked) {
      if (likeCount === 1) {
        return ' You liked this post';
      } else {
        return ` You and ${likeCount - 1} others `;
      }
    } else {
      return ` ${likeCount} likes`;
    }
  };


  //savedpost
  const handleSavedClick = (postId) => {
    axiosInstance.get(`${UserBaseURL}/savedpost/${postId}`)
      .then((res) => {
        console.log(res.data)
        toast.success(res?.data.message)
        setUpdateUI((prevState) => !prevState)
      })
      .catch((err) => {
        console.log(err, "Error clicking like")
        toast.error(err?.data?.message)
      })
  }

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

  //post settings
  const [openDropdowns, setOpenDropdowns] = useState({});
  const handleDropdownToggle = (postId) => {
    setOpenDropdowns((prevOpenDropdowns) => ({
      ...prevOpenDropdowns,
      [postId]: !prevOpenDropdowns[postId]
    }));
  };
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdowns({});
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  //deleteMODAL
  const [deleteModal,setDeleteModal]=useState(false)
  const [deletePostId,setDeletePostId]=useState(null)

  const showDeleteModal=(postId)=>{
    setDeletePostId(postId)
    setDeleteModal(true)
  }

  const deleteModalConfirm=()=>{
    setDeleteModal(false)
    axiosInstance.delete(`${UserBaseURL}/deletePost/${deletePostId}`)
    .then((res) => {
      console.log(res,"delete post res")
      if (res.data.success) {
        setUpdateUI((prev) => !prev);
        toast.success(res.data.message);
      }
    })
    .catch((err) => {
      toast.error(err.data.message);
      console.log(err, "delete post error");
    });
  }

  const deleteModalCancel=()=>{
    setDeleteModal(false)
  }

  //reportMODAL
  const [reportModal,setReportModal] = useState(false)
  const [reportPostId,setReportPostId]=useState(null)
  const showReportModal=(postId)=>{
    setReportPostId(postId)
    setReportModal(true)
  }
  const reportModalCancel=()=>{
    setReportModal(false)
  }
  
   const reportOptions = [
    { label: 'Inappropriate content', value: 'inappropriate' },
    { label: 'Spam', value: 'spam' },
    { label: 'Hate speech', value: 'hate_speech' },
    // Add more report options as needed
  ];

  const [selectedOpt,setSelecetedOpt] = useState(null)
  const selectedReason=(reason)=>{
    setSelecetedOpt(reason)
  }

  const reportModalConfirm=()=>{
    setReportModal(false)
    axiosInstance.put(`${UserBaseURL}/reportPost`,{postId:reportPostId,reason:selectedOpt})
    .then((res) => {
      console.log(res,"report post res")
      if (res.data.success) {
        setUpdateUI((prev) => !prev);
        toast.success(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err, "report post error");
      toast.error(err?.data?.message);
    });
  }

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
                    <div onClick={() => nav('/followers')}>
                      <h3 className="text-lg font-bold">1200</h3>
                      <p className="text-gray-600">Followers</p>
                    </div>
                    <div onClick={() => nav('/following')}>
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
                  {suggestedUsers.map((friend) => (
                    <div key={friend?._id} className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full mr-2" src={friend?.ProfilePic} alt="Friend Avatar" />
                        <h3 className="text-sm font-bold">{friend?.UserName}</h3>
                      </div>
                      <FaUserPlus className="w-5 h-5 text-blue-500 hover:text-blue-600" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            {/* Second Card - 1/2 of the row */}
            <div className="col-span-1 md:col-span-2 overflow-y-auto ">
              <CreatePost setUpdateUI={setUpdateUI} />
              {posts.map((post) => (
                <Card key={post.id} extra='mb-4'>
                  <div className="p-4">
                    <div className="flex relative items-center mb-4">
                      <img className="w-10 h-10 rounded-full mr-2" src={post?.userId?.ProfilePic} alt="User Avatar" />
                      <div>
                        <h3 className="text-sm font-bold">{post?.userId?.UserName}</h3>
                        <p className="text-xs text-gray-600">{new Date(post?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <SlOptionsVertical
                        className="absolute right-0 cursor-pointer"
                        onClick={() => handleDropdownToggle(post._id)}
                      />
                      {openDropdowns[post._id] && (
                        <div ref={dropdownRef} className="absolute top-10 right-0 bg-white border rounded shadow-xl dark:bg-navy-700">
                          {/* Options for the dropdown go here */}
                          <ul>
                            {
                              post?.userId?.UserName === user.UserName ?
                                <li onClick={()=>showDeleteModal(post._id)} className='flex p-2 text-sm'><MdDeleteForever className='text-red-500 mr-1 ' size={20} /> Delete</li>
                                :
                                <li onClick={()=>showReportModal(post._id)} className='flex p-2 text-sm'><MdReportProblem className='text-yellow-500 mr-1 ' size={20} /> Report</li>
                            }
                            {/* Other options related to the current user's post */}
                          </ul>
                        </div>
                      )}
                    </div>
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    {/* <img className="w-full h-auto rounded-lg mb-4" src="https://via.placeholder.com/800x400" alt="Post Image" /> */}
                    {/* Conditional rendering based on the file extension */}
                    {(() => {
                      if (post?.fileUrl) {
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
                        <button onClick={() => handleLikeClick(post._id)} className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                          {
                            post.likes.includes(user?._id)
                              ?
                              <AiFillHeart style={{ fill: 'red' }} />
                              :
                              <BiHeart />
                          }
                          <span className='ml-1 text-xs'>{renderLikeInfo(post)}</span>
                        </button>
                        <button onClick={() => handleCommentClick(post._id)} className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                          <BiCommentDots />
                          {/* <span>Comment</span> */}
                        </button>
                      </div>
                      <div className="flex items-center">
                        <button onClick={() => handleSavedClick(post._id)} className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                          {
                            post.savedBy?.includes(user?._id)
                              ?
                              <GoBookmarkFill style={{ fill: 'black' }} />
                              :
                              <GoBookmark />
                          }
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
      {clickedPostId && (
        <CommentModal postId={clickedPostId} closeModal={closeModal} />
      )}
      {deleteModal && (
         <Modal
          Heading={"Delete Post"}
          content={"Are you sure to delete this post ?"}
           onCancel={deleteModalCancel}
           onConfirm={deleteModalConfirm}
         />
      )}
      {reportModal && (
         <Modal
          Heading={"Report Post"}
          content={
            <div>
              {reportOptions.map((option) => (
                <div key={option.value}>
                  <label className="text-sm font-thin">
                    <input
                      type="radio"
                      name="reportOption"
                      value={option.value}
                      className="mr-1"
                      onClick={()=>selectedReason(option.label)}
                    />
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          }
           onCancel={reportModalCancel}
           onConfirm={reportModalConfirm}
         />
      )}
    </>
  );
}
