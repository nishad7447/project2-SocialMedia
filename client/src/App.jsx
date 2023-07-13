import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import ForgotPass from "./pages/ForgotPass/ForgotPass";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="auth/*" element={<AuthLayout />} />
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="rtl/*" element={<RtlLayout />} />
        <Route path="/" element={<Navigate to="/admin" replace />} /> */}
        <Route path="/" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/forgot-pass" element={<ForgotPass/>}/>
      </Routes>
    </Router>
  );
};

export default App;
