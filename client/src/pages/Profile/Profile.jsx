import React, { useEffect, useRef, useState } from 'react';
import { BiHeart, BiCommentDots, BiSolidShareAlt, BiBriefcase, BiMap, BiSolidMessageSquareEdit } from "react-icons/bi";
import { FaCog, FaEdit, FaTimes } from "react-icons/fa";
import Card from '../../components/Card/Card';
import CreatePost from '../../components/CreatePost/CreatePost';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';
import CommentModal from '../../components/CommentModal/CommentModal';
import { toast } from 'react-toastify';
import { AiFillHeart } from 'react-icons/ai';
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import { SlOptionsVertical } from 'react-icons/sl'
import { useNavigate, useParams } from 'react-router-dom';
import { MdDeleteForever, MdReportProblem } from 'react-icons/md';
import Modal from '../../components/Modal/Modal';
import ShareModal from '../../components/ShareModal/ShareModal';
import moment from 'moment'
import FollowBTN from '../../components/FollowUnFollow/FollowBTN';
import UnFollowBTN from '../../components/FollowUnFollow/UnFollowBTN';
import { SiGooglemessages } from 'react-icons/si';

const Spinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
};
const Profile = () => {
    const nav = useNavigate()
    const { userId } = useParams()
    const loggedInUser = useSelector((state) => state.auth.user);
    const search = useSelector((state) => state.auth.search);
    const [users, setUser] = useState(loggedInUser)
    const [loadingUser, setLoadingUser] = useState(true);
    const [posts, setPosts] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [updateUI, setUpdateUI] = useState(false)

    useEffect(() => {
        if (search === '') {
            setUpdateUI((prev) => !prev)
        }
        setPosts(posts.filter((post) => post.content.toLowerCase().includes(search.toLowerCase())))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])
    useEffect(() => {
        if (userId) {
            axiosInstance.get(`${UserBaseURL}/userDetail/${userId}`)
                .then((res) => {
                    console.log(res)
                    setUser(res.data.user)
                })
                .catch((error) => {
                    console.log("user error details", error)

                    if (error.response && error.response.data && error.response.data.message) {
                        const errorMessage = error.response.data.message;
                        toast.error(errorMessage);
                    } else {
                        toast.error('An error occurred while user fetch details.');
                    }
                });
        }
        axiosInstance.get(`${UserBaseURL}/userProfile/${userId ? userId : users._id}`)
            .then((res) => {
                console.log(res)
                setPosts(res.data.posts)
                setSuggestedUsers(res.data.users?.Followings)
            })
            .catch((error) => {
                console.log("user error fetch posts", error)

                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while user fetch posts.');
                }
            })
            .finally(() => {
                setLoadingUser(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateUI])
    // comment
    const [clickedPostId, setClickedPostId] = useState(null);

    const handleCommentClick = (postId) => {
        setClickedPostId(postId);
    };

    const closeModal = () => {
        setClickedPostId(null);
    };


    //like
    const handleLikeClick = (postId) => {
        axiosInstance.get(`${UserBaseURL}/like/${postId}`)
            .then((res) => {
                console.log(res.data)
                toast.success(res?.data.message)
                setUpdateUI((prevState) => !prevState)
            })
            .catch((error) => {
                console.log("user error clicking like", error)

                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while user clicking like.');
                }
            });
    }
    const renderLikeInfo = (post) => {
        const likeCount = post.likes.length;
        const userLiked = post.likes.includes(userId ? userId : loggedInUser._id);

        if (likeCount === 0) {
            return '';
        }

        if (userLiked) {
            if (likeCount === 1) {
                return ' You liked this post';
            } else {
                return ` You and ${likeCount - 1} others `;
            }
        } else {
            return ` ${likeCount} likes`;
        }
    };

    //savedpost
    const handleSavedClick = (postId) => {
        axiosInstance.get(`${UserBaseURL}/savedpost/${postId}`)
            .then((res) => {
                console.log(res.data)
                toast.success(res?.data.message)
                setUpdateUI((prevState) => !prevState)
            })
            .catch((error) => {
                console.log("user error saved post", error)

                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while user saved post.');
                }
            });
    }
    //post settings
    const [openDropdowns, setOpenDropdowns] = useState({});
    const handleDropdownToggle = (postId) => {
        setOpenDropdowns((prevOpenDropdowns) => ({
            ...prevOpenDropdowns,
            [postId]: !prevOpenDropdowns[postId]
        }));
    };
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdowns({});
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);


    //deleteMODAL
    const [deleteModal, setDeleteModal] = useState(false)
    const [deletePostId, setDeletePostId] = useState(null)

    const showDeleteModal = (postId) => {
        setDeletePostId(postId)
        setDeleteModal(true)
    }

    const deleteModalConfirm = () => {
        setDeleteModal(false)
        axiosInstance.delete(`${UserBaseURL}/deletePost/${deletePostId}`)
            .then((res) => {
                console.log(res, "delete post res")
                if (res.data.success) {
                    setUpdateUI((prev) => !prev);
                    toast.success(res.data.message);
                }
            })
            .catch((error) => {
                console.log("user error delete post", error)

                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while user delete post.');
                }
            });
    }

    const deleteModalCancel = () => {
        setDeleteModal(false)
    }

    //reportMODAL
    const [reportModal, setReportModal] = useState(false)
    const [reportPostId, setReportPostId] = useState(null)
    const showReportModal = (postId) => {
        setReportPostId(postId)
        setReportModal(true)
    }
    const reportModalCancel = () => {
        setReportModal(false)
    }

    const reportOptions = [
        { label: 'Inappropriate content', value: 'inappropriate' },
        { label: 'Spam', value: 'spam' },
        { label: 'Hate speech', value: 'hate_speech' },
        // Add more report options as needed
    ];

    const [selectedOpt, setSelecetedOpt] = useState(null)
    const selectedReason = (reason) => {
        setSelecetedOpt(reason)
    }

    const reportModalConfirm = () => {
        setReportModal(false)
        axiosInstance.put(`${UserBaseURL}/reportPost`, { postId: reportPostId, reason: selectedOpt })
            .then((res) => {
                console.log(res, "report post res")
                if (res.data.success) {
                    setUpdateUI((prev) => !prev);
                    toast.success(res.data.message);
                }
            })
            .catch((error) => {
                console.log("user error report post", error)

                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while user report post.');
                }
            });
    }

    //edit modal
    const [editModal, setEditModal] = useState(false)
    const [editPostId, setEditPostId] = useState(null)
    const [editPostContent, setEditPostContent] = useState('')
    const showEditModal = (postId, content) => {
        setEditPostId(postId)
        setEditPostContent(content)
        setEditModal(true)
    }
    const editModalCancel = () => {
        setEditModal(false)
    }

    //share
    const [showShareModal, setShowShareModal] = useState(false);
    const [sharePostId, setSharePostId] = useState(null)
    const toggleModal = (postId) => {
        setShowShareModal(true);
        setSharePostId(postId)
    };
    const closeShareModal = () => {
        setShowShareModal(false)
    }

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

    const handleGoToUser = (userId) => {
        nav(`/profile/${userId}`)
    }

    return (
        <>
            {
                loadingUser ? (
                    <Spinner />
                ) : (
                    <div className=" grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 ml-10 mr-10">
                        <div className=" !col-span-1 ">
                            <div className="sticky top-28">

                                {/* User Info */}
                                <Card>
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className='flex'>

                                                <img className="w-12 h-12 rounded-full mr-4" src={users?.ProfilePic} alt="User Avatar" />
                                                <div>
                                                    <h2 className="text-xl font-bold">{users?.Name}</h2>
                                                    <p className="text-gray-600">@{users?.UserName}</p>
                                                </div>
                                            </div>
                                            {
                                                loggedInUser.UserName === users.UserName ? (
                                                    <div className="flex items-center ">
                                                        <span className="text-gray-600 hover:text-blue-500 cursor-pointer" onClick={() => nav('/settings')}>
                                                            <FaCog />
                                                        </span>
                                                    </div>
                                                )
                                                    :
                                                    (
                                                        users?.Followers.includes(loggedInUser?._id || userId) ? (
                                                            <UnFollowBTN friendId={users?._id} setUpdateUI={setUpdateUI} />
                                                        ) : (
                                                            <FollowBTN friendId={users?._id} setUpdateUI={setUpdateUI} />
                                                        )
                                                    )
                                            }
                                        </div>
                                        <p className="mb-4">{users?.Bio}</p>
                                        <hr className="border-gray-300 mb-4" />
                                        <div className="flex items-center mb-2">
                                            <span className="text-gray-600 mr-2">
                                                <BiBriefcase />
                                            </span>
                                            <p className="text-gray-600">{users?.Occupation}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-gray-600 mr-2">
                                                <BiMap />
                                            </span>
                                            <p className="text-gray-600">{users?.Location}</p>
                                        </div>
                                        <div className="flex justify-between mt-4">
                                            <div className='cursor-pointer' onClick={() => nav(`/followers/${users?._id}`)}>
                                                <h3 className="text-lg font-bold">{users?.Followers.length}</h3>
                                                <p className="text-gray-600">Followers</p>
                                            </div>
                                            <div className='cursor-pointer' onClick={() => nav(`/following/${users?._id}`)}>
                                                <h3 className="text-lg font-bold">{users?.Followings.length}</h3>
                                                <p className="text-gray-600">Following</p>
                                            </div>
                                            <div >
                                                <h3 className="text-lg font-bold">{posts.length}</h3>
                                                <p className="text-gray-600">Posts</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                {
                                    loggedInUser._id === users._id ?
                                        <Card extra="mt-4">
                                            <div className="p-4">
                                                <div>
                                                    <h2 className="text-lg font-bold mb-2">My Friend Lists</h2>
                                                    {suggestedUsers.map((friend) => (
                                                        <div key={friend?._id} className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center">
                                                                <img className="w-10 h-10 rounded-full mr-2" src={friend?.ProfilePic} alt="Friend Avatar" />
                                                                <h3 className="text-sm font-bold cursor-pointer" onClick={() => handleGoToUser(friend?._id)}>{friend?.UserName}</h3>
                                                            </div>
                                                            <SiGooglemessages onClick={() => nav('/chat')} className="w-5 h-5 text-blue-500 hover:text-blue-600" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card>
                                        : ''
                                }
                            </div>
                        </div>

                        {/* Create Post and Posts */}
                        <div className=" col-span-1 md:col-span-3 overflow-y-hidden ">
                            {
                                userId ? ""
                                    : <CreatePost setUpdateUI={setUpdateUI} />
                            }
                            {
                                posts.length === 0 ?
                                    <p className='text-xl font-semibold flex justify-center mt-48'>No posts</p>
                                    :
                                    posts.map((post) => (
                                        <Card key={post.id} id={post._id} extra='mb-4'>
                                            <div className="p-4">
                                                <div className="flex relative items-center mb-4">
                                                    <img className="w-10 h-10 rounded-full mr-2" src={post?.userId?.ProfilePic} alt="User Avatar" />
                                                    <div>
                                                        <h3 className="text-sm font-bold">{post?.userId?.UserName}</h3>
                                                        <p className="text-xs text-gray-600">{formatPostDate(post?.createdAt)}</p>
                                                    </div>
                                                    <SlOptionsVertical
                                                        className="absolute right-0 cursor-pointer"
                                                        onClick={() => handleDropdownToggle(post._id)}
                                                    />
                                                    {openDropdowns[post._id] && (
                                                        <div ref={dropdownRef} className="absolute top-10 right-0 bg-white border rounded shadow-xl dark:bg-navy-700">
                                                            {/* Options for the dropdown go here */}
                                                            <ul>
                                                                {
                                                                    post?.userId?.UserName === loggedInUser.UserName ?
                                                                        <>
                                                                            <li onClick={() => showDeleteModal(post._id)} className='flex p-2 text-sm'><MdDeleteForever className='text-red-500 mr-1 ' size={20} /> Delete</li>
                                                                            <li onClick={() => showEditModal(post?._id, post?.content)} className='flex p-2 text-sm'><FaEdit className='text-blue-500 mr-1 ' size={18} /> Edit</li>

                                                                        </>
                                                                        :
                                                                        <li onClick={() => showReportModal(post._id)} className='flex p-2 text-sm'><MdReportProblem className='text-yellow-500 mr-1 ' size={20} /> Report</li>
                                                                }
                                                                {/* Other options related to the current user's post */}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                                                {/* <img className="w-full h-auto rounded-lg mb-4" src="https://via.placeholder.com/800x400" alt="Post Image" /> */}
                                                {/* Conditional rendering based on the file extension */}
                                                {(() => {
                                                    if (post?.fileUrl) {
                                                        const extension = post?.fileUrl.split('.').pop().toLowerCase();
                                                        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                                                            return <img className="w-full h-auto rounded-lg mb-4" src={post?.fileUrl} alt="Post " />;
                                                        } else if (extension === 'mp4') {
                                                            return (
                                                                <video className="w-full h-auto rounded-lg mb-4" controls>
                                                                    <source src={post?.fileUrl} type="video/mp4" />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            );
                                                        } else if (extension === 'mp3') {
                                                            return (
                                                                <audio className="w-full" controls>
                                                                    <source src={post?.fileUrl} type="audio/mp3" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            );
                                                        } else {
                                                            return <p>Unsupported file format</p>;
                                                        }
                                                    }
                                                })()}
                                                <p className="text-sm mb-4">
                                                    {post?.content}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <button onClick={() => handleLikeClick(post._id)} className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                                                            {
                                                                post.likes.includes(loggedInUser?._id)
                                                                    ?
                                                                    <AiFillHeart style={{ fill: 'red' }} />
                                                                    :
                                                                    <BiHeart />
                                                            }
                                                            <span className='ml-1 text-xs'>{renderLikeInfo(post)}</span>
                                                        </button>
                                                        <button onClick={() => handleCommentClick(post._id)} className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                                                            <BiCommentDots />
                                                            {/* <span>Comment</span> */}
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <button onClick={() => handleSavedClick(post._id)} className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
                                                            {
                                                                post.savedBy?.includes(loggedInUser?._id)
                                                                    ?
                                                                    <GoBookmarkFill style={{ fill: 'black' }} />
                                                                    :
                                                                    <GoBookmark />
                                                            }
                                                            {/* <span>Save</span> */}
                                                        </button>
                                                        <button className="flex items-center text-gray-600 hover:text-blue-500" onClick={() => toggleModal(post._id)}>
                                                            <BiSolidShareAlt />
                                                            {/* <span>Share</span> */}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}

                        </div>
                    </div>
                )
            }
            {clickedPostId && (
                <CommentModal postId={clickedPostId} closeModal={closeModal} />
            )}
            {deleteModal && (
                <Modal
                    Heading={"Delete Post"}
                    content={"Are you sure to delete this post ?"}
                    onCancel={deleteModalCancel}
                    onConfirm={deleteModalConfirm}
                />
            )}
            {reportModal && (
                <Modal
                    Heading={"Report Post"}
                    content={
                        <div>
                            {reportOptions.map((option) => (
                                <div key={option.value}>
                                    <label className="text-sm font-thin">
                                        <input
                                            type="radio"
                                            name="reportOption"
                                            value={option.value}
                                            className="mr-1"
                                            onClick={() => selectedReason(option.label)}
                                        />
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    }
                    onCancel={reportModalCancel}
                    onConfirm={reportModalConfirm}
                />
            )}
            {showShareModal && (
                <ShareModal isOpen={showShareModal} onClose={closeShareModal} id={sharePostId} />
            )}
            {
                editModal && (
                    <EditModal onCancel={editModalCancel} setUpdateUI={setUpdateUI} editPostId={editPostId} editPostContent={editPostContent} />
                )
            }
        </>
    );
};

export default Profile;


function EditModal({ onCancel, setUpdateUI, editPostId, editPostContent }) {
    const modalRef = useRef();
    const [editContent, setEditContent] = useState('')
    // eslint-disable-next-line no-unused-vars
    const { user } = useSelector((state) => state.auth)

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onCancel();
        }
    };

    useEffect(() => {
        setEditContent(editPostContent)
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeContent = () => {
        axiosInstance.post(`${UserBaseURL}/editPost`, { postId: editPostId, content: editContent })
            .then(() => {
                toast.success("Post Edited success")
                setUpdateUI((prev) => !prev)
                onCancel()
            })
            .catch((error) => {
                console.log("user error edit post", error)

                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while user edit post.');
                }
            });
    }
    const autoSizeTextarea = (e) => {
        e.target.rows = Math.min(6, e.target.scrollHeight / 20); // You can adjust the row height as needed
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-40 dark:text-white">
            <div ref={modalRef} className="bg-white rounded-lg p-4 pt-2 dark:bg-navy-700">
                <div className="flex justify-between items-center mb-2 ">
                    <p className="text-xl font-semibold ">Edit post</p>
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
                <label className="text-sm font-thin mb-3">Edit the content of the post : </label> <br />
                <div className="flex justify-center items-center mb-7">
                    <textarea
                        placeholder="New post..."
                        className="flex-grow bg-transparent text-sm font-medium drop-shadow-xl px-4 py-2 outline-none rounded-3xl bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white resize-none"
                        rows={1}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onInput={autoSizeTextarea}
                    />
                    <button
                        onClick={changeContent}
                        className="text-white bg-blue-500 hover:bg-blue-600 rounded-3xl p-2 ml-2"
                    >
                        <BiSolidMessageSquareEdit size={18} />
                    </button>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded-md dark:text-black dark:bg-gray-800"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}