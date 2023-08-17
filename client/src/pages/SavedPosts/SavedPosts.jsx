import React, { useEffect, useState } from 'react';
import Card from '../../components/Card/Card';
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import { AiFillHeart } from 'react-icons/ai';
import { BiCommentDots, BiSolidShareAlt, BiHeart } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';
import { toast } from 'react-toastify';
import CommentModal from '../../components/CommentModal/CommentModal';
import moment from 'moment'


const Spinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
};

function SavedPosts() {
    const user = useSelector((state) => state.auth.user)
    const [loadingUser, setLoadingUser] = useState(true);
    const [savedPosts, setSavedPosts] = useState([])
    const [updateUI, setUpdateUI] = useState(false)
    useEffect(() => {
        axiosInstance.get(`${UserBaseURL}/getAllSavedPosts`)
            .then((res) => {
                setSavedPosts(res.data.savedPosts[0].savedPosts)
                // setSuggestedUsers(res.data.users)
            })
            .catch((error) => {
                console.log("user error fetch allsavedpost", error)

                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while user fetch allsavedpost.');
                }
            })
            .finally(() => {
                setLoadingUser(false); // Set loadingUser to false once the user details are fetched or the API call completes
            });
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
        const userLiked = post.likes.includes(user?._id);

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
        <>
            {
                loadingUser ? (
                    <Spinner />
                ) : (
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mt-5 mb-4 dark:text-white">Saved Posts</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {savedPosts.length > 0 ?
                                savedPosts.map((savedPost) => (
                                    <Card key={savedPost._id} extra="mb-4">
                                        <div className="p-4">
                                            <div className="flex items-center mb-4">
                                                <img className="w-10 h-10 rounded-full mr-2" src={savedPost.postId.userId.ProfilePic} alt="User Avatar" />
                                                <div>
                                                    <h3 className="text-sm font-bold">{savedPost.postId.userId.UserName}</h3>
                                                    <p className="text-xs text-gray-600">{formatPostDate(savedPost?.createdAt)}</p>
                                                </div>
                                            </div>
                                            <h2 className="text-lg font-bold mb-2">{savedPost.postId.title}</h2>
                                            {(() => {
                                                if (savedPost.postId.fileUrl) {
                                                    const extension = savedPost.postId.fileUrl.split('.').pop().toLowerCase();
                                                    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                                                        return <img className="w-auto h-auto rounded-lg mb-4" src={savedPost.postId.fileUrl} alt="Post" />;
                                                    } else if (extension === 'mp4') {
                                                        return (
                                                            <video className="w-auto h-auto rounded-lg mb-4" controls>
                                                                <source src={savedPost.postId.fileUrl} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        );
                                                    } else if (extension === 'mp3') {
                                                        return (
                                                            <audio className="w-full" controls>
                                                                <source src={savedPost.postId.fileUrl} type="audio/mp3" />
                                                                Your browser does not support the audio element.
                                                            </audio>
                                                        );
                                                    } else {
                                                        return <p>Unsupported file format</p>;
                                                    }
                                                }
                                            })()}
                                            <p className="text-sm mb-4">{savedPost.postId.content}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => handleLikeClick(savedPost.postId._id)}
                                                        className="flex items-center text-gray-600 hover:text-blue-500 mr-4"
                                                    >

                                                        {savedPost.postId.likes?.includes(user?._id) ? (
                                                            <AiFillHeart style={{ fill: 'red' }} ></AiFillHeart>
                                                        ) : (
                                                            <BiHeart />
                                                        )}
                                                        <span className="ml-1 text-xs">{renderLikeInfo(savedPost.postId)}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleCommentClick(savedPost.postId._id)}
                                                        className="flex items-center text-gray-600 hover:text-blue-500 mr-4"
                                                    >
                                                        <BiCommentDots />
                                                        {/* <span>Comment</span> */}
                                                    </button>
                                                </div>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => handleSavedClick(savedPost.postId._id)}
                                                        className="flex items-center text-gray-600 hover:text-blue-500 mr-4"
                                                    >
                                                        {savedPost.postId.savedBy?.includes(user?._id) ? (
                                                            <GoBookmarkFill style={{ fill: 'black' }} />
                                                        ) : (
                                                            <GoBookmark />
                                                        )}
                                                        {/* <span>Save</span> */}
                                                    </button>
                                                    <button className="flex items-center text-gray-600 hover:text-blue-500">
                                                        <BiSolidShareAlt />
                                                        {/* <span>Share</span> */}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )) : <h2 className='flex justify-center'>There is notheing in saved posts</h2>
                            }
                        </div>
                    </div>
                )
            }
            {clickedPostId && (
                <CommentModal postId={clickedPostId} closeModal={closeModal} />
            )}
        </>

    );
}

export default SavedPosts;
