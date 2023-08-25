import BarChart from "./charts/BarChart"
import Card from "../../../components/Card/Card"
import { useEffect, useState } from "react";
import { AdminBaseURL } from "../../../API";
import { axiosAdminInstance } from "../../../axios";
import { toast } from "react-toastify";

const DailyTraffic = () => {
  const [calculationsComplete, setCalculationsComplete] = useState(false);
  var [April, setApr] = useState(null)
  var [May, setMay] = useState(null)
  var [June, setJun] = useState(null)
  var [July, setJul] = useState(null)
  var [August, setAug] = useState(null)
  var [September, setSep] = useState(null)
  var [October, setOct] = useState(null)
  const [avg, setAvg] = useState(null)

  const Spinner = () => {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  };

  useEffect(() => {
    axiosAdminInstance.get(`${AdminBaseURL}/UserJoinTraffic`)
      .then((res) => {
        console.log(res)
        if (res.data.success) {
          console.log(res.data)
          setApr(res.data.JoinMonthlyTotals.April)
          setMay(res.data.JoinMonthlyTotals.May)
          setJun(res.data.JoinMonthlyTotals.June)
          setJul(res.data.JoinMonthlyTotals.July)
          setAug(res.data.JoinMonthlyTotals.August)
          setSep(res.data.JoinMonthlyTotals.September)
          setOct(res.data.JoinMonthlyTotals.October)
          setAvg(res.data.monthlyAverage)
        }
      })
      .catch((error) => {
        console.log("user error fetch UserJoinTraffic", error)
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred while user fetch UserJoinTraffic.');
        }
      })
      .finally(() => {
        setCalculationsComplete(true)
      });
  }, [])

  const barChartDataDailyTraffic = [
    {
      name: "Daily Traffic",
      data: [April, May, June, July, August, September, October],
    },
  ];

  const barChartOptionsDailyTraffic = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#000000"
      },
      onDatasetHover: {
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
      },
      theme: "dark",
    },
    xaxis: {
      categories: ["April", "May", "June", "July", "August", "September", "October"],
      show: false,
      labels: {
        show: true,
        style: {
          colors: "#A3AED0",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      color: "black",
      labels: {
        show: true,
        style: {
          colors: "#CBD5E0",
          fontSize: "14px",
        },
      },
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          [
            {
              offset: 0,
              color: "#4318FF",
              opacity: 1,
            },
            {
              offset: 100,
              color: "rgba(67, 24, 255, 1)",
              opacity: 0.28,
            },
          ],
        ],
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "40px",
      },
    },
  };

  return (
    <>
      {
        !calculationsComplete ?
          <Spinner /> :
          (<Card extra="pb-7 p-[20px]">
            <div className="flex flex-row justify-between">
              <div className="ml-1 pt-2">
                <p className="text-sm font-medium leading-4 text-gray-600">
                  Users Join Traffic
                </p>
                <p className="text-[34px] font-bold text-navy-700 dark:text-white">
                  {Number(avg).toFixed(3)}{" "}
                  <span className="text-sm font-medium leading-6 text-gray-600">
                    Joins/month
                  </span>
                </p>
              </div>
            </div>

            <div className="h-[300px] w-full pt-10 pb-0">
              <BarChart
                chartData={barChartDataDailyTraffic}
                chartOptions={barChartOptionsDailyTraffic}
              />
            </div>
          </Card>)
      }
    </>
  )
}

export default DailyTraffic
