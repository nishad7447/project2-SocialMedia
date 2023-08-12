import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiX } from 'react-icons/fi'; // Import the send and X icons from react-icons
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';
import { toast } from 'react-toastify';
import moment from 'moment'
import EmojiPicker from 'emoji-picker-react';


const CommentModal = ({ postId, closeModal }) => {
  const [comment, setComment] = useState('');
  const [fetchedComments, setFetchedComments] = useState([])
  const [updateUI, setUpdateUI] = useState(false)
  const modalRef = useRef();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojis, setEmojis] = useState([])
  useEffect(() => {
    // Get the list of emojis from the emoji-picker library
    const data = require('@emoji-mart/data');
    setEmojis(data);
  }, []);
  const handleEmojiClick = (emojiObject) => {
    // Extract the emoji character from the emoji object
    const emoji = emojiObject.emoji;

    // Insert the emoji into the input message
    setComment(comment + emoji);
  };

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

  const handleCommentSubmit = () => {
    axiosInstance.post(`${UserBaseURL}/commentPost`, { comment, postId })
      .then((res) => {
        console.log(res)
        toast.success(res.data.message)
        setUpdateUI((prevState) => !prevState)
        setComment('')
      })
      .catch((err) => {
        console.log(err, "Comment submit error")
        toast.error(err.data.message)
      })
  }

  useEffect(() => {
    axiosInstance.get(`${UserBaseURL}/getAllComments/${postId}`)
      .then((res) => {
        setFetchedComments(res.data.comments)
        console.log(fetchedComments)
      })
      .catch((err) => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUI])

  //moment.js config
  const formatPostDate = (date) => {
    const now = moment();
    const postDate = moment(date);

    if (now.diff(postDate, 'seconds') < 60) {
      return 'Just now';
    } else if (now.diff(postDate, 'days') === 0) {
      return postDate.fromNow(); // Display "x minutes ago", "an hour ago", etc.
    } else if (now.diff(postDate, 'days') === 1) {
      return 'Yesterday';
    } else if (now.diff(postDate, 'days') <= 4) {
      return `${now.diff(postDate, 'days')} days ago`; // Display "X days ago" for posts within the last 4 days
    } else if (now.diff(postDate, 'years') === 0) {
      return postDate.format('MMMM D'); // Display "Month Day" for posts within the current year
    } else {
      return postDate.format('LL'); // Display "Month Day, Year" for posts older than a year
    }
  };


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
          {fetchedComments ? fetchedComments.map((comment, index) => (
            <div key={index} className="mb-2 flex items-center">
              <img
                src={comment?.userId.ProfilePic}
                alt={comment?.userId.UserName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="font-bold text-sm dark:text-white">{comment?.userId.UserName}</p> {/* Use dark:text-white to make text white in dark mode */}
                <p className="text-sm dark:text-white">{comment?.content}</p> {/* Use dark:text-white to make text white in dark mode */}
                <p className="text-xs text-gray-500 dark:text-white">{formatPostDate(comment?.createdAt)}</p> {/* Use dark:text-white to make text white in dark mode */}
              </div>
            </div>
          )) : <p className="flex justify-center font-bold text-sm dark:text-white">No comments yet </p>}
        </div>
       <div className="flex items-center relative"> {/* Use flex container to place textarea and button in a row */}
  <textarea
    className="flex-grow px-3 py-2 text-sm border rounded-3xl resize-none focus:outline-none focus:shadow-outline bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white "
    placeholder="Write your comment..."
    rows={1} // Set rows to 1 to make it a single line
    value={comment}
    onChange={handleCommentChange}
    onInput={autoSizeTextarea}
  />
  <button
    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    className="absolute mr-4 flex items-center justify-center h-full w-12 right-4 top-0 text-gray-400 hover:text-gray-600"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  </button>
  {showEmojiPicker && (
    <div className="absolute z-50 right-0 bottom-10 w-44 sm:w-auto"> {/* Modal */}
      <EmojiPicker
        emojis={emojis}
        onEmojiClick={handleEmojiClick}
        className="EmojiPicker"
      />
    </div>
  )}
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
