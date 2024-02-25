import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "animate.css";

const Admin = () => {
  const userState = useSelector((state) => state.user);
  const avatar = userState.userInfo.avatar;
  const imageUrl = avatar ? `http://localhost:4000/uploads/${avatar}` : "";
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const currentDate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentDay = currentDate.getDate();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="h-full animate__animated animate__fadeIn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 rounded-md">
      <div className="text-center m-auto">
        {avatar && (
          <img
            src={imageUrl}
            alt="User Avatar"
            className="avatar animate__animated animate__bounceIn rounded-lg"
            style={{ width: "400px", height: "400px" }}
          />
        )}
        <h2 className="text-4xl font-bold text-white animate__animated animate__slideInDown my-2">
          Welcome,{" "}
          <span className="animate-pulse text-4xl mx-2">
            {userState.userInfo.name}!
          </span>
        </h2>
        <p className="text-2xl font-bold text-white animate__animated animate__fadeIn my-2">
          Today is {currentMonth} {currentDay}, {currentYear}
        </p>
        <p className="text-2xl font-bold text-white animate__animated animate__fadeIn my-2">
          Time: {currentTime}
        </p>
      </div>
    </div>
  );
};

export default Admin;
