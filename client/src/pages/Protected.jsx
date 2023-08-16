import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown/Dropdown';
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { axiosInstance } from '../axios';
import { UserBaseURL } from '../API';
import { setLogin, setLogout, setMessage, setOnline, setSearch } from '../redux/slice';
import { useDispatch, useSelector } from 'react-redux'
import { TiArrowBack } from 'react-icons/ti'
import axios from 'axios';

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

  const onOpenSidenav = () => {
    // Implement your logic for opening the sidenav here
  };
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
          console.log(response.data, "data vanuuuuuuuuuuuuuu");
        } else {
          dispatch(setMessage(response.message));
          console.log("Fetch user Failed");
          throw new Error(response.data.message + " validationToken error");
        }
      })
      .catch((error) => {
        console.error(error.message, "/Base url err=>user not working");
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

  const handleSignOutClick = () => {
    dispatch(setLogout())
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    axios.get(`${UserBaseURL}/logout/${user._id}`)
    .then((res) => { 
      if(res.data.message==="Logout success"){
        navigate('/signin');
      }
     })
    .catch((err)=>{console.log(err)})
  }
  console.log(token, user, "<=reduxil stored | err msg=>", message)

  const {search}=useSelector((state)=>state.auth)
  return (
    <div className={`flex flex-col min-h-screen  transition-all bg-gray-100 dark:bg-gray-900`}>
      {loadingUser ? (
        <Spinner />
      ) : (
        <>


          <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-filter backdrop-blur-xl dark:bg-[#0b14374d]" style={{ WebkitBackdropFilter: `blur(10px)` }}>
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
                  onChange={(e)=> dispatch(setSearch(e.target.value))}
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
                  <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-navy-700 dark:text-white">
                        Notification
                      </p>
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        Mark all read
                      </p>
                    </div>

                    <button className="flex w-full items-center">
                      <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                        <BsArrowBarUp />
                      </div>
                      <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                        <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                          New Update: Horizon UI Dashboard PRO
                        </p>
                        <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                          A new update for your downloaded item is available!
                        </p>
                      </div>
                    </button>

                    <button className="flex w-full items-center">
                      <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                        <BsArrowBarUp />
                      </div>
                      <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                        <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                          New Update: Horizon UI Dashboard PRO
                        </p>
                        <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                          A new update for your downloaded item is available!
                        </p>
                      </div>
                    </button>
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
      )}
    </div>


  );
}
