import { MdArrowDropUp } from "react-icons/md"
import Card from "../../../components/Card/Card"
import LineChart from "./charts/LineChart"
import { useEffect, useState } from "react";
import { axiosAdminInstance } from "../../../axios";
import { AdminBaseURL } from "../../../API";
import { toast } from "react-toastify";
const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};
const TotalSpent = () => {

  const [calculationsComplete, setCalculationsComplete] = useState(false);
  var [April, setApr] = useState(null)
  var [May, setMay] = useState(null)
  var [June, setJun] = useState(null)
  var [July, setJul] = useState(null)
  var [August, setAug] = useState(null)
  var [September, setSep] = useState(null)
  useEffect(() => {
    axiosAdminInstance.get(`${AdminBaseURL}/calculate`)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data)
          setApr(res.data.monthlyTotals.April)
          setMay(res.data.monthlyTotals.May)
          setJun(res.data.monthlyTotals.June)
          setJul(res.data.monthlyTotals.July)
          setAug(res.data.monthlyTotals.August)
          setSep(res.data.monthlyTotals.September)
        }
      })
      .catch((error) => {
        console.log("user error fetch calculate", error)
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred while user fetch calculate.');
        }
      })
      .finally(() => {
        setCalculationsComplete(true)
      });
  }, [])

  const lineChartDataTotalSpent = [
    {
      name: "Expectation",
      data: [100, 500, 300, 1500, 1000, 2000],
      color: "#4318FF",
    },
    {
      name: "Profit",
      data: [April, May, June, July, August, September],
      color: "#6AD2FF",
    },
  ];

  const lineChartOptionsTotalSpent = {
    legend: {
      show: false,
    },

    theme: {
      mode: "light",
    },
    chart: {
      type: "line",

      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },

    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#000000"
      },
      theme: 'dark',
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      type: "text",
      range: undefined,
      categories: ["APR", "MAY", "JUN", "JUL", "AUG", "SEP"],
    },

    yaxis: {
      show: false,
    },
  };

  return (
    <>
      {
        !calculationsComplete ?
          <Spinner /> :
          (<Card extra="!p-[20px] text-center">
            <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
              <div className="flex flex-col">
                <p className="mt-2 text-sm text-gray-600">Top Revenue</p>
                <p className="mt-[20px] flex text-3xl font-bold text-navy-700 dark:text-white">
                  {`₹${August}`}
                </p>
                <div className="flex flex-col items-start">
                  <div className="flex flex-row items-center justify-center">
                    <MdArrowDropUp className="font-medium text-green-500" />
                    <p className="text-sm font-bold text-green-500"> +2.45% </p>
                  </div>
                </div>
              </div>
              <div className="h-full w-full">
                <LineChart
                  chartOptions={lineChartOptionsTotalSpent}
                  chartData={lineChartDataTotalSpent}
                />
              </div>
            </div>
          </Card>)
      }
    </>
  )
}

export default TotalSpent
