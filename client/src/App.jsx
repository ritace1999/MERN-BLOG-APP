import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";
import "./App.css";
import { BlogDetailsPage } from "./pages/blogDetails/BlogDetailsPage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Password from "./pages/password/Password";
import ResetPasswordForm from "./pages/reset/Reset";
import OTPPage from "./pages/otp/OTPPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import Comments from "./pages/dashboard/screens/comment/Comments";
import Admin from "./pages/dashboard/screens/Admin";
import ManagePost from "./pages/dashboard/screens/posts/ManagePost";
import EditPost from "./pages/dashboard/screens/posts/EditPost";
import Category from "./pages/dashboard/screens/categories/Category";
import ArticlesPage from "./pages/home/articles/ArticlesPage";
import Users from "./pages/dashboard/screens/users/Users";
import AboutUs from "./pages/aboutUs/AboutUs";
import ContactUs from "./pages/contactUs/ContactUs";

function App() {
  return (
    <div className=" font-opensans ">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/blog/:slug" element={<BlogDetailsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Admin />} />
          <Route path="users" element={<Users />} />
          <Route path="comments" element={<Comments />} />
          <Route path="posts/categories" element={<Category />} />
          <Route path="posts/manage" element={<ManagePost />} />
          <Route path="posts/manage/edit/:slug" element={<EditPost />} />
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
