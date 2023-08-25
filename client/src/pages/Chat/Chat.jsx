
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Card from '../../components/Card/Card'
import EmojiPicker from 'emoji-picker-react';
import { RiChatNewFill } from 'react-icons/ri';
import { FaTimes } from 'react-icons/fa';
import { SiGooglemessages } from 'react-icons/si';
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';
import { toast } from 'react-toastify';
import { MdPersonSearch } from 'react-icons/md';
import io from 'socket.io-client'

var socket = null
const ENDPOINT = UserBaseURL



export default function Chat() {
  const { user } = useSelector((state) => state.auth)
  const userId = user?._id
  const [updateUI, setUpdateUI] = useState(false)

  //emoji
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
    setInputMessage(inputMessage + emoji);
  };

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([])
  const [chatId, setChatId] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [isSocket, isSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', userId)
    socket.on('connection', () => isSocketConnected(true))
  }, [userId])

  useEffect(() => {
    axiosInstance.get(`${UserBaseURL}/chat/`)
      .then((res) => setChatUsers(res.data))
      .catch((error) => {
        console.log("user error fetch chat", error)

        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred while user fetch chat.');
        }
      });
  }, [updateUI])

  const handleInputMessageChange = (event) => {
    setInputMessage(event.target.value);
  };

  const fetchMessage = () => {
    try {
      const id = chatId
      axiosInstance.get(`${UserBaseURL}/message/${id}`)
        .then((res) => {
          setMessages([...res.data])
          socket.emit('join chat', chatId)
        })
    } catch (error) {
      console.log(error, "error fetchingMSG")
    }
  }

  useEffect(() => {
    if (chatId) {
      setMessages([])
      fetchMessage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId])

  const fetchNewmsg=() => {
    socket.on("message received", (newMessageRecieved) => {
      setUpdateUI((prev) => !prev)
      console.log(chatId, "=both=", newMessageRecieved.chat._id)
      if (!chatId || chatId !== newMessageRecieved.chat._id) {
        console.log("failed to msg")
        return  
      } 
       console.log('perfect ok', newMessageRecieved)
       setMessages([...messages, newMessageRecieved])
       console.log(messages, 'realtime msg')
     
    })
  }
  useEffect(()=>{
    fetchNewmsg()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      try {
        const res = await axiosInstance.post(`${UserBaseURL}/message/`, { content: inputMessage, chatId })
        socket.emit('new message', res.data)
        setMessages([
          ...messages,
          res.data
        ]);
        setUpdateUI((prev) => !prev)
        setInputMessage('');
      } catch (error) {
        console.log("user error send chat", error)

        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred while user send chat.');
        }
      }
    }
  };


  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom after rendering messages
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  const [showAddUserModal, setAddUserModal] = useState(false)
  const closeModal = () => {  
    setAddUserModal(false)
  }

  // console.log(JSON.stringify(chatUsers))

  const handleChat = (chatId) => {
    console.log(chatId, "chaatId")
    setChatId(chatId)
    // axiosInstance.post(`${UserBaseURL}/getChatId`)
  }


  return (

    <>
      <button
        className="border-px fixed bottom-[30px] left-[35px] !z-[99] flex h-[60px] w-[60px] items-center justify-center rounded-full shadow-xl border-[#6a53ff] dark:bg-gradient-to-br from-brandLinear to-blueSecondary p-0 bg-gray-300"
        onClick={() => setAddUserModal(true)}
      ><RiChatNewFill size={28} /></button>
      <Card extra="mt-10 m-4 rounded-xl shadow-lg bg-white dark:bg-gray-900 dark:text-white">
        <div className="flex h-[81vh] antialiased rounded-xl shadow-lg  text-gray-800 dark:bg-navy-900 dark:text-white">
          <div className="flex sm:flex-row flex-col h-full w-full overflow-x-hidden">
            <div className="flex flex-col  py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0 rounded-xl  dark:bg-navy-900">
              <div className="flex flex-row items-center justify-center h-12 w-full">
                <div
                  className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-2 font-bold text-2xl">Chat</div>
              </div>
              <div className="flex flex-col mt-8">
                <div className="flex flex-row items-center justify-between text-xs">
                  <span className="font-bold">Active Conversations</span>
                  {/* <span
                    className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full dark:bg-gray-700"
                  >4</span
                  > */}
                </div>
                <div className="flex flex-col max-h-[580px] space-y-1 mt-4 -mx-2  overflow-y-auto">
                  {
                    chatUsers.length === 0
                      ?
                      <p className='text-xl font-semibold flex justify-center m-5'>No users found</p>
                      :
                      chatUsers.map((chatUsers) => (
                        chatUsers.isGroupChat ?
                          <button
                            onClick={() => handleChat(chatUsers._id)}
                            className={`flex  items-start ${chatUsers._id === chatId ? 'bg-gray-200 dark:bg-navy-700' : 'hover:bg-gray-100 dark:hover:bg-navy-600'}  rounded-xl p-2`}
                          >
                            <div
                              className="flex items-center text-black justify-center h-8 w-8 bg-gray-200 rounded-full"
                            >
                              G
                            </div>
                            <div className="flex flex-col">
                              <div className="ml-2 text-sm font-semibold">{chatUsers.chatName}</div>
                              <div
                                className=" text-[10px] ml-2 text-gray-500"
                              >
                                {
                                  chatUsers.latestMessage ?
                                    ` ${chatUsers.latestMessage?.sender?.UserName === user.UserName ? "You" : chatUsers.latestMessage?.sender?.UserName} : ${chatUsers.latestMessage?.content}`
                                    : ''
                                }
                              </div>
                            </div>
                            {/* <div
                              className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none"
                            >
                              2
                            </div> */}
                          </button>
                          :
                          <button
                            className={`flex  items-start ${chatUsers._id === chatId ? 'bg-gray-200 dark:bg-navy-700' : 'hover:bg-gray-100 dark:hover:bg-navy-600'}  rounded-xl p-2`}
                            onClick={() => handleChat(chatUsers._id)}
                          >
                            {
                              chatUsers.users.filter((users) => users._id.toString() !== user._id).map((user) => {
                                return (
                                  <>
                                    <img
                                      src={user.ProfilePic}
                                      alt="User Avatar"
                                      className="h-8 w-8 rounded-full bg-gray-200"
                                    />
                                    <div className="flex flex-col">
                                      <div className="ml-2 text-sm font-semibold">{user.UserName}</div>
                                      <div
                                        className=" text-[10px] ml-2 text-gray-500"
                                      >
                                        {
                                          chatUsers.latestMessage ?
                                            ` ${chatUsers.latestMessage?.sender?.UserName !== user.UserName ? "You" : chatUsers.latestMessage?.sender?.UserName} : ${chatUsers.latestMessage?.content}`
                                            : ''
                                        }
                                      </div>
                                    </div>
                                    {/* <div
                                      className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none"
                                    >
                                      2
                                    </div> */}
                                  </>
                                )
                              })
                            }
                          </button>
                      ))

                  }
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-auto h-full p-6">
              <div
                className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4 shadow-xl dark:bg-navy-700 dark:text-black"
              >
                <div className="flex flex-col h-full overflow-x-auto mb-4">
                  <div className="flex flex-col h-full justify-end">
                    <div
                      className="grid  gap-y-2 overflow-y-auto "
                      ref={containerRef}
                    >
                      {
                        messages.length === 0 ?
                          (
                            <div className='flex justify-center items-center h-full'>
                              <h1 className='text-3xl text-black dark:text-white'>No Message to show</h1>
                            </div>
                          )
                          :
                          (
                            messages.map((message) => (
                              <div key={message.id} className={`col-start-${message.sender._id !== user._id ? '6' : '1'} col-end-${message.sender === user._id ? '13' : '8'} p-3 rounded-lg`}>
                                <div className={`flex ${message.sender._id === user._id ? 'justify-start flex-row-reverse' : 'flex-row'} items-center`}>
                                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    <img src={message.sender?.ProfilePic} alt='' className='rounded-full'></img>
                                  </div>
                                  <div className={`relative ${message.sender._id === user._id ? 'mr-3 bg-indigo-300' : 'ml-3 bg-white'} text-sm py-2 px-4 shadow rounded-xl`}>
                                    <div>{message.content}</div>
                                  </div>
                                </div>
                                <div className={`flex ${message.sender._id === user._id ? 'justify-end' : ''}`}>
                                  <div className="text-xs text-gray-500 mt-1 self-end">
                                    {new Date(message.createdAt).toLocaleTimeString(undefined, {
                                      hour: 'numeric',
                                      minute: 'numeric',
                                      hour12: true
                                    })}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 ml-1 self-end">
                                    {message.seen ? 'Seen' : ''}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}

                    </div>
                  </div>
                </div>
                <div
                  className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4 dark:text-black"
                >
                  {
                    !chatId ? '' :
                      (
                        <>
                          <div className="flex-grow ml-4">
                            <div className="relative w-full sm:text-lg text-xs">
                              <input
                                type="text"
                                value={inputMessage}
                                onChange={handleInputMessageChange}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type something here...."
                                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10 "
                              />
                              <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
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
                                <div className="absolute z-50 right-0 bottom-10 w-44 sm:w-auto">Modal
                                  <EmojiPicker
                                    emojis={emojis}
                                    onEmojiClick={handleEmojiClick}
                                    className="EmojiPicker"
                                  />
                                </div>
                              )}
                            </div>

                          </div>
                          <div className="ml-4">
                            <button
                              onClick={handleSendMessage}
                              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                            >
                              <span>Send</span>
                              <span className="ml-2">
                                <svg
                                  className="w-4 h-4 transform rotate-45 -mt-px"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                  ></path>
                                </svg>
                              </span>
                            </button>
                          </div>
                        </>
                      )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {
        showAddUserModal ?
          <Modal onCancel={closeModal} setUpdateUI={setUpdateUI} /> : ""
      }
    </>
  )
}


function Modal({ onCancel, setUpdateUI }) {
  const modalRef = useRef();
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const { user } = useSelector((state) => state.auth)

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

  const searchUsers = (value) => {
    axiosInstance.post(`${UserBaseURL}/chat/search`, { search: searchQuery })
      .then((res) => {
        var result = res.data.results
        result = result.filter((users) => users._id.toString() !== user._id)
        setSearchResults(result);
      })
      .catch((err) => {
        toast.error(err.message, "search user error")
        console.log(err, "search user error")
      })
  }

  const handleChatAccess = (oppUserId) => {
    axiosInstance.post(`${UserBaseURL}/chat/`, { oppUserId })
      .then((res) => {
        setUpdateUI((prev) => !prev)
        onCancel()
        console.log(res, "user chat access and fetch")
      })
      .catch((err) => {
        toast.error(err.message, "user chat access and fetch error")
        console.log(err, "user chat access and fetch error")
      })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-40 dark:text-white">
      <div ref={modalRef} className="bg-white rounded-lg p-4 pt-2 dark:bg-navy-700">
        <div className="flex justify-between items-center mb-2 ">
          <p className="text-xl font-semibold ">Search User</p>
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

        <div className="flex justify-center items-center mb-7">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-full w-3/4 rounded-full bg-white border-gray-300 shadow-md text-sm font-medium text-navy-700 placeholder-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder-white px-4 py-2"
          />
          {searchQuery.trim().length > 0 && (
            <button
              onClick={searchUsers}
              className="text-white bg-blue-500 hover:bg-blue-600 rounded-3xl p-2 ml-2"
            >
              <MdPersonSearch size={18} />
            </button>
          )}
        </div>

        {
          searchResults.length > 0 ? (searchResults.map((oppUser) => (
            <div key={oppUser?._id} className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img className="w-10 h-10 rounded-full mr-2" src={oppUser?.ProfilePic} alt="oppUser Avatar" />
                <h3 className="text-sm font-bold">{oppUser?.UserName}</h3>
              </div>
              <SiGooglemessages onClick={() => handleChatAccess(oppUser?._id)} className="w-5 h-5 text-blue-500 hover:text-blue-600" />
            </div>
          )))
            : <p className='text-xl font-semibold flex justify-center m-5'>No users found</p>

        }

      </div>
    </div>
  );
}