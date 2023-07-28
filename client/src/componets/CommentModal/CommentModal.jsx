import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiX } from 'react-icons/fi'; // Import the send and X icons from react-icons
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';
import { toast } from 'react-toastify';

const CommentModal = ({ postId, closeModal }) => {
  const [comment, setComment] = useState('');
  const [fetchedComments, setFetchedComments] = useState([])
  const [updateUI,setUpdateUI]=useState(false)
  const modalRef = useRef();

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoSizeTextarea = (e) => {
    e.target.rows = Math.min(4, e.target.scrollHeight / 20); // You can adjust the row height as needed
  };

  const handleCommentSubmit=()=>{
    axiosInstance.post(`${UserBaseURL}/commentPost`,{comment,postId})
    .then((res)=>{
      console.log(res)
      toast.success(res.data.message)
      setUpdateUI((prevState)=> !prevState)
      setComment('')
    })
    .catch((err)=>{
      console.log(err,"Comment submit error")
      toast.error(err.data.message)
    })
  }

  useEffect(()=>{
    axiosInstance.get(`${UserBaseURL}/getAllComments/${postId}`)
    .then((res)=>{
      setFetchedComments(res.data.comments)
      console.log(fetchedComments)
    })
    .catch((err)=>{
      console.log(err)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[updateUI])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-75 bg-gray-800 backdrop-blur flex justify-center items-center">
      <div ref={modalRef} className="p-4 rounded-lg bg-white dark:bg-gray-900 w-96">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold dark:text-white">Comments</h3> 
          <button className="text-red-500 hover:text-red-600 dark:text-white" onClick={closeModal}>
            <FiX size={18} />
          </button>
        </div>
        <div className="mb-2 h-60 overflow-y-auto"> {/* Set the fixed height and make it scrollable */}
          {fetchedComments? fetchedComments.map((comment, index) => (
            <div key={index} className="mb-2 flex items-center">
              <img
                src={comment?.userId.ProfilePic}
                alt={comment?.userId.UserName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="font-bold text-sm dark:text-white">{comment?.userId.UserName}</p> {/* Use dark:text-white to make text white in dark mode */}
                <p className="text-sm dark:text-white">{comment?.content}</p> {/* Use dark:text-white to make text white in dark mode */}
                <p className="text-xs text-gray-500 dark:text-white">{new Date(comment?.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p> {/* Use dark:text-white to make text white in dark mode */}
              </div>
            </div>
          )): <p className="flex justify-center font-bold text-sm dark:text-white">No comments yet </p>}
        </div>
        <div className="flex items-center"> {/* Use flex container to place textarea and button in a row */}
          <textarea
            className="flex-grow px-3 py-2 text-sm border rounded-3xl resize-none focus:outline-none focus:shadow-outline bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white "
            placeholder="Write your comment..."
            rows={1} // Set rows to 1 to make it a single line
            value={comment}
            onChange={handleCommentChange}
            onInput={autoSizeTextarea}
          />
          {comment.trim().length > 0 && (
            <button
              onClick={handleCommentSubmit}
              className="text-white bg-blue-500 hover:bg-blue-600 rounded-3xl p-2 ml-2"
            >
              <FiSend size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommentModal;
