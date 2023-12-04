import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthenticatedHeader from "../components/AuthenticatedHeader"

const Group = () => {
  const location = useLocation();
  const groupId = new URLSearchParams(location.search).get('groupId');
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);
  const [memberInfo, setMemberInfo] = useState(null);
  const [postsInfo, setPostsInfo] = useState(null);
  const [join, setJoin] = useState(null);
  const [profileBlob, setProfileBlob] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user/current');
      const userData = await response.json();
      setUserId(userData.user_id);
      setUsername(userData.username)
    } catch (error) {
      console.error('Error fetching user information:', error.message);
    }
  };

  const fetchGroupInfo = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      const groupData = await response.json();
      setGroupInfo(groupData);

      if (groupData.group_pic !== null){
        const mediaData = groupData.group_pic.results[0].media_url.data; 
        const mimeType = groupData.group_pic.results[0].media_url.type; 
        const mediaBlob = new Blob([new Uint8Array(mediaData)], { type: mimeType });
        const dataURL = URL.createObjectURL(mediaBlob);
        setProfileBlob(dataURL);
      }
    } catch (error) {
      console.error('Error fetching group information:', error.message);
    }
  };
  
  const fetchMemberInfo = async () => {
    try {
      const response = await fetch(`/api/groups/members/${groupId}`);
      const memberData = await response.json();
      setMemberInfo(memberData);
      // Handle 'memberData' based on your API response structure
    } catch (error) {
      console.error('Error fetching member information:', error.message);
    }
    
  };

  const fetchPostsInfo = async () => {
    try {
      const response = await fetch(`/api/groups/posts/${groupId}`);
      const postData = await response.json();
      setPostsInfo(postData.posts);
      // Handle 'memberData' based on your API response structure
    } catch (error) {
      console.error('Error fetching member information:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserInfo();
        await fetchGroupInfo();
        await fetchMemberInfo();
        await fetchPostsInfo();
  
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };  
  
    fetchData();
  }, []);

  useEffect(() => {
    updateJoin()
  },[memberInfo]);

  useEffect(() => {
    fetchMemberInfo();
  }, [join])

  const updateJoin = () => {
    if (userId && groupInfo && memberInfo) {
      let notJoined = true;
      for (let i = 0; i < memberInfo.members.length; i++) {
        if (memberInfo.members[i].user_id === userId) {
          notJoined = false;
          break;
        }
      }
      setJoin(notJoined);
    }
  };

  const joinGroup = async () => {
    try {
      const data = {
        groupId: groupInfo.group_id,
        userId: userId,
      };
      
      const response = await fetch("api/groups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert("Joined the group successfully!");
        setJoin(false);
      } else {
        alert("Failed to join the group");
      }
    } catch (error) {
      console.error('Error joining group:', error.message);
    }
  };

  const createPost = async () => {
    window.location.href = `/post`;
  }
  
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
      <AuthenticatedHeader />
      <div className="flex flex-row items-center justify-center text-center">
        <h1 className="mt-3 mb-5 mr-3 text-5xl font-extrabold text-white">{groupInfo && groupInfo.group_name}</h1>
        {
            join && (
                <button onClick={() => joinGroup()} className="px-8 py-3 ml-3 text-white transition-all duration-300 bg-blue-500 rounded-full hover:opacity-90">
                Join Now
                </button>
            )         
        }
        {
            !join && (
                <button onClick={() => createPost()} className="px-8 py-3 ml-3 text-white transition-all duration-300 bg-blue-500 rounded-full hover:opacity-90">
                Create Post
                </button>
            )         
        }
     </div>
      <div className="flex">
        <div className="w-1/4 p-4 ml-10 bg-white rounded-lg">
          <div>
            <h1 className='mb-2 text-lg font-semibold text-center'>Group Information</h1>
          <div className="flex items-center">
                  <img src={profileBlob} alt="Profile Pic" className="w-16 h-16 mb-2 rounded-full" />
                  {/* <img alt="Profile Pic" className="w-16 h-16 mb-2 rounded-full" /> */}
           </div>
            <p className="mb-2 text-lg font-semibold">Admin: {username}</p>
            {groupInfo && (
              <>
                <p className="mb-2 text-lg font-semibold">Group Description: {groupInfo.group_desc}</p>
              </>
            )}
          </div>
        </div>
  
        <div className="flex-1 p-8">
            {postsInfo && postsInfo.map((post) => (
                
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
                </div>

                <div className="mb-4 text-center">
                    <div className="font-bold">
                    {post.caption}
                    </div>
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

                {/* <div className="flex items-center justify-between mt-4">
                    <button
                    className="px-4 py-2 text-white bg-blue-500 rounded"
                    // onClick={() => openCommentsModal(post.post_id)}
                    >
                    See Comments
                    </button>
                    <button
                    className="px-4 py-2 text-white bg-blue-500 rounded"
                    // onClick={() => openWriteCommentModal(post.post_id)}
                    >
                    Leave a comment
                    </button>
                </div> */}
                </div>
            ))}
          
        </div>
      </div>
    </div>
  );
  
};

export default Group;
