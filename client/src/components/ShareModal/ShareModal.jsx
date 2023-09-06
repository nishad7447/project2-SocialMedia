import React, { useEffect, useRef, useState } from 'react';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { FaFacebook, FaGithub, FaTimes } from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose, id }) => {
    const [isCopied, setIsCopied] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [inputValue, setInputValue] = useState('https://onlyfriends.fun/#' + id);


    const closeRef = useRef(null);
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (closeRef.current && !closeRef.current.contains(event.target)) {
                onClose()
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleCopyLink = () => {
        const inputElement = document.getElementById('inputField');
        inputElement.select();
        if (document.execCommand('copy')) {
            setIsCopied(true);
            setTimeout(() => {
                window.getSelection().removeAllRanges();
                setIsCopied(false);
            }, 3000);
        }
    };


    const [facebookSdkLoaded, setFacebookSdkLoaded] = useState(false);

    useEffect(() => {
        if (!facebookSdkLoaded) {
            // Initialize the Facebook SDK
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: '825163632269804',
                    xfbml: true,
                    version: 'v12.0',
                });
            };

            // Load the SDK asynchronously
            (function (d, s, id) {
                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script', 'facebook-jssdk');

            setFacebookSdkLoaded(true);
        }
    }, [facebookSdkLoaded]);

    const handleFacebookShare = () => {
        window.FB.ui(
            {
                display: 'popup',
                method: 'share',
                href: inputValue,
            },
            function (response) {
                // Callback function after sharing
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-40 dark:text-white">
            {isOpen && (
                <div ref={closeRef} className="popup bg-white p-6 rounded-lg top-1/2 left-1/2 dark:bg-navy-700">
                    <header className="flex items-center justify-between pb-4 border-b">
                        <span className="text-xl font-semibold">Share Modal</span>
                        <button
                            className="text-white bg-red-500 p-2 rounded-3xl"
                            onClick={onClose}
                        >
                            <FaTimes />
                        </button>
                    </header>
                    <div className="content pt-6">
                        <p className="text-base">Share this link via</p>
                        <ul className="icons flex space-x-4 mt-4">
                            <button className="fab-button" onClick={handleFacebookShare}>
                                <FaFacebook size={26} />
                            </button>
                            <button className="fab-button">
                                <FaGithub size={26} />
                            </button>
                            <button className="fab-button">
                                <BsFillChatDotsFill size={26} />
                            </button>

                        </ul>
                        <p className="text-base mt-6">Or copy link</p>
                        <div className={`field flex items-center border mt-3 ${isCopied ? 'active' : ''}`}>
                            <input
                                id="inputField"
                                type="text"
                                readOnly
                                value={inputValue}
                                className="flex-grow  border-none outline-none text-sm dark:bg-navy-700"
                            />
                            <button
                                className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-full ml-2"
                                onClick={handleCopyLink}
                            >
                                {isCopied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareModal;
