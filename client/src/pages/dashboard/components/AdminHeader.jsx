import { useEffect, useState } from "react";
import { AiFillDashboard, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { LiaComments } from "react-icons/lia";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/actions/user";
import { MdLogout } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../../services/index/posts";
import toast from "react-hot-toast";

const AdminHeader = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [activeNavName, setActiveNavName] = useState("dashboard");
  const windowSize = useWindowSize();
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: mutateCreatePost, isLoading: isLoadingCreatePost } =
    useMutation({
      mutationFn: ({ token }) => {
        return createPost({ token });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["posts"]);
        toast.success("Post created, edit it now ! ");
        navigate(`/dashboard/posts/manage/edit/${data.slug}`);
        console.log(data.post);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
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

  const handleCreatePost = ({ token }) => {
    mutateCreatePost({ token });
  };

  return (
    <header className=" flex h-fit w-full items-center justify-between p-4 lg:h-full lg:max-w-[300px] lg:flex-col lg:items-start lg:justify-start lg:p-0 fixed">
      {/* logo */}
      <h2 className=" w-full text-xl font-extrabold lg:bg-dark-hard lg:px-2 lg:pt-4">
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
              <NavItem
                title="Dashboard"
                link="/dashboard"
                icon={<AiFillDashboard className="text-xl" />}
                name="dashboard"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
              <NavItem
                title="Comments"
                link="/dashboard/comments"
                icon={<LiaComments className="text-xl" />}
                name="comments"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
              <NavItemCollapse
                title="Posts"
                icon={<MdDashboard className="text-xl" />}
                name="posts"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              >
                <button
                  disabled={isLoadingCreatePost}
                  className="text-start disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() =>
                    handleCreatePost({ token: userState.userInfo.token })
                  }
                >
                  Create Post
                </button>
                <Link to="/dashboard/posts/manage">Manage</Link>
              </NavItemCollapse>
            </div>
            <div
              className="  mt-[300px] w-[60%] cursor-pointer gap-x-2 rounded-full bg-slate-100 py-[6px]  text-dark-hard delay-[100ms] ease-out hover:bg-dark-light  hover:text-white md:mt-[650px] md:w-[30%] lg:mt-[290px] lg:w-[60%] "
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
