import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/actions/user";
const NavItemsInfo = [
  { name: "Home", type: "link", url: "/" },
  { name: "Articles", type: "link", url: "/articles" },
  {
    name: "Pages",
    type: "dropdown",
    items: [
      { name: "About Us", url: "/about-us" },
      { name: "Contact Us", url: "/contact-us" },
    ],
  },
];

const NavItem = ({ item }) => {
  const [dropdown, setDropdown] = useState(false);

  const toggleHandler = () => {
    setDropdown((currState) => !currState);
  };

  return (
    <li className="group relative mr-6">
      {item.type === "link" ? (
        <>
          <Link to={item.url} className="px-4 py-2">
            {item.name}
          </Link>
          <span className="absolute right-0 top-0 cursor-pointer font-bold text-blue-500 opacity-0 transition-all duration-500 group-hover:right-[90%] group-hover:opacity-100">
            |
          </span>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <button
            className="flex items-center gap-x-1 px-4 py-2"
            onClick={toggleHandler}
          >
            <span>{item.name}</span>
            <MdKeyboardArrowDown />
          </button>
          <div
            className={`${
              dropdown ? "block" : "hidden"
            } w-max pt-4 transition-all duration-500 lg:absolute lg:bottom-0 lg:right-0 lg:hidden lg:translate-y-full lg:transform lg:group-hover:block `}
          >
            <ul className="flex flex-col overflow-hidden rounded-lg bg-dark-hard text-center shadow-lg lg:bg-transparent">
              {item.items.map((subItem, index) => (
                <Link
                  key={index}
                  to={subItem.url}
                  className="px-4 py-2 text-white hover:bg-dark-soft hover:text-white lg:text-dark-soft"
                >
                  {subItem.name}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [navIsVisible, setNavIsVisible] = useState(false);
  const userState = useSelector((state) => state.user);
  const [profileDropdown, setprofileDropdown] = useState(false);

  const navVisibilityHandler = () => {
    setNavIsVisible((currState) => {
      return !currState;
    });
  };
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <section className="sticky left-0  right-0 top-0 z-50 bg-[#E2E0DD] py-2">
      <header className="container mx-auto flex items-center justify-between px-2 pt-2 ">
        <div>
          <h2 className=" text-xl font-extrabold">
            <Link className="w-16 animate-pulse text-blue-800" to="/">
              BLOG APP
            </Link>
          </h2>
        </div>
        <div className="z-50 lg:hidden">
          {navIsVisible ? (
            <AiOutlineClose
              className="-h-6 w-6"
              onClick={navVisibilityHandler}
            />
          ) : (
            <AiOutlineMenu
              className="-h-6 w-6"
              onClick={navVisibilityHandler}
            />
          )}
        </div>
        <div
          className={`${
            navIsVisible ? "right-0 " : "-right-full"
          } fixed  bottom-0 top-0 z-[49] mt-[60px] flex w-full
           flex-col items-center justify-center gap-x-9 bg-dark-hard transition-all duration-300 lg:static lg:mt-0 lg:w-auto  lg:flex-row lg:justify-end lg:bg-transparent`}
        >
          <ul className=" mx-60 flex flex-col items-center  gap-x-2 gap-y-5 font-semibold text-white lg:flex-row lg:text-dark-soft">
            {NavItemsInfo.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </ul>
          {userState.userInfo ? (
            <div
              className="
              flex
              flex-col
              items-center
              justify-center
              gap-x-2
              gap-y-5
              font-semibold
              text-white
              lg:flex-row
              lg:text-dark-soft"
            >
              <div className="group relative">
                <div className=" flex flex-col items-center">
                  <button
                    className=" mt-5 flex items-center gap-x-1 rounded-full border-2 border-blue-600 px-4 py-2 font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white lg:mx-6 lg:mt-0"
                    onClick={() => setprofileDropdown(!profileDropdown)}
                  >
                    <span>Account</span>
                    <MdKeyboardArrowDown />
                  </button>
                  {/* Profile Dropdown */}
                  <div
                    className={`${
                      profileDropdown ? "block" : "hidden"
                    } w-full pt-4 transition-all duration-500 lg:absolute lg:bottom-0 lg:right-0 lg:hidden lg:translate-y-full lg:transform lg:px-8 lg:group-hover:block `}
                  >
                    <ul className="flex w-[110px] flex-col overflow-hidden rounded-lg bg-dark-hard text-center shadow-2xl lg:bg-transparent">
                      {userState.userInfo.admin && (
                        <button
                          onClick={() => navigate("/dashboard")}
                          className="px-3 py-2 text-white hover:bg-dark-soft hover:text-white lg:text-dark-soft"
                        >
                          Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => navigate("/profile")}
                        className="px-4 py-2 text-white hover:bg-dark-soft hover:text-white lg:text-dark-soft"
                      >
                        Profile
                      </button>
                      <button
                        onClick={logoutHandler}
                        className="px-4 py-2 text-white hover:bg-dark-soft hover:text-white lg:text-dark-soft"
                      >
                        Logout
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button className="mt-5 rounded-full border-2 border-blue-600 px-6 py-2 font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white lg:mt-0">
              <Link to="/login">Login </Link>
            </button>
          )}
        </div>
      </header>
    </section>
  );
};
