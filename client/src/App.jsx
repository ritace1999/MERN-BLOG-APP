import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import "./App.css";
import { BlogDetailsPage } from "./pages/blogDetails/BlogDetailsPage";

function App() {
  return (
    <div className=" font-opensans ">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/blog/:id" element={<BlogDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
