import InputField from "../../components/IniputField/InputField";
import Card from "../../components/Card/Card";
import FixedPlugin from "../../components/FixedPlugin/FixedPlugin";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserBaseURL } from "../../API";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPass() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRePassword] = useState('')
  const [otp, setOTP] = useState('')

  const [ShowOtpField, setShowOtpField] = useState(false)
  const [ShowPassFields, setShowPassFields] = useState(false)

  const [otpErr, setOtpErr] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [passErr, setPassErr] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('jwtToken')) {
      nav('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOTP = () => {
    axios.post(`${UserBaseURL}/auth/forgot-otpSend`, { Email: email })
      .then((res) => {
        console.log(res.data.message)
        if(res.data.message!=='password reset link sent to your email account' && res.data.message!=='password reset link Already sent to your email account'){                                                                                                                                                                                                                                                                                                                                                                                                     
          setShowOtpField(true)
          toast.success('OTP send to mobile')
        }else{
          toast.success(res.data.message);
        }
      }).catch((err) => {
        console.log(err?.response.data.message)
        toast.error(err?.response.data.message)
        if (err?.response.data.message === "User does not exist") {
          setEmailErr(err?.response.data.message)
        }else if (err?.response.data.message === "User dont have a mobile number"){
          setEmailErr(err?.response.data.message)
        }
      })
  }
  const submitOTP = () => {
    axios.post(`${UserBaseURL}/auth/forgot-otpSubmit`, { OTP: otp, Email: email })
      .then((res) => {
        console.log(res.data.message)
        if (res.data.message === 'Verification success') {
          toast.success(res.data.message)
          setShowOtpField(false)
          setShowPassFields(true)
        }
      }).catch((err) => {
        console.log(err?.response.data.message, 'catch err')
        if (err?.response.data.message === "Verification failed") {
          toast.error(err?.response.data.message)
          setOtpErr("Invalid OTP")
        }
      })
  }
  const userForgotPass = () => {
    if (password !== repassword) {
      return setPassErr("Passwords don't match ")
    } else {
      setRePassword('')
    }
    axios.post(`${UserBaseURL}/auth/forgot-pass`, { Email: email, Password: password })
      .then((res) => {
        console.log(res.data.message)

        if (res.data.message === "Reset Password Success") {
          toast.success(res.data.message)
          nav('/signin')
        }
      })
      .catch((err) => {
        console.log(err?.response.data.message)
        toast.error(err?.response.data.message)
        if (err?.response.data.message === "User does not exist") {
          setEmailErr(err.response.data.message)
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
      setOtpErr('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [otpErr]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="fixed top-[30px] left-[35px] items-center mb-4">
        <h1 className="text-4xl font-black text-blue-500">OnlyFriends</h1>
      </div>
      <FixedPlugin />
      <Card extra="flex-row items-center rounded-xl shadow-lg bg-white dark:bg-gray-900">
        <div className="p-8">
          <h4 className="mb-2.5 text-4xl font-bold text-gray-900 dark:text-white">
            Forgot Password
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600 dark:text-gray-400">
            Set new password with your email!
          </p>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-full bg-gray-300 dark:bg-gray-600" />
            <p className="text-base text-gray-600 dark:text-gray-400"></p>
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

          {ShowOtpField && (
            <>
              {/* OTP */}
              <InputField
                variant="auth"
                extra="mb-3"
                label="Enter OTP*"
                placeholder="1234"
                id="otp"
                type="text"
                state={otpErr ? "error" : ""}
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
              />
            </>
          )}

          {ShowPassFields && (
            <div className="flex space-x-1">
              {/* Password */}
              <InputField
                variant="auth"
                extra="mb-3"
                label="New Password *"
                placeholder="New Password"
                id="Password"
                type="password"
                state={passErr ? "error" : ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Confirm Password */}
              <InputField
                variant="auth"
                extra="mb-3"
                label="Re-Password *"
                placeholder="Re-Password"
                id="RePassword"
                type="password"
                state={passErr ? "error" : ""}
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
            </div>
          )}


          <span className="text-red-500">
            {
              emailErr || passErr || otpErr
            }
          </span>

          {
            ShowPassFields ? (
              <button onClick={userForgotPass} className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700">
                Reset Password
              </button>
            ) : ShowOtpField ? (
              <button onClick={submitOTP} className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700">
                Submit OTP
              </button>
            ) : (
              <button onClick={sendOTP} className="linear mt-2 w-full rounded-xl bg-blue-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700">
                Send Link
              </button>
            )
          }

        </div>
      </Card>
    </div>
  );
}
