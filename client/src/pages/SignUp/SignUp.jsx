import InputField from "../../componets/IniputField/InputField";
import { GoogleLogin } from "react-google-login";
import Card from "../../componets/Card/Card";
import FixedPlugin from "../../componets/FixedPlugin/FixedPlugin";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UserBaseURL } from "../../API"

export default function SignUp() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')


    const [emailErr, setEmailErr] = useState('')
    const [passErr, setPassErr] = useState('')
    const [usernameErr, setUsernameErr] = useState('')
    const [formErr, setFormErr] = useState('');

    const nav = useNavigate()


    const validateEmail = (email) => {
        // Use a regular expression for email validation
        // eslint-disable-next-line no-useless-escape
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    };

    const validatePasswordStrength = (password) => {
        // Check password strength, requiring a minimum length of 3 characters
        return password.length >= 3;
    };

    useEffect(() => {
        if (localStorage.getItem('jwtToken')) {
          nav('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      
    const userSignup = () => {


        // Check if any field is empty
        if (!email || !password || !name || !username) {
            setFormErr('Please fill in all fields');
            return;
        }
        // Validate email format
        if (!validateEmail(email)) {
            setEmailErr('Invalid email address');
            return;
        }
        // Validate password strength
        if (!validatePasswordStrength(password)) {
            setPassErr('Password must be at least 3 char');
            return;
        }

        axios.post(`${UserBaseURL}/auth/signup`, { Email: email, Password: password, Name: name, UserName: username })
            .then((res) => {
                console.log(res.data.message)

                if (res.data.message === "User signed up successfully") {
                    console.log('succ')
                    nav('/')
                }
            })
            .catch((err) => {
                console.log(err.response.data.message)
                if (err?.response.data.message === "User already Exist") {
                    setEmailErr(err.response.data.message)
                } else if (err?.response.data.message === "User name taken") {
                    setUsernameErr(err.response.data.message)
                }
                // console.log(err,'login post error ')
            })
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            setEmailErr('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [emailErr]);

    useEffect(() => {
        const timer = setTimeout(() => {
          setPassErr('');
        }, 3000);
        return () => clearTimeout(timer);
      }, [passErr]);    

    useEffect(() => {
        const timer = setTimeout(() => {
            setUsernameErr('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [usernameErr]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFormErr('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [formErr]);

    const handleGoogleSignup = (response) => {
        const { tokenId } = response;

        // Send the token ID to your backend server
        axios
            .post("/api/google/signup", { tokenId }) // Adjust the API endpoint as per your server setup
            .then((res) => {
                // Handle the response from your server
                // eslint-disable-next-line no-unused-vars
                const { success, message } = res.data;
                if (success) {
                    // User sign-up was successful
                    // Redirect to the appropriate page or perform any necessary actions
                    // ...
                } else {
                    // User sign-up failed
                    // Display an error message or perform any necessary actions
                    // ...
                }
            })
            .catch((error) => {
                // Handle any errors that occur during the request
                // Display an error message or perform any necessary actions
                // ...
            });
    };



    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="fixed top-[30px] left-[35px] items-center mb-4">
                <h1 className="text-4xl font-black text-blue-500">OnlyFriends</h1>
            </div>
            <FixedPlugin />
            <Card extra="flex-row items-center rounded-xl shadow-lg bg-white dark:bg-gray-900">
                <div className="p-8">
                    <h4 className="mb-2.5 text-4xl font-bold text-gray-900 dark:text-white">
                        Sign Up
                    </h4>
                    <p className="mb-9 ml-1 text-base text-gray-600 dark:text-gray-400">
                        Welcome to OnlyFriends family
                    </p>

                    <GoogleLogin
                        className=" mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:cursor-pointer"
                        clientId="YOUR_GOOGLE_CLIENT_ID"
                        buttonText="Sign up with Google"
                        onSuccess={handleGoogleSignup}
                        onFailure={handleGoogleSignup} // Handle failure cases if needed
                        cookiePolicy="single_host_origin"
                    />

                    <div className="mb-6 flex items-center gap-3">
                        <div className="h-px w-full bg-gray-300 dark:bg-gray-600" />
                        <p className="text-base text-gray-600 dark:text-gray-400">or</p>
                        <div className="h-px w-full bg-gray-300 dark:bg-gray-600" />
                    </div>

                    <div className="flex space-x-1">


                        {/* Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Name *"
                            placeholder="Full Name"
                            id="Name"
                            type="text"
                            state={formErr ? "error" : ""}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* UserName */}
                        <InputField
                            variant="auth"
                            extra="mb-3"
                            label="Username *"
                            placeholder="name_134"
                            id="email"
                            type="text"
                            state={usernameErr || formErr ? "error" : ""}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>


                    {/* Email */}
                    <InputField
                        variant="auth"
                        extra="mb-3"
                        label="Email *"
                        placeholder="mail@simmmple.com"
                        id="email"
                        type="text"
                        state={emailErr || formErr ? "error" : ""}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password */}
                    <InputField
                        variant="auth"
                        extra="mb-3"
                        label="Password *"
                        placeholder="Min. 3 characters"
                        id="password"
                        type="password"
                        state={passErr || formErr ? "error" : ""}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="text-red-500">
                        {formErr || emailErr || usernameErr || passErr}
                    </span>
                    <button
                        onClick={userSignup}
                        className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700">
                        Sign Up
                    </button>
                    <div className="mt-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Already user?
                        </span>
                        <Link
                            to="/signin"
                            className="ml-1 text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-white"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}
