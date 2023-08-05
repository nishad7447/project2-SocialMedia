import React, { useEffect, useRef, useState } from "react";
import CardMenu from "../../../components/Card/CardMenu";
import Card from "../../../components/Card/Card";
import {  MdChevronLeft, MdChevronRight } from "react-icons/md";
import { CgOptions } from 'react-icons/cg'
import { AdminBaseURL } from "../../../API";
import { toast } from 'react-toastify';
import { axiosAdminInstance } from "../../../axios";
import { FaTimes } from "react-icons/fa";


export default function Table({ tableData, setUpdateUI }) {
  const ROWS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(0);
  const [sorting, setSorting] = useState({ columnId: null, order: "asc" });

  const totalPages = Math.ceil(tableData.length / ROWS_PER_PAGE);
  const startIndex = currentPage * ROWS_PER_PAGE;
  const endIndex = (currentPage + 1) * ROWS_PER_PAGE;

  const sortData = (data, columnId, order) => {
    return data.slice().sort((a, b) => {
      const valA = a[columnId];
      const valB = b[columnId];

      // Check if values are icons (react-icons)
      const isIconA = React.isValidElement(valA);
      const isIconB = React.isValidElement(valB);

      if (isIconA || isIconB) {
        return 0; // Icons are considered equal, no sorting needed
      } else {
        // If both are not icons and the columnId exists in the objects, perform the localeCompare
        if (valA && valB) {
          const sortOrder = order === "asc" ? 1 : -1;
          return valA.localeCompare(valB) * sortOrder;
        }
        return 0; // If columnId doesn't exist, consider them equal, no sorting needed
      }
    });
  };


  const handleSortingChange = (columnId) => {
    if (sorting.columnId === columnId) {
      setSorting((prevSorting) => ({
        columnId,
        order: prevSorting.order === "asc" ? "desc" : "asc",
      }));
    } else {
      setSorting({ columnId, order: "asc" });
    }
  };

  const sortedData = sortData(tableData, sorting.columnId, sorting.order);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userToBlock, setUserToBlockOrUnblock] = useState(null);


  const handleReportClick = (postId) => {
    // Here you can store the postId in a state and open the confirmation modal
    setUserToBlockOrUnblock(postId); // Replace `postId` with your post ID property
    setShowConfirmationModal(true);
  };

  const handleCancel = () => {

    setShowConfirmationModal(false);
  };

  const handleConfirm =()=>{
    console.log()
  }



  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">Users</div>
        <CardMenu />
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="!border-px !border-gray-400">
              <th
                className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                onClick={() => handleSortingChange("userId.Name")}
              >
                <p className="text-sm font-bold text-gray-600 dark:text-white">NAME</p>
              </th>
              <th
                className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                onClick={() => handleSortingChange("createdAt")}
              >
                <p className="text-sm font-bold text-gray-600 dark:text-white">DATE</p>
              </th>
              <th
                className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
              // onClick={() => handleSortingChange("Online")}
              >
                <p className="text-sm font-bold text-gray-600 dark:text-white">POST</p>
              </th>
              <th
                className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
              // onClick={() => handleSortingChange("Status")}
              >
                <p className="text-sm font-bold text-gray-600 dark:text-white">REPORTS</p>
              </th>
              <th
                className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
              // onClick={() => handleSortingChange("createdAt")}
              >
                <p className="text-sm font-bold text-gray-600 dark:text-white">OPTIONS</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(startIndex, endIndex).map((row) => (
              <tr key={row.id}>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full mr-3"
                      src={row.userId.ProfilePic}
                      alt={row.userId.Name}
                    />
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {row.userId.Name}
                    </p>
                  </div>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <div className="flex items-center">
                    {!row.fileUrl ? (
                      <p
                        className="text-sm font-bold text-navy-700 dark:text-white"
                        style={{ maxWidth: "80px" }}
                      >
                        {row.content}
                      </p>
                    ) : (
                      (() => {
                        if (row.fileUrl) {
                          const extension = row.fileUrl.split('.').pop().toLowerCase();
                          if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                            return (
                              <img
                                className="w-full h-auto rounded-lg mb-4"
                                src={row.fileUrl}
                                alt="Post"
                                style={{ maxWidth: "100px" }}
                              />
                            );
                          } else if (extension === 'mp4') {
                            return (
                              <video className="w-full h-auto rounded-lg mb-4" controls style={{ maxWidth: "100px" }}>
                                <source src={row.fileUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            );
                          } else if (extension === 'mp3') {
                            return (
                              <audio className="w-full" controls style={{ maxWidth: "100px" }}>
                                <source src={row.fileUrl} type="audio/mp3" />
                                Your browser does not support the audio element.
                              </audio>
                            );
                          } else {
                            return <p>Unsupported file format</p>;
                          }
                        }
                      })()
                    )}
                  </div>

                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                <p
                    onClick={() => handleReportClick(row._id)} 
                    className="ml-1 cursor-pointer text-sm font-bold text-navy-700 dark:text-white"
                  >
                    {row.reportCount} Reports
                  </p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                <CgOptions />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="px-4 py-2 mx-2 rounded-md">
          Showing {currentPage * ROWS_PER_PAGE + 1} - {Math.min(sortedData.length, (currentPage + 1) * ROWS_PER_PAGE)} of {sortedData.length} entries
        </div>
        <div className="flex ml-auto space-x-1">
          <button
            className="px-3 py-2 bg-gray-200 rounded-md dark:text-black dark:bg-gray-800"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <MdChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index).map((page) => (
            <button
              key={page}
              className={`px-3 py-2 ${currentPage === page ? "!bg-blue-500 text-white" : "bg-gray-200"
                } rounded-md dark:text-black dark:bg-gray-800`}
              onClick={() => setCurrentPage(page)}
            >
              {page + 1}
            </button>
          ))}
          <button
            className="px-3 py-2 bg-gray-200 rounded-md dark:text-black dark:bg-gray-800"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            <MdChevronRight />
          </button>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmationModal
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </Card>
  );
}

function ConfirmationModal({ onCancel, onConfirm }) {

  const modalRef = useRef();

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onCancel();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-40">
      <div ref={modalRef} className="bg-white rounded-lg p-4 pt-2 dark:bg-navy-700">
        <div className="flex justify-between items-center mb-2 ">
          <p className="text-xl font-semibold ">Confirmation</p>
          <button
            className="text-white bg-red-500 p-2 rounded-3xl"
            onClick={onCancel}
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center mb-4">
          <hr className="w-full border-gray-300" />
        </div>
        <p className="text-lg font-semibold mb-4">
          Are you sure you want to block or unblock this user?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md dark:text-black dark:bg-gray-800"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={onConfirm}
          >
            Block/Unblock
          </button>
        </div>
      </div>
    </div>
  );
}