import "tailwindcss/tailwind.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";

function Feed() {
  const { isAuthenticated, isLoading } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      getFeed();
    }
  }, [isAuthenticated, isLoading]);

  const getFeed = () => {
    fetch("/api/feed/current", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Error fetching feed.");
        }
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
        alert("Error fetching feed.");
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {posts.map((post) => (
        <div
          key={post.post_id}
          className="bg-white p-4 mb-4 rounded-md shadow-md"
        >
          <div className="flex items-center mb-4">
            <img
              src={post.user_media}
              alt="User Media"
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <div className="font-bold">
                {post.first_name} {post.last_name} with {post.pet}
              </div>
              <div className="text-gray-600">@{post.username}</div>
            </div>
          </div>

          <div className="mb-4 text-center">
            {post.media && (
              <img
                src={post.media}
                alt="Post Media"
                className="w-full h-40 object-cover mb-2 rounded-md"
              />
            )}
            <p>{post.text}</p>
          </div>

          {post.group_name && (
            <div className="text-sm text-gray-500 ml-auto">
              in group: {post.group_name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Feed;
