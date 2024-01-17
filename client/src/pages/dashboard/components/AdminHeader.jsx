import React, { useEffect, useState } from "react";
import { AiFillDashboard, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { LiaComments } from "react-icons/lia";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/actions/user";
import { MdLogout } from "react-icons/md";

const menuItems = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: <AiFillDashboard className="text-xl" />,
    name: "dashboard",
    type: "link",
  },
  {
    title: "Comments",
    link: "/dashboard/comments",
    icon: <LiaComments className="text-xl" />,
    name: "comments",
    type: "link",
  },
  {
    title: "Posts",
    content: [
      { title: "Create", link: "/dashboard/posts/new" },
      { title: "Manage", link: "/dashboard/posts/manage" },
    ],
    icon: <MdDashboard className="text-xl" />,
    name: "posts",
    type: "collapse",
  },
];

const AdminHeader = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [activeNavName, setActiveNavName] = useState("dashboard");
  const windowSize = useWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuActive((prevState) => !prevState);
  };
  useEffect(() => {
    if (windowSize.width < 1024) {
      setIsMenuActive(false);
    } else {
      setIsMenuActive(true);
    }
  }, [windowSize.width]);
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className=" flex h-fit w-full items-center justify-between p-4 lg:h-full lg:max-w-[300px] lg:flex-col lg:items-start lg:justify-start lg:p-0 ">
      {/* logo */}
      <h2 className=" w-full text-xl font-extrabold lg:bg-dark-hard lg:px-4 lg:pt-4">
        <Link className="w-16 animate-pulse text-blue-800 " to="/">
          BLOG APP
        </Link>
      </h2>

      {/* Menu Icon */}
      <div className="cursor-pointer lg:hidden">
        {isMenuActive ? (
          <AiOutlineClose className="h-6 w-5" onClick={toggleMenu} />
        ) : (
          <AiOutlineMenu className="h-6 w-5" onClick={toggleMenu} />
        )}
      </div>

      {/* Sidebar Container */}
      {isMenuActive && (
        <div className="fixed inset-0 lg:static lg:h-full lg:w-full ">
          {/* underlay */}
          <div
            className="fixed inset-0 bg-dark-hard opacity-50 lg:hidden"
            onClick={toggleMenu}
          />
          {/* Sidebar */}
          <div className="fixed bottom-0 left-0  top-0 z-50  w-3/4 overflow-y-auto bg-dark-hard p-4 lg:static lg:h-full lg:w-full ">
            <h4 className="m-0 font-bold text-[#c7c7c7]">MAIN MENU</h4>
            {/* Menu Items */}
            <div className="mt-4 flex flex-col gap-y-[10px]">
              {menuItems.map((item) =>
                item.type == "link" ? (
                  <NavItem
                    key={item.title}
                    title={item.title}
                    link={item.link}
                    icon={item.icon}
                    name={item.name}
                    activeNavName={activeNavName}
                    setActiveNavName={setActiveNavName}
                  />
                ) : (
                  <NavItemCollapse
                    key={item.title}
                    title={item.title}
                    content={item.content}
                    icon={item.icon}
                    name={item.name}
                    activeNavName={activeNavName}
                    setActiveNavName={setActiveNavName}
                  />
                ),
              )}
            </div>
            <div
              className="  mt-[300px] w-[60%] cursor-pointer gap-x-2 rounded-full bg-slate-100 py-[6px]  text-dark-hard delay-[100ms] ease-out hover:bg-primary  hover:text-white md:mt-[650px] md:w-[30%] lg:mt-[290px] lg:w-[60%] "
              onClick={logoutHandler}
            >
              <span className="mx-6 flex flex-row items-center">
                <MdLogout className=" text-xl font-extrabold " />
                <button className="text-lg font-extrabold">Log Out</button>
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
