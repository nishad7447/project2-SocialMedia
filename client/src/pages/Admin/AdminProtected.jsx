import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axios';
import { AdminBaseURL } from '../../API';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage,setAdminLogin } from '../../redux/slice';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};
const AdminNavbar = ({ children }) => {
  const {adminToken,admin}=useSelector((state)=>state.auth)
  const dispatch=useDispatch()
  const nav=useNavigate()
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(()=>{
    if(localStorage.getItem('adminToken')&&localStorage.getItem('role')){
      validateToken()
    }else{
      nav('/admin-login')
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const validateToken=()=>{
    axiosInstance.get(`${AdminBaseURL}/`)
    .then((res)=>{
      console.log(res.data,"admin token validation")
      if(res.data.success){
        dispatch(setAdminLogin({admin:res.data.role}))
      }else {
        dispatch(setMessage(res.message));
        console.log(" admin validation Failed");
        throw new Error(res.data.message + " validationToken error");
      }
    })
    .catch((error) => {
      console.error(error.message, "/Base url err=>admin not working");
    })
    .finally(() => {
      setLoadingUser(false); // Set loadingUser to false once the user details are fetched or the API call completes
    });
  }

  const handleClickSignout =()=>{
    localStorage.removeItem('adminToken')
    localStorage.removeItem('role')
    nav('/admin-login')
  }

  return (
   <>
    {loadingUser ? (
      <Spinner />
    ) : (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-gray-400 dark:bg-navy-800 dark:border-gray-700 p-4  ">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <a href="/" className="self-center text-2xl font-semibold whitespace-nowrap text-[33px] capitalize text-blue-500">
            Admin
          </a>
          <ul className="flex items-center space-x-6">
            <li>
              <a href="/" className="hover:underline dark:text-white">
                Home
              </a>
            </li>
            <li className="relative">
              <a href="/" className="hover:underline dark:text-white">
                User Management
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline dark:text-white">
                Post Management
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline dark:text-white">
                Ad Management
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline dark:text-white">
                Contact
              </a>
            </li>
          </ul>
          <div className="ml-6">
            <button onClick={handleClickSignout} className="bg-transparent border border-black py-2 px-4 rounded hover:bg-white hover:text-blue-500 dark:text-white">
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      {children}
    </>
    )}
   </>
  )
};

export default AdminNavbar;
