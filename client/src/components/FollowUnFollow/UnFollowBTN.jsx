import React from 'react'
import { axiosInstance } from '../../axios'
import { UserBaseURL } from '../../API';
import { toast } from 'react-toastify';
import {RiUserUnfollowLine } from 'react-icons/ri';


export default function UnFollowBTN({ friendId, setUpdateUI }) {
    const unfollow = () => {
        axiosInstance.post(`${UserBaseURL}/unfollow`, { oppoId: friendId })
            .then((res) => {
                toast.success(res?.data.message)
                setUpdateUI((prevState) => !prevState)
            })
            .catch((error) => {
                console.log("user error clicking unFollow", error)

                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while user error clicking unFollow.');
                }
            });
    }
    return (
        <>
            <RiUserUnfollowLine className="w-5 h-5 text-blue-500 hover:text-blue-600" onClick={unfollow} />
        </>

    )
}
