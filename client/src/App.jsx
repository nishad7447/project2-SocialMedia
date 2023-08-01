import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import ForgotPass from "./pages/ForgotPass/ForgotPass";
import Protected from "./pages/Protected";
import Home from "./pages/Home/Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailNewPass from "./pages/ForgotPass/EmailNewPass";
import SavedPosts from "./pages/SavedPosts/SavedPosts";
import Followers from "./pages/Followers/Followers";
import Following from "./pages/Following/Following";
import ErrPage from "./pages/ErrPage/ErrPage";


const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/forgot-pass" element={<ForgotPass/>}/>
        <Route path="/password-reset/:userId/:token" Component={EmailNewPass} />
        <Route path="/" element={<Protected><Home/></Protected>} />
        <Route path="/savedposts" element={<Protected><SavedPosts/></Protected>} />
        <Route path="/followers" element={<Protected><Followers/></Protected>} />
        <Route path="/following" element={<Protected><Following/></Protected>} />

        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/404" element={<Protected><ErrPage/></Protected>}/>
      </Routes>
    </Router>
    <ToastContainer className="dark:bg-gray-800" autoClose={3000}/>
    </>
  );
};

export default App;
