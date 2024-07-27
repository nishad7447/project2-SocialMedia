import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown/Dropdown';
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { axiosInstance } from '../axios';
import { UserBaseURL } from '../API';
import { setLogin, setLogout, setMessage, setOnline, setSearch } from '../redux/slice';
import { useDispatch, useSelector } from 'react-redux'
import { TiArrowBack } from 'react-icons/ti'
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { SiGooglemessages } from 'react-icons/si';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};
export default function Protected({ children }) {
  const nav = useNavigate()
  const navigate = useNavigate()
  //   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkmode, setDarkmode] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [updateUi,setUpdateUi] = useState(false)

  const onOpenSidenav = () => {
    // Implement your logic for opening the sidenav here
  };
  // eslint-disable-next-line no-unused-vars
  const { token, user, message } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const validateToken = () => {
    console.log("validatefn")
    axiosInstance.get(`${UserBaseURL}/auth`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(setLogin({ user: response.data.data }));
          dispatch(setOnline(true))
          setUpdateUi((prev) => !prev)
          console.log(response.data, "data vanuuuuuuuuuuuuuu");
        } else {
          dispatch(setMessage(response.message));
          console.log("Fetch user Failed");
          throw new Error(response.data.message + " validationToken error");
        }
      })
      .catch((error) => {
        console.log(" user /Base url err=>user not working", error)

        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred while /Base url err=>user not working.');
        }
      })
      .finally(() => {
        setLoadingUser(false); // Set loadingUser to false once the user details are fetched or the API call completes
      });
  };

  useEffect(() => {
    if (localStorage.getItem('jwtToken')) {
      console.log(localStorage.getItem('jwtToken'));
      validateToken();

    } else {
      navigate('/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{
    if(localStorage.getItem('jwtToken')){

            // Fetch notifications here
            axiosInstance.get(`${UserBaseURL}/notifications`)
            .then((response) => {
              if (response.data.success) {
                setNotifications(response.data.notifications);
              }
            })
            .catch((error) => {
              console.log("Error fetching notifications:", error);
            });
            
    }
  },[updateUi])

  const handleSignOutClick = () => {
    dispatch(setLogout())
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    axios.get(`${UserBaseURL}/logout/${user._id}`)
      .then((res) => {
        if (res.data.message === "Logout success") {
          navigate('/signin');
        }
      })
      .catch((err) => { console.log(err) })
  }
  // console.log(token, user, "<=reduxil stored | err msg=>", message)

  const { search } = useSelector((state) => state.auth)

  const clearAllNotifi = () => {
    axiosInstance.get(`${UserBaseURL}/clearAllNotifi`)
    .then((res)=>{
      if(res.data.success){
        setUpdateUi((prev) => !prev)
      }
    })
  }

  
  const delAllNotifi = () => {
    axiosInstance.get(`${UserBaseURL}/delAllNotifi`)
    .then((res)=>{
      if(res.data.success){
        setUpdateUi((prev) => !prev)
      }
    })
  }

  const notifictionBtn = (notifiId,notifiType) =>{
    if(notifiType==="message"){
      axiosInstance.get(`${UserBaseURL}/removeMsgCount/${notifiId}`)
      .then((res)=>{
        if(res.data.success){
          nav('/chat')
        }
      })
    }
  }
  

  return (
    <div className={`flex flex-col min-h-screen  transition-all bg-gray-100 dark:bg-gray-900`}>
      {loadingUser ? (
        <Spinner />
      ) : (
        <>


          <nav className="sticky top-0 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-filter backdrop-blur-xl dark:bg-[#0b14374d]" style={{ WebkitBackdropFilter: `blur(10px)` }}>
            <div className="ml-[6px]">
              <div className="h-6 w-[224px] pt-1">
                <Link
                  className=" flex text-navy-700 hover:underline dark:text-white dark:hover:text-white"
                  onClick={() => nav(-1)}
                // onClick={()=>{window.history.back()}}
                >
                  Back<TiArrowBack className='mt-1' />
                </Link>

              </div>
              <p className="shrink text-[33px] capitalize text-blue-500">
                <Link
                  to="/"
                  className="font-bold capitalize hover:text-navy-700  dark:hover:text-white"
                >
                  OnlyFriends
                </Link>
              </p>
            </div>

            <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
              <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                <p className="pl-3 pr-2 text-xl">
                  <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                </p>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                  value={search}
                  onChange={(e) => {
                    dispatch(setSearch(e.target.value));
                    if (e.target.value.trim() !== "") {
                      nav('/search');
                    }
                  }}
                />
              </div>
              <span
                className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
                onClick={onOpenSidenav}
              >
                <FiAlignJustify className="h-5 w-5" />
              </span>
              {/* start Notification */}
              <Dropdown
                button={
                  <p className="cursor-pointer">
                    <IoMdNotificationsOutline className="ml-3 h-4 w-4 text-gray-600 dark:text-white" />
                  </p>
                }
                animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
                children={
                  <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white sm:w-[460px] max-h-[400px] overflow-y-auto ">                   
                   <div className="flex items-center justify-between sticky top-2">
                      <p className="text-base font-bold text-navy-700 dark:text-white">
                        Notification
                      </p>
                      <div className='flex'>
                      <p onClick={clearAllNotifi} className="text-sm mr-2 font-bold text-navy-700 dark:text-white">
                        Mark all read
                      </p>
                      <MdOutlineDeleteSweep size={18} onClick={delAllNotifi}/>
                      </div>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-white">
                        No new notifications
                      </p>
                    ) : (
                      notifications.map(notification => (
                        !notification.read ?
                      ( <button
                        onClick={()=>notifictionBtn(notification._id,notification.type)}
                          key={notification._id}
                          className="flex w-full items-center hover:bg-gray-100 dark:hover:bg-navy-800 p-2 rounded-lg transition-colors duration-150"
                        >
                          <div className="flex ">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full text-white mr-3">
                              <img
                                src={notification.senderId.ProfilePic}
                                alt="User Avatar"
                                className="h-9 w-9 rounded-full bg-gray-200"
                              />
                            </div>
                            {notification.type === 'message' ?
                              <h3 className="mr-2 text-xs mt-4">
                                New message from
                              </h3>
                              : ''}
                            <span className=" mr-2 text-xs mt-4 font-bold">{notification.senderId.UserName}</span>
                            <h3 className="mr-2 text-xs mt-4">
                              {notification.type === 'like' ? 'liked your post' :
                                notification.type === 'comment' ? 'commented on your post' : 
                                  notification.type === 'follow' ? 'started following you' : ''}
                            </h3>
                            {
                              notification.postId ?
                                notification.postId.fileUrl ? (
                                  <div className="w-10 h-10 mb-4">
                                    {(() => {
                                      const extension = notification.postId?.fileUrl.split('.').pop().toLowerCase();
                                      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                                        return <img className="w-full h-full rounded-lg" src={notification.postId?.fileUrl} alt="notification.postId" />;
                                      } else if (extension === 'mp4') {
                                        return (
                                          <video className="w-full h-full rounded-lg" controls>
                                            <source src={notification.postId?.fileUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                          </video>
                                        );
                                      } else if (extension === 'mp3') {
                                        return (
                                          <audio className="w-full" controls>
                                            <source src={notification.postId?.fileUrl} type="audio/mp3" />
                                            Your browser does not support the audio element.
                                          </audio>
                                        );
                                      } else {
                                        return <p>Unsupported file format</p>;
                                      }
                                    })()}
                                  </div>
                                ) : (
                                  <p className="max-w-[40%] text-xs mt-4 font-bold">
                                    "  {notification.postId.content.split(' ', 10).join(' ')}{notification.postId.content.split(' ').length > 3 ? '...' : ''}"
                                  </p>

                                )
                                :
                                notification.type === 'message' ?
                                (<div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 mt-4 h-4 w-4 rounded leading-none">
                                  {notification.msgCount}
                                </div>)
                                : ''
                            }
                          </div>
                        </button>)
                        :
                        (
                           <div
                              key={notification._id}
                              className="flex w-full items-center text-gray-700 hover:bg-gray-100 dark:hover:bg-navy-800 p-2 rounded-lg transition-colors duration-150"
                            >
                              <div className="flex ">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full text-white mr-3">
                                  <img
                                    src={notification.senderId.ProfilePic}
                                    alt="User Avatar"
                                    className="h-9 w-9 rounded-full bg-gray-200"
                                  />
                                </div>
                                {notification.type === 'message' ?
                                  <h3 className="mr-2 text-xs mt-4">
                                    New message from
                                  </h3>
                                  : ''}
                                <span className=" mr-2 text-xs mt-4 font-bold">{notification.senderId.UserName}</span>
                                <h3 className="mr-2 text-xs mt-4">
                                  {notification.type === 'like' ? 'liked your post' :
                                    notification.type === 'comment' ? 'commented on your post' : ''}
                                </h3>
                                {
                                  notification.postId ?
                                    notification.postId.fileUrl ? (
                                      <div className="w-10 h-10 mb-4">
                                        {(() => {
                                          const extension = notification.postId?.fileUrl.split('.').pop().toLowerCase();
                                          if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                                            return <img className="w-full h-full rounded-lg" src={notification.postId?.fileUrl} alt="notification.postId" />;
                                          } else if (extension === 'mp4') {
                                            return (
                                              <video className="w-full h-full rounded-lg" controls>
                                                <source src={notification.postId?.fileUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                              </video>
                                            );
                                          } else if (extension === 'mp3') {
                                            return (
                                              <audio className="w-full" controls>
                                                <source src={notification.postId?.fileUrl} type="audio/mp3" />
                                                Your browser does not support the audio element.
                                              </audio>
                                            );
                                          } else {
                                            return <p>Unsupported file format</p>;
                                          }
                                        })()}
                                      </div>
                                    ) : (
                                      <p className="max-w-[40%] text-xs mt-4 font-bold">
                                        "  {notification.postId.content.split(' ', 10).join(' ')}{notification.postId.content.split(' ').length > 3 ? '...' : ''}"
                                      </p>
    
                                    )
                                    :
                                    <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 mt-4 h-4 w-4 rounded leading-none">
                                      {notification.msgCount}
                                    </div>
                                }
                              </div>
                            </div>
                        )                      
                      ))
                    )}
                  </div>
                }
                classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
              />

              <div
                className="cursor-pointer text-gray-600"
                onClick={() => {
                  if (darkmode) {
                    document.body.classList.remove("dark");
                    setDarkmode(false);
                  } else {
                    document.body.classList.add("dark");
                    setDarkmode(true);
                  }
                }}
              >
                {darkmode ? (
                  <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
                ) : (
                  <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
                )}
              </div>
              <SiGooglemessages onClick={()=>nav('/chat')} className="w-5 h-5 cursor-pointer text-gray-600" />
              {/* Profile & Dropdown */}
              <Dropdown
                button={
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.ProfilePic}
                    alt={user?.UserName}
                  />
                }
                children={
                  <div className="flex h-48 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                    <div className="mt-3 ml-4">
                      <div className="flex items-center gap-2">
                        <Link to="/profile" className="text-sm font-bold text-navy-700 dark:text-white">
                          👋 Hey, {user?.UserName}
                        </Link>{" "}
                      </div>
                    </div>
                    <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />

                    <div className="mt-3 ml-4 flex flex-col">
                      <Link
                        to="/settings"
                        className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/savedposts"
                        className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                      >
                        Saved Posts
                      </Link>
                      <a
                        href=" "
                        className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                        onClick={handleSignOutClick}
                      >
                        Log Out
                      </a>
                    </div>
                  </div>
                }
                classNames={"py-2 top-8 -left-[180px] w-max"}
              />
            </div>
          </nav>

          {children}
        </>
      )
      }
    </div >


  );
}
