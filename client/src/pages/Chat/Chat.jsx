
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Card from '../../components/Card/Card'
import EmojiPicker from 'emoji-picker-react';

export default function Chat() {
  const { user } = useSelector((state) => state.auth)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [emojis, setEmojis] = useState([])
  const [messages, setMessages] = useState([
    { id: 1, content: "Hey, how are you today?", sender: "user", time: "10:30 AM", seen: true },
    { id: 2, content: "I'm ok what about you?", sender: "other", time: "11:00 AM", seen: false },
    // Add more messages here

  ]);

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
  const handleInputMessageChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          content: inputMessage,
          sender: 'user',
          time: getCurrentTime(),
          seen: false,
        },
      ]);
      setInputMessage('');
    }
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    return `${currentTime.getHours()}:${currentTime.getMinutes()}`;
  };

  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom after rendering messages
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);
  return (

    <>

      <Card extra="mt-10 m-4 rounded-xl shadow-lg bg-white dark:bg-gray-900 dark:text-white">
        <div className="flex h-screen antialiased rounded-xl shadow-lg  text-gray-800 dark:bg-navy-900 dark:text-white">
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
                  <span
                    className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full dark:bg-gray-700"
                  >4</span
                  >
                </div>
                <div className="flex flex-col max-h-[580px] space-y-1 mt-4 -mx-2  overflow-y-auto">
                  <button
                    className="flex flex-row items-center hover:bg-gray-100 dark:hover:bg-navy-600 rounded-xl p-2"
                  >
                    <div
                      className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
                    >
                      H
                    </div>
                    <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
                  </button>
                  <button
                    className="flex flex-row items-center hover:bg-gray-100 dark:hover:bg-navy-600 rounded-xl p-2"
                  >
                    <div
                      className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full"
                    >
                      M
                    </div>
                    <div className="ml-2 text-sm font-semibold">Marta Curtis</div>
                    <div
                      className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none"
                    >
                      2
                    </div>
                  </button>
                  <button
                    className="flex flex-row items-center hover:bg-gray-100 dark:hover:bg-navy-600 rounded-xl p-2"
                  >
                    <div
                      className="flex items-center justify-center h-8 w-8 bg-orange-200 rounded-full"
                    >
                      P
                    </div>
                    <div className="ml-2 text-sm font-semibold">Philip Tucker</div>
                  </button>
                  <button
                    className="flex flex-row items-center hover:bg-gray-100 dark:hover:bg-navy-600 rounded-xl p-2"
                  >
                    <div
                      className="flex items-center justify-center h-8 w-8 bg-pink-200 rounded-full"
                    >
                      C
                    </div>
                    <div className="ml-2 text-sm font-semibold">Christine Reid</div>
                  </button>
                  <button
                    className="flex flex-row items-center hover:bg-gray-100 dark:hover:bg-navy-600 rounded-xl p-2"
                  >
                    <div
                      className="flex items-center justify-center h-8 w-8 bg-purple-200 rounded-full"
                    >
                      J
                    </div>
                    <div className="ml-2 text-sm font-semibold">Jerry Guzman</div>
                  </button>
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
                      {messages.map((message) => (
                        <div key={message.id} className={`col-start-${message.sender === 'user' ? '6' : '1'} col-end-${message.sender === 'user' ? '13' : '8'} p-3 rounded-lg`}>
                          <div className={`flex ${message.sender === 'user' ? 'justify-start flex-row-reverse' : 'flex-row'} items-center`}>
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              A
                            </div>
                            <div className={`relative ${message.sender === 'user' ? 'mr-3 bg-indigo-300' : 'ml-3 bg-white'} text-sm py-2 px-4 shadow rounded-xl`}>
                              <div>{message.content}</div>
                            </div>
                          </div>
                          <div className={`flex ${message.sender === 'user' ? 'justify-end' : ''}`}>
                            <div className="text-xs text-gray-500 mt-1 self-end">
                              {message.time}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 ml-1 self-end">
                              {message.seen ? 'Seen' : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4 dark:text-black"
                >

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
                        <div className="absolute z-50 right-0 bottom-10 w-44 sm:w-auto">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}
