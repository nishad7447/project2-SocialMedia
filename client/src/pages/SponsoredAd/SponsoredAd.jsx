import React, { useState } from 'react';
import { BiUpload } from 'react-icons/bi';
import InputField from '../../components/IniputField/InputField';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SponsoredAd = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [attachedImage, setAttachedImage] = useState(null)
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [selectedDate, setSelectedDate] = useState('');
  const amountPerDayInRupees = 100; // Amount in rupees per day
  const {user} = useSelector((state)=>state.auth)
  const nav=useNavigate()
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      if (allowedImageExtensions.includes(fileExtension)) {
        setSelectedImage(URL.createObjectURL(file));
        setAttachedImage(file);
      } else {
        toast.error('Invalid image format. Please select a valid image file.');
      }
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const calculateTotalAmount = () => {
    if (selectedDate) {
      const selectedDay = Number(selectedDate);
      return selectedDay * amountPerDayInRupees;
    }
    return 0;
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    })
  }

  const displayRazorpay = async () => {
    if (!name.trim() || !link.trim() || !description.trim() || !attachedImage) {
      toast.error('All fields are required.');
      return;
    }

    // script
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      toast.error('Razorpay failed to load');
      return;
    }

    const result = await axiosInstance.post(`${UserBaseURL}/createOrder`, { amount: calculateTotalAmount() });

    if (!result) {
      toast.error("Server error")
      return;
    }

    console.log(result.data, "order data")
    const { amount, id: order_id, currency } = result.data;

    const options = {
      // key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: currency,
      name: 'OnlyFriends',
      description: 'Socail Media',
      order_id: order_id,
      handler: async function (response) {
        
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Link', link);
        formData.append('Description', description);
        formData.append('Amount',calculateTotalAmount())
        formData.append('ExpiresWithIn',Number(selectedDate))
        formData.append('orderCreationId',order_id)
        formData.append('userId',user._id)
        formData.append('razorpayPaymentId',response.razorpay_payment_id)
        formData.append('razorpayOrderId',response.razorpay_order_id)
        formData.append('razorpaySignature',response.razorpay_signature)
        if (attachedImage) {
          formData.append('file', attachedImage)
        }
        axiosInstance.post(`${UserBaseURL}/createAd`, formData)
          .then((res) => {
            if (res.data.success) {
              toast.success(res.data.message)
              nav('/')
            }
          })
          .catch((error) => {
            console.log(" user create ad", error)

            if (error.response && error.response.data && error.response.data.message) {
              const errorMessage = error.response.data.message;
              toast.error(errorMessage);
            } else {
              toast.error('An error occurred while create Ad.');
            }
          })

      },

      prefill: {
        name: 'ONLY-friends',
        email: 'onlyfriends.dev@gmail.com',
      },

      notes: {
        address: 'Example Corporate Office',
      },

      theme: {
        color: '#87CEEB'
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white dark:bg-navy-800 border rounded-lg shadow">
      <h2 className="text-lg font-bold mb-2 dark:text-white">
        Sponsored Ad Creation
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column - Ad Image */}
        <div className="w-full mb-3">
          <div className="relative">
            <img
              src={selectedImage || 'https://via.placeholder.com/800x400'}
              alt="Ad"
              className="w-full h-44 rounded-lg object-cover"
            />
          </div>
          <div className="text-center mt-2">
            <div className="mb-6 flex flex-col items-center">
              <label
                htmlFor="profile-image"
                className="block text-center cursor-pointer text-blue-500"
              >
                <BiUpload className="w-6 h-6 mx-auto" /> Upload New Image
              </label>
              <input
                id="profile-image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        {/* Right column - Sponsored Ad Creation */}
        <div className="rounded-lg mb-6">
          <div className="mb-3">
            {/* Select Date */}
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Select Date (up to 10 days)
            </label>
            <select
              value={selectedDate}
              onChange={handleDateChange}
              className="mt-1 block w-full px-4 py-2 rounded-md drop-shadow-md border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-200 bg-white dark:bg-navy-800 dark:text-white dark:border-white"
            >
              <option value="">Select a date</option>
              {/* Generate options for up to 10 days */}
              {[...Array(10)].map((_, index) => (
                <option key={index} value={`${index + 1}`}>
                  {index + 1} day
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            {/* Sponsor Name */}
            <InputField
              variant="auth"
              label="Sponsor Name"
              placeholder="Enter Sponsor Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            {/* Link */}
            <InputField
              variant="auth"
              label="Link (without www.)"
              placeholder="Enter Link"
              type="textarea"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="mb-3">
            {/* Description */}
            <InputField
              variant="auth"
              label="Description"
              placeholder="Enter Description"
              type="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <p className="text-sm text-gray-700 dark:text-white">
              Generated Amount:{' '}
              <span className="p-4 text-lg font-bold">
                ₹{calculateTotalAmount()}
              </span>
            </p>
          </div>
          <button
            onClick={displayRazorpay}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Pay and Post
          </button>
        </div>
      </div>

    </div>
  );
};

export default SponsoredAd;
