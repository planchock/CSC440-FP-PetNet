import "tailwindcss/tailwind.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import FeedHeader from "../components/FeedHeader";

function Feed() {
  const { isAuthenticated, isLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isGroupDropdownOpen, setGroupDropdownOpen] = useState(false);

  const [groupInfo, setGroupInfo] = useState({
    group_id: '',
    group_name: '',
  });
  const [groups, setGroups] = useState([]);

    const [userInfo, setUserInfo] = useState({
    username: '',
    user_media: '',
  });

  const toggleGroupDropdown = () => {
    setGroupDropdownOpen(!isGroupDropdownOpen);
  };

  useEffect(() => {
    const fetchDropdownContent = async () => {
      try {
        const response = await fetch('/api/feed/groups');
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error(error.message);
      }
    }
  
    fetchDropdownContent();
  }, []);


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
        //group filter
        filterPosts();
      })
      .catch((err) => {
        console.error(err);
        alert("Error fetching feed.");
      });
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      getFeed();
    }
  }, [isAuthenticated, isLoading, groupInfo.group_id]);

  const filterPosts = () => {
    // If no group is selected, show all posts
    if (!groupInfo.group_id) {
      return;
    } else {
      // Filter posts based on selected group
      const filteredPosts = posts.filter((post) => post.group_id === groupInfo.group_id);
      setPosts(filteredPosts);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user/current');
        const userData = await response.json();
        setUserInfo({
          username: userData.username,
          user_media: userData.profile_pic,
        });
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchUserInfo();
  }, []);

  return (
    <div>
      <FeedHeader username={userInfo.username} user_media={userInfo.user_media}/>
      <div className="max-w-4xl mx-auto flex">
        {/* Left Side - Group Selection */}
        <div className="w-1/5 px-6">
          <button onClick={toggleGroupDropdown} className="bg-blue-500 text-white px-4 py-2 rounded">
            {groupInfo.group_name ? groupInfo.group_name : "group"}
          </button>

          {isGroupDropdownOpen && (
            <div className="absolute mt-2 bg-white border rounded">
              {groups.map((group) => (
                <button
                  key={group.group_id}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setGroupInfo({ group_id: group.group_id, group_name: group.group_name })}
                >
                  {group.group_name}
                </button>
              ))}

              <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => setGroupInfo({group_id: '', group_name: ''})}>
                None
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Posts */}
        <div className="w-4/5 px-6">
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
                <div className="font-bold">
                  {post.caption}
                </div>
                {/* {post.media && (
                  <img
                    src={URL.createObjectURL(post.media)}
                    alt="Post Media"
                    className="w-full h-40 object-cover mb-2 rounded-md"
                  />
                )} */}
              </div>
              <p>{post.text}</p>

              {post.group_name && (
                <div className="text-sm text-gray-500 ml-auto">
                  in group: {post.group_name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
