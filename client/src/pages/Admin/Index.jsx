import MiniCalendar from "../../components/Calendar/Calendar";
import WeeklyRevenue from "./components/WeeklyRevenue";
import TotalSpent from "./components/TotalSpend";
import PieChartCard from "./components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import Widget from "../../components/Widget/Widget";
// import CheckTable from "./components/CheckTable";
import ComplexTable from "./components/ComplexTable";
import DailyTraffic from "./components/DailyTraffic";
import TaskCard from "./components/TaskCard";

const Dashboard = () => {
    // const tableDataCheck = [
    //     {
    //       name: ["Horizon UI PRO", true],
    //       quantity: 2458,
    //       progress: "17.5%",
    //       date: "12 Jan 2021"
    //     },
    //     {
    //       name: ["Horizon UI Free", true],
    //       quantity: 1485,
    //       progress: "10.8%",
    //       date: "21 Feb 2021"
    //     },
    //     {
    //       name: ["Weekly Update", true],
    //       quantity: 1024,
    //       progress: "21.3%",
    //       date: "13 Mar 2021"
    //     },
    //     {
    //       name: ["Venus 3D Asset", true],
    //       quantity: 858,
    //       progress: "31.5%",
    //       date: "24 Jan 2021"
    //     },
    //     {
    //       name: ["Marketplace", true],
    //       quantity: 258,
    //       progress: "12.2%",
    //       date: "24 Oct 2022"
    //     }
    //   ]
    const tableDataComplex = [
      {
          name: 'User a',
          progress: 75.5,
          status: 'Approved',
          date: '12 Jan 2021'
      },
      {
          name: 'user002',
          progress: 25.5,
          status: 'Disable',
          date: '21 Feb 2021'
      },
      {
          name: 'user003',
          progress: 90,
          status: 'Error',
          date: '13 Mar 2021'
      },
      {
          name: 'user004',
          progress: 50.5,
          status: 'Approved',
          date: '24 Oct 2022'
      },
      {
          name: 'user005',
          progress: 75.5,
          status: 'Approved',
          date: '12 Jan 2021'
      },
      {
          name: 'user006',
          progress: 25.5,
          status: 'Disable',
          date: '21 Feb 2021'
      },
      {
          name: 'user007',
          progress: 90,
          status: 'Error',
          date: '13 Mar 2021'
      },
      {
          name: 'user008',
          progress: 50.5,
          status: 'Approved',
          date: '24 Oct 2022'
      },
      {
          name: 'user009',
          progress: 75.5,
          status: 'Approved',
          date: '12 Jan 2021'
      },
      {
          name: 'user010',
          progress: 25.5,
          status: 'Disable',
          date: '21 Feb 2021'
      }
    ];
    
  return (
    <div className="px-6 py-8 pt-20 bg-lightPrimary dark:bg-navy-900">
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Earnings"}
          subtitle={"$340.5"}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Spend this month"}
          subtitle={"$642.39"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Sales"}
          subtitle={"$574.34"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Your Balance"}
          subtitle={"$1,000"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"New Tasks"}
          subtitle={"145"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total Projects"}
          subtitle={"$2433"}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
   

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        <ComplexTable tableData={tableDataComplex} />

        {/* Task chart & Calendar */}

          <TaskCard />
        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar /> 
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
