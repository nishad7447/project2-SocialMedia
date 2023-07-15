import React from 'react';
import { BiHeart,BiCommentDots,BiSolidShareAlt } from "react-icons/bi";
import Card from '../../componets/Card/Card';

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12 ml-4 mr-4">
      <div className="col-span-1">
        {/* First Card - 1/4 of the row */}
        <Card>
          <div className="p-4">
            <div className="flex items-center mb-4">
              <img className="w-12 h-12 rounded-full mr-4" src='https://via.placeholder.com/150' alt="User Avatar" />
              <div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-gray-600">@johndoe</p>
              </div>
            </div>
            <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultricies facilisis justo, sit amet aliquam odio congue vitae.</p>
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold">1200</h3>
                <p className="text-gray-600">Followers</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">800</h3>
                <p className="text-gray-600">Following</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">250</h3>
                <p className="text-gray-600">Posts</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-span-1 md:col-span-2">
        {/* Second Card - 1/2 of the row */}
        <Card>
          <div className="p-4">
            <div className="flex items-center mb-4">
              <img className="w-10 h-10 rounded-full mr-2" src="https://via.placeholder.com/40" alt="User Avatar" />
              <div>
                <h3 className="text-sm font-bold">John Doe</h3>
                <p className="text-xs text-gray-600">Posted on July 14, 2023</p>
              </div>
            </div>
            <img className="w-full h-auto rounded-lg mb-4" src="https://via.placeholder.com/800x400" alt="Post Image" />
            <p className="text-sm mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempor, justo vel interdum dapibus, odio velit suscipit purus, in commodo velit elit sed nisl. Curabitur non ante vitae ex condimentum elementum. Mauris rhoncus iaculis justo, sit amet lacinia justo interdum non. In hac habitasse platea dictumst. Duis luctus mi a leo consectetur, eget pharetra felis aliquam. Integer tristique, erat vel ultrices tincidunt, ligula odio fermentum lorem, ut convallis tellus eros et ligula.
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                  <BiHeart />
                  {/* <span>Like</span> */}
                </button>
                <button className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                  <BiCommentDots />
                  {/* <span>Comment</span> */}
                </button>
              </div>
              <div className="flex items-center">
                <button className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2H6C4.9 2 4 2.9 4 4V20L10 16H18C19.1 16 20 15.1 20 14V4C20 2.9 19.1 2 18 2M18 14H10.83L6 17.17V4H18V14Z" />
                  </svg>
                  {/* <span>Save</span> */}
                </button>
                <button className="flex items-center text-gray-600 hover:text-blue-500">
                  <BiSolidShareAlt/>
                  {/* <span>Share</span> */}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-span-1">
        {/* Third Card - 1/4 of the row */}
        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold mb-2">Sponsored Ad</h2>
              <a className="text-gray-500 text-sm font-bold" href="https://www.example.com/create-ad" target="_blank" rel="noopener noreferrer">
                Create Ad
              </a>            
              </div>
            <img className="w-full h-auto rounded-lg mb-4" src="https://via.placeholder.com/800x400" alt="Ad Image" />
           <div className="flex justify-between">

            <div className="flex items-center mb-2">
              <p className="text-sm text-gray-500">Sponsored</p>
            </div>
            <div className="flex items-center mb-2">
              <a className="text-sm text-blue-500" href="https://www.example.com" target="_blank" rel="noopener noreferrer">Example.com</a>
            </div>

           </div>
           <p className="mb-4 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultricies facilisis justo, sit amet aliquam odio congue vitae.</p>

          </div>
        </Card>

        <Card extra="mt-4">
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Friends List</h2>
      {/* Add your friends list content here */}
    </div>
  </Card>

      </div>
    </div>
  );
}
