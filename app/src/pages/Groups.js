import { useEffect, useState } from "react";
import Header from "../components/Header";
import {stringSimilarity} from "string-similarity-js";
import GroupModal from "../components/GroupModal";

function Groups() {

  const [showModal, setShowModal] = useState(false);

    const[results, setResults] = useState(null);
    const [search, setSearch] = useState(null);

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
        console.log("enters");
        // Make a request to the endpoint with the formData
        console.log(formData);
        fetch("api/groups/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((res) => {
            if (res.ok) {
              closeModal();
              // Handle success (e.g., close the modal, update UI, etc.)
              console.log("Group created successfully!");
            } else {
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
                reader.onloadend = () => {
                    const imageBlob = new Blob([reader.result], { type: file.type });
                    setFormData({ ...formData, group_pic: imageBlob })
                };
                reader.readAsArrayBuffer(file);
            }

        }
    }
    


    useEffect(() => {
        // call get groups to populate results
        loadResults();

        // const fetchUserInfo = async () => {
        //   try {
        //     const response = await fetch('/api/user/current');
        //     const userData = await response.json();
        //     setFormData({ ...formData, admin_id: userData.user_id })
        //   } catch (error) {
        //     console.error(error.message);
        //   }
        // }
    
        fetchUserInfo();

    }, []);

    return (
        <div>
            <Header></Header>
            <div>
                <h1 className="max-w-5xl pt-8 mx-auto text-5xl font-extrabold mb-10 mt-5 text-white">Welcome to PetNet Groups!</h1>
            </div>

            <div className="flex justify-center items-center gap-8">
            <div className="relative flex items-center">
                <input
                type="text"
                className="search-bar rounded-full px-6 py-3 w-80 placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-300 transition-all duration-300"
                placeholder="Search by Group"
                onChange={(event) => renderGroups(event)}
                />
                {search && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white ring-1 ring-black ring-opacity-5 rounded-lg shadow-md">
                    {search.map((result, index) => (
                    <a
                        key={index}
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 rounded-lg transition-all duration-300"
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
                <button onClick={openModal} className="create-group-button rounded-full text-white px-8 py-3 bg-blue-500 hover:opacity-90 transition-all duration-300">
                Create your own group!
                </button>
                {showModal === true &&
                    <div onClick={closeModal()} className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${showModal ? 'block' : 'hidden'}`}>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                      <span className="absolute top-0 right-0 p-4 cursor-pointer">&times;</span>
                      <h2 className="text-2xl font-bold mb-4">Create a New Group</h2>
                      <form onSubmit={(e) => { e.preventDefault(); handleNewGroupSubmit()}}>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupName">Group Name:</label>
                          <input
                            type="text"
                            id="groupName"
                            name="groupName"
                            onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-300"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupDesc">Group Description:</label>
                          <textarea
                            id="groupDesc"
                            name="groupDesc"
                            onChange={(e) => setFormData({ ...formData, group_desc: e.target.value })}
                            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-300"
                            required
                          ></textarea>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupPic">Group Picture URL:</label>
                          <input
                            type="file"
                            id="groupPic"
                            name="groupPic"
                            onChange={(e) => handleMedia(e)}
                            className="block text-gray-700 text-sm font-bold mb-2"
                            accept="image/*"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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