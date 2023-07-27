import InputField from "../../componets/IniputField/InputField";
import { GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import Card from "../../componets/Card/Card";
import FixedPlugin from "../../componets/FixedPlugin/FixedPlugin";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserBaseURL } from "../../API";
// import { axiosInstance } from "../../axios";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [mobErr, setMobErr] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [formErr, setFormErr] = useState("");

  const nav = useNavigate();

  const validateEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };
  const validateMobile = (mobile) => {
    // Use a regular expression for mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validatePasswordStrength = (password) => {
    // Check password strength, requiring a minimum length of 3 characters
    return password.length >= 3;
  };

  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      nav("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userSignup = () => {
    // Check if any field is empty
    if (!email || !password || !name || !username) {
      setFormErr("Please fill in all fields");
      return;
    }
    // Validate email format
    if (!validateEmail(email)) {
      setEmailErr("Invalid email address");
      return;
    }
    if (!validateMobile(mobile)) {
      setMobErr("Invalid Mobile");
      return;
    }
    // Validate password strength
    if (!validatePasswordStrength(password)) {
      setPassErr("Password must be at least 3 char");
      return;
    }

    axios
      .post(`${UserBaseURL}/auth/signup`, {
        Email: email,
        Password: password,
        Name: name,
        UserName: username,
        Mobile: mobile,
      })
      .then((res) => {
        console.log(res.data.message);

        if (res.data.message === "User signed up successfully") {
          console.log("succ");
          nav("/");
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        if (err?.response.data.message === "User already Exist") {
          setEmailErr(err.response.data.message);
        } else if (err?.response.data.message === "User name taken") {
          setUsernameErr(err.response.data.message);
        } else if (err?.response.data.message === "Mobile already Exist") {
          setMobErr(err.response.data.message);
        }
        // console.log(err,'login post error ')
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailErr("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [emailErr]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPassErr("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [passErr]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsernameErr("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [usernameErr]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormErr("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [formErr]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMobErr("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [mobErr]);

  return (
    <GoogleOAuthProvider clientId="969952852580-q77urroi4f3chu5hlua9nqpvq6vl1gje.apps.googleusercontent.com">
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
           <div className="flex w-full justify-center items-center">
           <GoogleLogin 
              onSuccess={credentialResponse => {
                axios.post(`${UserBaseURL}/auth/googleSignUp`, credentialResponse).then((res)=> {
                  console.log(res,"loged in");
                  nav('/signin')
                  
                }).catch((err)=> {
                 if(err?.message==='Request failed with status code 400'){
                        setEmailErr("User already exist")
                 }else{
                    setEmailErr(err?.message)
                 }
                })

              }}
              onError={() => {
                console.log('');
                setEmailErr("Login Failed")
              }}
              type='standard'
              size='large'
              text='continue_with'
              shape='square'
            />       
            </div>  
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

            <div className="flex space-x-1">
              {/* Mob */}
              <InputField
                variant="auth"
                extra="mb-3"
                label="Mobile (+91) *"
                placeholder="mail@simmmple.com"
                id="mobile"
                type="text"
                state={mobErr || formErr ? "error" : ""}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
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
            </div>
            <span className="text-red-500">
              {formErr || emailErr || usernameErr || passErr || mobErr}
            </span>
            <button
              onClick={userSignup}
              className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
            >
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
    </GoogleOAuthProvider>
  );
}
