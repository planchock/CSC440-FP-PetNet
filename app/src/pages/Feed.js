import "tailwindcss/tailwind.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import AuthenticatedHeader from "../components/AuthenticatedHeader";

function Feed() {
  const { isAuthenticated, isLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isGroupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [showWriteComment, setShowWriteComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postToCommentOn, setPostToCommentOn] = useState(null);

  const [groupInfo, setGroupInfo] = useState({
    group_id: "",
    group_name: "",
  });
  const [groups, setGroups] = useState([]);

  const toggleGroupDropdown = () => {
    setGroupDropdownOpen(!isGroupDropdownOpen);
  };

  const openCommentsModal = async (selectedPostId) => {
    try {
      const response = await fetch(`/api/feed/comments/${selectedPostId}`);
      const commentsData = await response.json();
      setComments(commentsData);
      setShowComments(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  //set the post we are going to comment on
  const openWriteCommentModal = (selectedPostId) => {
    setShowWriteComment(true);
    setPostToCommentOn(selectedPostId);
  };

  //submit function for making a comment
  const writeComment = () => {
    fetch(`/api/feed/comments/${postToCommentOn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newComment,
      }),
    })
    .then((res) => {
      if (res.status === 200) {
        alert("Comment created successfully.");
      } else {
        alert("Invalid comment or you already commented that.");
      }
    }).catch(() => {
      alert("Error occurred.");
    });
    
    setNewComment("");
    setPostToCommentOn(null);
    setShowWriteComment(false);
  };

  const closeCommentsModal = () => {
    setShowComments(false);
  };

  const closeWriteCommentModal = () => {
    setShowWriteComment(false);
  };

  //fill up group filter
  useEffect(() => {
    const fetchDropdownContent = async () => {
      try {
        const response = await fetch("/api/feed/groups");
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error(error.message);
      }
    };

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
      .then(async (data) => {
        // Set posts with dynamic image URLs
        const postsWithImages = await Promise.all(
          data.map(async (post) => ({
            ...post,
            mediaUrl: post.media ? await fetchPostImage(post.post_id) : null,
            userMedia: post.user_media
              ? await fetchProfilePic(post.user_id)
              : null,
          }))
        );
        setPosts(postsWithImages);
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
      const filteredPosts = posts.filter(
        (post) => post.group_id === groupInfo.group_id
      );
      setPosts(filteredPosts);
    }
  };

  const fetchPostImage = async (postId) => {
    try {
      const response = await fetch(`/api/feed/picture/${postId}`);
      const data = await response.blob();
      const url = URL.createObjectURL(new Blob([data]));
      return url;
    } catch (error) {
      console.error("Error fetching image data:", error.message);
      return null;
    }
  };

  const fetchProfilePic = async (userId) => {
    try {
      const response = await fetch(`/api/user/profile-picture/${userId}`);
      const data = await response.blob();
      const url = URL.createObjectURL(new Blob([data]));
      return url;
    } catch (error) {
      console.error("Error fetching image data:", error.message);
      return null;
    }
  };

  return (
    <div>
      <AuthenticatedHeader />
      <div className="flex max-w-4xl mx-auto">
        {/* Left Side - Group Selection */}
        <div className="w-1/5 px-6">
          <button
            onClick={toggleGroupDropdown}
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            {groupInfo.group_name ? groupInfo.group_name : "group"}
          </button>

          {isGroupDropdownOpen && (
            <div className="absolute mt-2 bg-white border rounded">
              {groups.map((group) => (
                <button
                  key={group.group_id}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() =>
                    setGroupInfo({
                      group_id: group.group_id,
                      group_name: group.group_name,
                    })
                  }
                >
                  {group.group_name}
                </button>
              ))}

              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setGroupInfo({ group_id: "", group_name: "" })}
              >
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
              className="p-4 mb-4 bg-white rounded-md shadow-md"
            >
              <div className="flex items-center mb-4">
                <img
                  src={`/api/user/profile-picture/${post.user_id}`}
                  alt="User Profile Pic"
                  className="w-10 h-10 mr-2 rounded-full"
                />
                <div>
                  <div className="font-bold">
                    {post.first_name} {post.last_name} with {post.pet}
                  </div>
                  <div className="text-gray-600">@{post.username}</div>
                </div>
              </div>

              <div className="mb-4 text-center">
                <div className="font-bold">{post.caption}</div>
                {post.media && (
                  <img
                    src={`/api/feed/picture/${post.post_id}`}
                    alt="Post Media"
                    className="object-cover w-full h-40 mb-2 rounded-md"
                  />
                )}
                <p>{post.text}</p>
              </div>

              {post.group_name && (
                <div className="ml-auto text-sm text-gray-500">
                  in group: {post.group_name}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded"
                  onClick={() => openCommentsModal(post.post_id)}
                >
                  See Comments
                </button>
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded"
                  onClick={() => openWriteCommentModal(post.post_id)}
                >
                  Leave a comment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show Comments Modal */}
      {showComments && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75">
          <div className="p-4 bg-white rounded-md">
            <button
              className="float-right text-gray-600"
              onClick={closeCommentsModal}
            >
              X
            </button>
            <h2 className="mb-4 text-xl font-bold">Comments</h2>
            <ul>
              {comments.map((comment, index) => (
                <li key={index} className="mb-2">
                  <strong>{comment.username}:</strong> {comment.comment_text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Show Write Comment Modal */}
      {showWriteComment && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75">
          <div className="p-4 bg-white rounded-md">
            <button
              className="float-right text-gray-600"
              onClick={closeWriteCommentModal}
            >
              X
            </button>
            <h2 className="mb-4 text-xl font-bold">Write a comment</h2>
            <input
              type="text"
              placeholder="comment here"
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded"
              onClick={() => writeComment()}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;
