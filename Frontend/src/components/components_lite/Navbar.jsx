import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Bell, LogOut, Menu, User2, X } from "lucide-react";
import Notifications from "./Notifications";
import { fetchNotifications } from "@/redux/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { list: notifications = [] } =
    useSelector((state) => state.notifications) || { list: [] };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user) dispatch(fetchNotifications());
  }, [dispatch, user]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [user]);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        USER_API_ENDPOINT + "/logout",
        {},
        { withCredentials: true }
      );
      if (res?.data?.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      } else {
        console.error("Error logging out:", res?.data);
      }
    } catch (error) {
      console.error("Axios error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  const navigationLinks =
    user && user.role === "Recruiter"
      ? [
          { label: "Companies", to: "/recruiter/companies" },
          { label: "Jobs", to: "/recruiter/jobs" },
          { label: "Accepted Applicants", to: "/recruiter/accepted-applicants" },
        ]
      : [
          { label: "Home", to: "/Home" },
          { label: "Jobs", to: "/Jobs" },
          { label: "Contact", to: "/Creator" },
        ];

  return (
    <header className="bg-[#008b8b] border-b border-gray-100 sticky top-0 z-30">
      <div className="mx-auto flex h-16 items-center justify-between max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to={"/Home"} className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-wider whitespace-nowrap">
              JOB PORTAL
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {user && user.role !== "Administrator" && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60">
                  <Bell className="h-5 w-5 text-white" />
                  {notifications.some((n) => !n.read) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 sm:w-96">
                <Notifications />
              </PopoverContent>
            </Popover>
          )}

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute left-0 right-0 top-16 bg-[#008b8b] shadow-lg md:static md:flex md:items-center md:justify-end md:bg-transparent md:shadow-none md:w-full`}
        >
          <div className="flex flex-col gap-4 px-4 pb-4 md:flex-row md:items-center md:gap-10 md:px-0 md:pb-0 md:justify-end md:ml-auto w-full">
            <ul className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8 font-medium">
              {navigationLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {user && user.role !== "Administrator" && (
              <div className="hidden md:block">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60">
                      <Bell className="h-5 w-5 text-white" />
                      {notifications.some((n) => !n.read) && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                          {notifications.filter((n) => !n.read).length}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0">
                    <Notifications />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {!user ? (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <Link
                  to={"/login"}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-semibold text-white hover:text-gray-100 transition duration-150"
                >
                  Login
                </Link>
                <Link to={"/register"} onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full md:w-auto rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-200 px-5 py-2">
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer border border-white/50">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="@user"
                      onError={(e) => {
                        e.currentTarget.src = "";
                      }}
                    />
                    <AvatarFallback name={user?.fullname} />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="flex items-center gap-4 border-b pb-3 mb-3">
                    <Avatar>
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="@user"
                        onError={(e) => {
                          e.currentTarget.src = "";
                        }}
                      />
                      <AvatarFallback name={user?.fullname} />
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user?.fullname}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.profile?.bio || "No Bio"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col text-gray-600">
                    {user && user.role !== "Administrator" && (
                      <Link
                        to={"/Profile"}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User2 className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    )}
                    {user && user.role === "Administrator" && (
                      <Link
                        to={"/admin"}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User2 className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition text-red-600 font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;