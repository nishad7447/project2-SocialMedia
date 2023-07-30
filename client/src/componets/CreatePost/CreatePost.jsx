import React, { useState } from 'react';
import Card from '../Card/Card';
import { BiImage, BiPaperclip, BiSend } from 'react-icons/bi';
import { AiFillAudio } from 'react-icons/ai';
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function CreatePost({setUpdateUI}) {

  const user=useSelector((state)=>state.auth.user)

  const [postText, setPostText] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedVideo, setAttachedVideo] = useState(null);
  const [attachedAudio, setAttachedAudio] = useState(null);
  const [uurl, setUrl] = useState(null);
  const handlePostChange = (e) => {
    setPostText(e.target.value);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(); // Create a new FormData instance

    if (postText) {
      formData.append('postText', postText);
    }

    // if (attachedImage && attachedImage.length > 0) {
    //   const imageDetailsArray = attachedImage.map((image, index) => ({
    //     [`file${index}`]: image,
    //   }));
  
    //   formData.append('file', JSON.stringify(imageDetailsArray));
    // }
    if(attachedImage){
      formData.append('file',attachedImage)
    }

    if (attachedVideo) {
      formData.append('file', attachedVideo);
    }

    if (attachedAudio) {
      formData.append('file', attachedAudio);
    }
    if(user){
      formData.append('userId',user._id)
    }
    console.log('FormData:', formData);
  
    axiosInstance
      .post(`${UserBaseURL}/post`, formData)
      .then((response) => {
        console.log('Response from backend:', response.data);
        setPostText('');
        setAttachedImage(null); 
        setAttachedVideo(null);
        setAttachedAudio(null);
        toast.success(response?.data?.message)
        setUpdateUI((prevState)=> !prevState)
      })
      .catch((error) => {
        toast.error(error?.data?.message)
        console.error('Error sending data to backend:', error);
      });
  };

  // const handleImageChange = (e) => {
  //   const images = [];
  //   for (let i = 0; i < e.target.files.length; i++) {
  //     images.push(e.target.files[i]);
  //   }
  //   setAttachedImage(images);
  // };

  const handleImageChange=(e)=>{
    const image=e.target.files[0]
    setAttachedImage(image)
  }

  const handleVideoChange = (e) => {
    const video = e.target.files[0];
    setAttachedVideo(video);
    console.log(attachedVideo,"atVdio")
  };

  const handleAudioChange = (e) => {
    const audio = e.target.files[0];
    setAttachedAudio(audio);
    setUrl(URL.createObjectURL(audio));
  };

  const autoSizeTextarea = (e) => {
    e.target.rows = Math.min(6, e.target.scrollHeight / 20); // You can adjust the row height as needed
  };

  const renderFilePreview = () => {
    // if (attachedImage && attachedImage.length > 0) {
    //   const centeredImagesCount = (3 - (attachedImage.length % 3)) % 3;
    //   const collageClass =
    //     attachedImage.length <= 2
    //       ? 'flex justify-center'
    //       : `grid grid-cols-3 gap-4 ${centeredImagesCount > 0 ? 'place-items-center' : ''}`;
    //   return (
    //     <div className={` mt-2 ${collageClass}`}>
    //       {attachedImage.map((image, index) => (
    //         <img
    //           key={index}
    //           src={URL.createObjectURL(image)}
    //           alt={`Preview ${index}`}
    //           className="w-full h-full object-cover rounded-3xl"
    //         />
    //       ))}
    //     </div>
    //   );
    if(attachedImage){
      return <img src={URL.createObjectURL(attachedImage)} alt={attachedImage.filename} className="w-3/4 h-1/2 max-h-fit mt-2  rounded-3xl" />
    } else if (attachedVideo) {
      return <video src={URL.createObjectURL(attachedVideo)} controls className="w-4/5 h-2/5 max-h-72 mt-2 " />;
    } else if (attachedAudio) {
      return (
        <audio src={uurl} controls className="w-4/5 mt-2 rounded-3xl">
          Your browser does not support the audio element.
        </audio>
      );
    } else {
      return null;
    }
  };

  return (
    <form onSubmit={handlePostSubmit} encType='multipart/form-data'>
      <Card extra="mb-4">
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full mr-2"
              src={user?.ProfilePic}
              alt="User Avatar"
            />
            <textarea
              placeholder="New post..."
              className="flex-grow bg-transparent text-sm font-medium px-4 py-2 outline-none rounded-3xl bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white resize-none"
              rows={1}
              value={postText}
              onChange={handlePostChange}
              onInput={autoSizeTextarea}
            />
          </div>
          <div className=" flex flex-grow justify-center">{renderFilePreview()}</div>
        </div>
        <div className="flex items-center pl-3 pr-3">
          <hr className="w-full border-gray-300" />
        </div>
        <div className="flex items-center justify-evenly pb-2 pt-2">
          <label htmlFor="image" className="cursor-pointer">
            <BiImage className="w-6 h-6 text-gray-600 hover:text-blue-500" />
            <input
              id="image"
              type="file"
              className="hidden"
              accept="image/*"
              // multiple
              onChange={handleImageChange}
            />
          </label>
          <label htmlFor="video" className="cursor-pointer">
            <BiPaperclip className="w-6 h-6 text-gray-600 hover:text-blue-500 ml-4" />
            <input
              id="video"
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleVideoChange}
            />
          </label>
          <label htmlFor="audio" className="cursor-pointer">
            <AiFillAudio className="w-6 h-6 text-gray-600 hover:text-blue-500 ml-4" />
            <input
              id="audio"
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleAudioChange}
            />
          </label>
          <button
            className="flex items-center text-white bg-blue-500 hover:bg-blue-600 ml-4 px-4 py-2 rounded-full"
            type="submit"
          >
            <BiSend className="w-5 h-5 mr-2" />
            Post
          </button>
        </div>
      </Card>
    </form>
  );
}
