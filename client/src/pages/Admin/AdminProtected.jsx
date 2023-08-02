import React from 'react';

const AdminNavbar = ({ children }) => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-gray-400 dark:bg-navy-800 dark:border-gray-700 p-4  ">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <a href="/" className="self-center text-2xl font-semibold whitespace-nowrap text-[33px] capitalize text-blue-500">
            Admin
          </a>
          <ul className="flex items-center space-x-6">
            <li>
              <a href="/" className="hover:underline dark:text-white">
                Home
              </a>
            </li>
            <li className="relative">
              <a href="/" className="hover:underline dark:text-white">
                Dashboard
              </a>
              {/* Dropdown menu */}
              <ul className="absolute top-full left-0 w-40 bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-md hidden">
                <li>
                  <a href="/" className="block px-4 py-2 hover:bg-gray-100 dark:text-white">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="/" className="block px-4 py-2 hover:bg-gray-100 dark:text-white">
                    My downloads
                  </a>
                </li>
                <li>
                  <a href="/" className="block px-4 py-2 hover:bg-gray-100 dark:text-white">
                    Billing
                  </a>
                </li>
                <li>
                  <a href="/" className="block px-4 py-2 hover:bg-gray-100 dark:text-white">
                    Rewards
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/" className="hover:underline dark:text-white">
                Services
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline dark:text-white">
                Pricing
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline dark:text-white">
                Contact
              </a>
            </li>
          </ul>
          <div className="ml-6">
            <button className="bg-transparent border border-black py-2 px-4 rounded hover:bg-white hover:text-blue-500 dark:text-white">
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
};

export default AdminNavbar;
