import InputField from "../../componets/IniputField/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "../../componets/Checkbox/Checkbox";
import Card from "../../componets/Card/Card";
import FixedPlugin from "../../componets/FixedPlugin/FixedPlugin";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserBaseURL } from "../../API";
import axios from "axios";

export default function SignIn() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [passErr, setPassErr] = useState('')
  const nav = useNavigate()
  const userLogin = () => {
    axios.post(`${UserBaseURL}/auth/login`, { Email: email, Password: password })
      .then((res) => {
        console.log(res.data.message)

        if (res.data.success) {
          nav('/home')
        }
      })
      .catch((err) => {
        console.log(err.response.data.message)
        if (err?.response.data.message === "User does not exist") {
          setEmailErr(err.response.data.message)
        } else if (err?.response.data.message === "Incorrect credentials") {
          setPassErr(err.response.data.message)
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

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="fixed top-[30px] left-[35px] items-center mb-4">
        <h1 className="text-4xl font-black text-blue-500">OnlyFriends</h1>
      </div>
      <FixedPlugin />
      <Card extra="flex-row items-center rounded-xl shadow-lg bg-white dark:bg-gray-900">
        <div className="p-8">
          <h4 className="mb-2.5 text-4xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
          <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:cursor-pointer">
            <div className="rounded-full text-xl">
              <FcGoogle />
            </div>
            <h5 className="text-sm font-medium text-gray-900 dark:text-white">
              Sign In with Google
            </h5>
          </div>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-full bg-gray-300 dark:bg-gray-600" />
            <p className="text-base text-gray-600 dark:text-gray-400">or</p>
            <div className="h-px w-full bg-gray-300 dark:bg-gray-600" />
          </div>
          {/* Email */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="text"
            state={emailErr ? "error" : ""}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            state={passErr ? "error" : ""}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Checkbox */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                Keep me logged In
              </p>
            </div>
            <Link
              className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-white"
              to="/forgot-pass"
            >
              Forgot Password?
            </Link>
          </div>
          <span className="text-red-500">
            {
              emailErr ? emailErr : passErr
            }
          </span>
          <button
            onClick={userLogin}
            className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700">
            Sign In
          </button>
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Not registered yet?
            </span>
            <Link
              to="/signup"
              className="ml-1 text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-white"
            >

              Create an account
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
