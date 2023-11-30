import React from "react";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";

function FeedHeader({ username, user_media }) {
  return (
    <div className="z-10 max-w-5xl mx-auto flex items-center justify-between py-4 mb-4 bg-blue-500">
      {/* Logo */}
      <Link to="/" className="block">
        <h1 className="text-3xl font-extrabold text-pink-400">Pet<span className="text-white">Net</span></h1>
      </Link>

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        <Link to="/post" className="text-white hover:text-gray-300">Create Post</Link>
        <Link to="/groups" className="text-white hover:text-gray-300">Groups</Link>
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="text-white hover:text-gray-300">@{username}</Link>
        <img
          src={user_media}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
  );
}

export default FeedHeader;




