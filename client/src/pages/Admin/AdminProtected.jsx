import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosAdminInstance } from '../../axios';
import { AdminBaseURL } from '../../API';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setAdminLogin } from '../../redux/slice';
import { FiMenu } from 'react-icons/fi';
import { FaHome, FaUsers } from 'react-icons/fa';
import { CgFeed } from 'react-icons/cg'
import { RiAdvertisementFill } from 'react-icons/ri';
import { toast } from 'react-toastify';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};
const AdminNavbar = ({ children }) => {
  const { adminToken, admin } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('adminToken') && localStorage.getItem('role')) {
      validateToken()
    } else {
      nav('/admin-login')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateToken = () => {
    axiosAdminInstance.get(`${AdminBaseURL}/`)
      .then((res) => {
        console.log(res.data, "admin token validation")
        if (res.data.success) {
          dispatch(setAdminLogin({ admin: res.data.role }))
        } else {
          dispatch(setMessage(res.message));
          console.log(" admin validation Failed");
          throw new Error(res.data.message + " validationToken error");
        }
      })
      .catch((error) => {
        console.log("/Base url err=>admin not working", error)

        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred while admin .');
        }
      })
      .finally(() => {
        setLoadingUser(false); // Set loadingUser to false once the user details are fetched or the API call completes
      });
  }

  const handleClickSignout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('role')
    nav('/admin-login')
  }

  // State to handle mobile menu open/close
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      {loadingUser ? (
        <Spinner />
      ) : (
        <>
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-gray-400 dark:bg-navy-800 dark:border-gray-700 p-4">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
              <a href="/" className="self-center text-2xl font-semibold whitespace-nowrap text-[33px] capitalize text-blue-500">
                Admin
              </a>
              {/* Mobile Navigation */}
              <div className="md:hidden">
                <FiMenu
                  size={24}
                  className="text-gray-800 dark:text-white cursor-pointer"
                  onClick={toggleMobileMenu}
                />
              </div>
              {/* Desktop Navigation Links */}
              <ul className="hidden md:flex items-center space-x-6">
                <li>
                  <Link to="/admin" className="flex hover:underline dark:text-white">
                    <FaHome size={23} className=' mr-1' /> Home
                  </Link>
                </li>
                <li className="relative">
                  <Link to="/usermanage" className="flex hover:underline dark:text-white">
                    <FaUsers size={24} className=' mr-1' />  Users
                  </Link>
                </li>
                <li>
                  <Link to="/postmanage" className="flex hover:underline dark:text-white">
                    <CgFeed size={24} className=' mr-1' /> Posts
                  </Link>
                </li>
                <li>
                  <Link to="/adsmanage" className="flex hover:underline dark:text-white">
                    <RiAdvertisementFill size={24} className=' mr-1' /> Ads
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline dark:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
              {/* Sign Out button (Visible on larger screens and iPad) */}
              <div className="hidden md:block">
                <button
                  onClick={handleClickSignout}
                  className="bg-transparent border border-black py-2 px-4 rounded  hover:text-blue-500 dark:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
            {/* Mobile Navigation Links */}
            <ul
              className={`${isMobileMenuOpen ? 'block' : 'hidden'
                } md:hidden space-x-6 mt-4 md:mt-0 px-3 items-end `}
            >
              <li>
                <Link
                  to="/admin"
                  className="flex px-6 py-1 hover:underline dark:text-white"
                  onClick={toggleMobileMenu}
                >
                  <FaHome size={23} className=' mr-3 ml-3' />  Home
                </Link>
              </li>
              <li className="relative">
                <Link
                  to="/usermanage"
                  className="flex py-1 hover:underline dark:text-white"
                  onClick={toggleMobileMenu}
                >
                  <FaUsers size={24} className='ml-3 mr-3' />  User
                </Link>
              </li>
              <li>
                <Link
                  to="/postmanage"
                  className="flex py-1 hover:underline dark:text-white"
                  onClick={toggleMobileMenu}
                >
                  <CgFeed size={24} className='ml-3 mr-3' /> Post
                </Link>
              </li>
              <li>
                <Link
                  to="/adsmanage"
                  className="flex py-1 hover:underline dark:text-white"
                  onClick={toggleMobileMenu}
                >
                  <RiAdvertisementFill size={24} className='ml-3 mr-3' /> Ads
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block ml-5 py-1 hover:underline dark:text-white"
                  onClick={toggleMobileMenu}
                >
                  Contact
                </Link>
              </li>
              {/* Sign Out button (Visible on mobile) */}
              <li className="md:hidden">
                <button
                  onClick={handleClickSignout}
                  className="bg-transparent border border-black py-2 px-4 rounded  hover:text-blue-500 dark:text-white"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>
          {children}
        </>
      )}
    </>
  )
};

export default AdminNavbar;
