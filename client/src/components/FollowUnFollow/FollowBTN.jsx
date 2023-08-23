import React from 'react'
import { FaUserPlus } from 'react-icons/fa'
import { axiosInstance } from '../../axios'
import { UserBaseURL } from '../../API';
import { toast } from 'react-toastify';


export default function FollowBTN({friendId,setUpdateUI}) {
    const follow=()=>{
        axiosInstance.post(`${UserBaseURL}/follow`,{oppoId:friendId})
        .then((res) => {
            toast.success(res?.data.message)
            setUpdateUI((prevState) => !prevState)
          })
          .catch((error) => {
            console.log("user error clicking follow", error)
    
            if (error.response && error.response.data && error.response.data.message) {
              const errorMessage = error.response.data.message;
              toast.error(errorMessage);
            } else {
              toast.error('An error occurred while user error clicking follow.');
            }
          });
    }
  return (
        <>
            <FaUserPlus className="w-5 h-5 text-blue-500 hover:text-blue-600" onClick={follow} />
        </>
    )
}
