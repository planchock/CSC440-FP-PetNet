import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import { useAuth } from "./AuthProvider";

function AuthenticatedHeader() {
  const [userInfo, setUserInfo] = useState({
    username: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated && !isLoading) {
    window.location = "/";
  }

  //get user info to fill in header
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/user/current");
        const userData = await response.json();
        setUserInfo({
          username: userData.username,
        });
        const picture = await fetch(
          "/api/user/profile-picture/" + userData.user_id
        );
        const pictureData = await picture.blob();
        const url = URL.createObjectURL(new Blob([pictureData]));
        setProfilePic(url);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "DELETE",
    });

    if (res.status == 200) {
      window.location = "/";
    }
  };

  return (
    <div className="z-10 flex items-center justify-between max-w-5xl py-4 mx-auto mb-4 bg-blue-500">
      {/* Logo */}
      <Link to="/" className="block">
        <h1 className="ml-2 text-3xl font-extrabold text-pink-400">
          Pet<span className="text-white">Net</span>
        </h1>
      </Link>

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        <Link to="/post" className="text-white hover:text-gray-300">
          Create Post
        </Link>
        <Link to="/groups" className="text-white hover:text-gray-300">
          Groups
        </Link>
        <button className="text-red-500" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* User Info */}
      <div className="flex items-center mr-2 space-x-4">
        <Link to="/profile" className="text-white hover:text-gray-300">
          @{userInfo.username}
        </Link>
        <img src={profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
}

export default AuthenticatedHeader;
