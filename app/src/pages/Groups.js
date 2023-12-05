import { useEffect, useState } from "react";
import {stringSimilarity} from "string-similarity-js";
import AuthenticatedHeader from "../components/AuthenticatedHeader";

function Groups() {

  const [showModal, setShowModal] = useState(false);

    const[results, setResults] = useState(null);
    const [search, setSearch] = useState(null);
    const [groups, setGroups] = useState(null);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [formData, setFormData] = useState({
      group_name: '',
      group_desc: '',
      group_pic: '',
      admin_id: '',
    });


    const loadResults = () => {
      fetch("api/groups/current", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json(); 
          } else {
            throw new Error("Unable to retrieve groups");
          }
        })
        .then((data) => {
          var groupsMap = new Map();
          for (let i = 0; i < data.results.length; i++) {
            groupsMap.set(data.results[i].group_name, data.results[i].group_id);
          }
          setGroups(groupsMap);
          
          const groupNames = data.results.map(result => result.group_name);
          if (groupNames.length === 0){
            setResults(["No groups exist"]);
          }
          setResults(groupNames);
        })
        .catch((error) => {
          console.error(error.message);
          alert("Unable to retrieve groups");
        });
    };
    

    const renderGroups = (event) => {
        let input = event.target.value;
        if (input === '') {
          setSearch(null);
        } else {
          var ranking = new Map();
          if (results) {
            setResults((prevResults) => {
              prevResults.forEach((val) => {
                let rank = stringSimilarity(val, input);
                ranking.set(val, rank);
              });
              const sortedSearch = Array.from(ranking.entries()).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
              setSearch(sortedSearch);
              return prevResults; // Return the previous state to avoid unnecessary re-renders
            });
          }
        }
      };

    const handleNewGroupSubmit = () => {
        const body = new FormData();
      
        // Append form fields to formData
        body.append('group_name', formData.group_name);
        body.append('group_desc', formData.group_desc);
        body.append('group_pic', formData.group_pic);
        body.append('admin_id', formData.admin_id);
      
        fetch("api/groups/new", {
          method: "POST",
          body: body,
        })
          .then((res) => {
            if (res.ok) {
              closeModal();
              alert("Group created successfully!");
              loadResults();
            } else {
              alert("Failed to create group");
              throw new Error("Failed to create group");
            }
          })
          .catch((error) => {
            console.error(error.message);
            // Handle error (e.g., show error message to the user)
          });
      };
      

    const handleMedia = (event) => {
        const file = event.target.files[0];

        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                const reader = new FileReader();
                let buff = '';
                reader.onloadend = async () => {
                    const imageBlob = new Blob([reader.result], { type: file.type });
                    setFormData({ ...formData, group_pic: imageBlob })
                };
                reader.readAsArrayBuffer(file);
            }

        }
    }

    const handleDropdownItemClick = (selectedItem) => {
        console.log(groups);
        const groupId = groups.get(selectedItem);
        console.log(groupId);
        window.location.href = `/group?groupId=${groupId}`;
        // Add additional actions if needed
    };


    useEffect(() => {
        // call get groups to populate results
        loadResults();

        const fetchUserInfo = async () => {
          try {
            const response = await fetch('/api/user/current');
            const userData = await response.json();
            setFormData({ ...formData, admin_id: userData.user_id })
          } catch (error) {
            console.error(error.message);
          }
        }
    
        fetchUserInfo();

    }, []);

    return (
        <div>
            <AuthenticatedHeader />
            <div>
                <h1 className="max-w-5xl pt-8 mx-auto mt-5 mb-10 text-5xl font-extrabold text-center text-white">Welcome to PetNet Groups!</h1>
            </div>

            <div className="flex items-center justify-center gap-8">
            <div className="relative flex items-center">
                <input
                type="text"
                className="px-6 py-3 placeholder-gray-500 transition-all duration-300 rounded-full search-bar w-80 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Search by Group"
                onChange={(event) => renderGroups(event)}
                />
                {search && (
                <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-md top-full w-80 ring-1 ring-black ring-opacity-5">
                    {search.map((result, index) => (
                    <a
                        key={index}
                        href="#"
                        onClick={() => handleDropdownItemClick(result)}
                        className="block px-4 py-2 text-gray-700 transition-all duration-300 rounded-lg hover:bg-gray-100 active:bg-blue-100"
                    >
                        {result}
                    </a>
                    ))}
                </div>
                )}
            </div>

            <div>
                <span className="text-gray-500">or</span>
            </div>

            <div>
                <button onClick={() => openModal()} className="px-8 py-3 text-white transition-all duration-300 bg-blue-500 rounded-full create-group-button hover:opacity-90">
                Create your own group!
                </button>
                {showModal === true &&
                    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${showModal ? 'block' : 'hidden'}`}>
                    <div className="p-8 bg-white rounded-lg shadow-md">
                      <span className="absolute top-0 right-0 p-4 cursor-pointer" onClick={closeModal}>&times;</span>
                      <h2 className="mb-4 text-2xl font-bold">Create a New Group</h2>
                      <form onSubmit={(e) => { e.preventDefault(); handleNewGroupSubmit()}}>
                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="groupName">Group Name:</label>
                          <input
                            type="text"
                            id="groupName"
                            name="groupName"
                            onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="groupDesc">Group Description:</label>
                          <textarea
                            id="groupDesc"
                            name="groupDesc"
                            onChange={(e) => setFormData({ ...formData, group_desc: e.target.value })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-300"
                            required
                          ></textarea>
                        </div>
                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="groupPic">Group Picture URL:</label>
                          <input
                            type="file"
                            id="groupPic"
                            name="groupPic"
                            onChange={(e) => handleMedia(e)}
                            className="block mb-2 text-sm font-bold text-gray-700"
                            accept="image/*"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                          Create Group
                        </button>
                      </form >
                    </div>
                  </div>
                }
            </div>
            </div>
        </div>
      );

}
export default Groups;