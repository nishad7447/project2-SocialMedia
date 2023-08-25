import TotalSpent from "./components/TotalSpend";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart } from "react-icons/md";
import {toast} from 'react-toastify'
import Widget from "../../components/Widget/Widget";
import DailyTraffic from "./components/DailyTraffic";
import { FaUsers, FaUsersCog } from "react-icons/fa";
import { RiAdvertisementFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { AdminBaseURL } from "../../API";
import { axiosAdminInstance } from "../../axios";

const Dashboard = () => {
  const [allUsers,setAllUsers]=useState([])
  const [allPosts,setAllPosts]=useState([])
  const [allAds,setAllAds]=useState([])


  useEffect(()=>{
    axiosAdminInstance.get(`${AdminBaseURL}/dashboard`)
    .then((res)=>{
      if(res.data.success){
        setAllUsers(res.data.allUsers)
        setAllPosts(res.data.allPosts)
        setAllAds(res.data.allAds)
      }
    })
    .catch((error) => {
      console.log("user error fetch dashboard", error)
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        toast.error('An error occurred while user fetch dashboard.');
      }
    });
  },[])

  const adsEarning=allAds.reduce((acc,ad)=>ad.Amount + acc,0)
  const onlineUsersCount = allUsers.filter(user => user.Online).length;

  return (
    <div className="px-6 py-8 pt-20 bg-lightPrimary dark:bg-navy-900">
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Sponsored Ads Earnings"}
          subtitle={`₹${adsEarning}`}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total Projects"}
          subtitle={"3"}
        />
        <Widget
          icon={<FaUsersCog className="h-6 w-6" />}
          title={"Users Online"}
          subtitle={`${onlineUsersCount}`}
        />
     <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Total Posts"}
          subtitle={`${allPosts.length}`}
        />
        <Widget
          icon={<FaUsers className="h-6 w-6" />}
          title={"Total Users"}
          subtitle={`${allUsers.length}`}
        />
        <Widget
          icon={<RiAdvertisementFill className="h-6 w-6" />}
          title={"Total Ads"}
          subtitle={`${allAds.length}`}
        />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <DailyTraffic />
      </div>
    </div>
  );
};

export default Dashboard;
