import React, { useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa';

export default function Modal({Heading,content,onConfirm,onCancel}) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-40 dark:text-white">
    <div ref={modalRef} className="bg-white rounded-lg p-4 pt-2 dark:bg-navy-700">
      <div className="flex justify-between items-center mb-2 ">
        <p className="text-xl font-semibold ">{Heading}</p>
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
        {content}
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
          Confirm
        </button>
      </div>
    </div>
  </div>
  )
}
