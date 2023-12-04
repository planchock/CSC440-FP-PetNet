import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';

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
      <Header></Header>
      <div className="text-center flex flex-row items-center justify-center">
        <h1 className="text-5xl font-extrabold mb-5 mr-3 mt-3 text-white">{groupInfo && groupInfo.group_name}</h1>
        {
            join && (
                <button onClick={() => joinGroup()} className="rounded-full text-white px-8 ml-3 py-3 bg-blue-500 hover:opacity-90 transition-all duration-300">
                Join Now
                </button>
            )         
        }
        {
            !join && (
                <button onClick={() => createPost()} className="rounded-full text-white px-8 ml-3 py-3 bg-blue-500 hover:opacity-90 transition-all duration-300">
                Create Post
                </button>
            )         
        }
     </div>
      <div className="flex">
        <div className="w-1/4 bg-white p-4 rounded-lg ml-10">
          <div>
            <h1 className='text-lg font-semibold mb-2 text-center'>Group Information</h1>
          <div className="flex items-center">
                  <img src={profileBlob} alt="Profile Pic" className="rounded-full w-16 h-16 mb-2" />
                  {/* <img alt="Profile Pic" className="rounded-full w-16 h-16 mb-2" /> */}
           </div>
            <p className="text-lg font-semibold mb-2">Admin: {username}</p>
            {groupInfo && (
              <>
                <p className="text-lg font-semibold mb-2">Group Description: {groupInfo.group_desc}</p>
              </>
            )}
          </div>
        </div>
  
        <div className="flex-1 p-8">
            {postsInfo && postsInfo.map((post) => (
                
                <div
                key={post.post_id}
                className="bg-white p-4 mb-4 rounded-md shadow-md"
                >
                <div className="flex items-center mb-4">
                    <img
                    src={`/api/user/profile-picture/${post.user_id}`}
                    alt="User Profile Pic"
                    className="w-10 h-10 rounded-full mr-2"
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

                {/* <div className="flex items-center justify-between mt-4">
                    <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    // onClick={() => openCommentsModal(post.post_id)}
                    >
                    See Comments
                    </button>
                    <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
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
