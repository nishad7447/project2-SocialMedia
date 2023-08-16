import React, { useState } from 'react';
import { BiUpload, BiDoorOpen } from 'react-icons/bi';
import InputField from '../../components/IniputField/InputField';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../axios';
import { UserBaseURL } from '../../API';
import { setLogin } from '../../redux/slice';
import Modal from '../../components/Modal/Modal';

const ProfileSettings = () => {
    const { user } = useSelector((state) => state.auth)
    const [name, setName] = useState(user.Name);
    const [email, setEmail] = useState(user.Email);
    const [bio, setBio] = useState(user?.Bio || '');
    const [location, setLocation] = useState(user?.Location || '');
    const [occupation, setOccupation] = useState(user?.Occupation || '');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState(user?.ProfilePic);
    const [attachedImage, setAttachedImage] = useState(null)
    const dispatch = useDispatch()
    const isEmailValid = (email) => {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSaveProfile = () => {
        if (!name.trim() || !email.trim() || !location.trim() || !occupation.trim() || !bio.trim()) {
            toast.error('All fields are required.');
            return;
        }
        if (email && !isEmailValid(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Email', email);
        formData.append('Bio', bio);
        formData.append('Location', location);
        formData.append('Occupation', occupation);
        if (attachedImage) {
            formData.append('file', attachedImage)
        }
        axiosInstance.put(`${UserBaseURL}/editUser`, formData)
            .then((res) => {
                if (res.data.success) {
                    dispatch(setLogin({ user: res.data.user }))
                    toast.success(res.data.message)

                }
            })
            .catch((error) => {
                console.log("error editing user", error)
                console.log("error editing user password", error)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while saving security settings.');
                }
            })
    };

    const validatePasswordStrength = (password) => {
        // Check password strength, requiring a minimum length of 3 characters
        return password.length >= 3;
    };

    const handleSaveSecurity = () => {
        passwordChangeModalCancel()
        if (!validatePasswordStrength(newPassword)) {
            toast.error("Password must be at least 3 char");
            return;
        }
        axiosInstance.put(`${UserBaseURL}/editUserPass`, { CurrentPass: password, NewPass: newPassword })
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message)
                }
            })
            .catch((error) => {
                console.log("error editing user password", error)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while saving security settings.');
                }
            })
    };

    const handleDeactivateAccount = () => {
        axiosInstance.put(`${UserBaseURL}/deactivateUserAcc`)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message)
                }
            })
            .catch((error) => {
                console.log("error acc deactivate", error)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                } else {
                    toast.error('An error occurred while deactivating account.');
                }
            })
    };

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


    //deActivateMODAL
    const [deActivateModal, setDeActivateModal] = useState(false)
    const deActivateModalCancel = () => {
        setDeActivateModal(false)
    }

    //passwordChangeMODAL
    const [passwordChangeModal, setPasswordChangeModal] = useState(false)
    const passwordChangeModalCancel = () => {
        setPasswordChangeModal(false)
    }


    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white dark:bg-navy-800 border rounded-lg shadow">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-4 dark:text-white">Profile Information</h1>
                <button
                    className="text-red-500 hover:text-red-600 justify-end"
                    onClick={() => setDeActivateModal(true)}
                >
                    <div className="flex">
                        Deactivate <BiDoorOpen className="w-6 h-6" />
                    </div>
                </button>
            </div>
            <div className="relative mb-8">
                <div className="h-32 rounded-t-lg bg-blue-500 dark:bg-gray-800 overflow-hidden">
                    <div className="h-32 rounded-t-lg overflow-hidden">
                        <img src='https://images.pexels.com/photos/3418400/pexels-photo-3418400.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt="Cover " className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex justify-between absolute top-16 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                        <img src={selectedImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
            <div className="mb-6 flex flex-col items-center">
                <label htmlFor="profile-image" className="block text-center cursor-pointer text-blue-500">
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

            <div className="grid md:grid-cols-3 gap-6 mb-6">
                <InputField
                    variant="auth"
                    extra="mb-3"
                    label="Name"
                    placeholder="Full Name"
                    id="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <InputField
                    variant="auth"
                    extra="mb-3"
                    label="Email"
                    placeholder="Email Address"
                    id="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <InputField
                    variant="auth"
                    extra="mb-3"
                    label="Location"
                    placeholder="Your Location"
                    id="Location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

            </div>

            <InputField
                variant="auth"
                extra="mb-3"
                label="Bio"
                placeholder="Tell us about yourself"
                id="Bio"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />

            <InputField
                variant="auth"
                extra="mb-3"
                label="Occupation"
                placeholder="Your Occupation"
                id="Occupation"
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
            />

            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSaveProfile}
            >
                Save Profile Information
            </button>

            <hr className="my-6 border-t border-gray-300 dark:border-gray-600" />

            <h2 className="text-lg font-bold mb-2 dark:text-white">Change Password</h2>
            <InputField
                variant="auth"
                extra="mb-3"
                label="Current Password"
                placeholder="Current Password"
                id="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <InputField
                variant="auth"
                extra="mb-3"
                label="New Password"
                placeholder="New Password"
                id="NewPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={()=>setPasswordChangeModal(true)}
            >
                Save Security Settings
            </button>
            {deActivateModal && (
                <Modal
                    Heading={"Deactivate Account"}
                    content={"Are you sure to Deactivate Your Account ?"}
                    onCancel={deActivateModalCancel}
                    onConfirm={handleDeactivateAccount}
                />
            )}
            {passwordChangeModal && (
                <Modal
                    Heading={"Confirmation"}
                    content={"Are you sure to Change Password?"}
                    onCancel={passwordChangeModalCancel}
                    onConfirm={handleSaveSecurity}
                />
            )}
        </div>
    );
};

export default ProfileSettings;
