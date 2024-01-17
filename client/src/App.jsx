import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";
import "./App.css";
import { BlogDetailsPage } from "./pages/blogDetails/BlogDetailsPage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Articles } from "./pages/home/container/Articles";
import Password from "./pages/password/Password";
import ResetPasswordForm from "./pages/reset/Reset";
import OTPPage from "./pages/otp/OTPPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import Comments from "./pages/dashboard/screens/comment/Comments";
import Admin from "./pages/dashboard/screens/Admin";
import CreatePost from "./pages/dashboard/screens/posts/CreatePost";
import ManagePost from "./pages/dashboard/screens/posts/ManagePost";

function App() {
  return (
    <div className=" font-opensans ">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="articles" element={<Articles />} />
        <Route path="/blog/:slug" element={<BlogDetailsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Admin />} />
          <Route path="comments" element={<Comments />} />
          <Route path="posts/new" element={<CreatePost />} />
          <Route path="posts/manage" element={<ManagePost />} />
        </Route>
        <Route path="/password" element={<Password />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/otp" element={<OTPPage />} />
      </Routes>
      <Toaster
        position="bottom-right-corner"
        reverseOrder={false}
        toastOptions={{ style: { background: "#183B56", color: "white" } }}
      />
    </div>
  );
}

export default App;
