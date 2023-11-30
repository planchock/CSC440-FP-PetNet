import "tailwindcss/tailwind.css";
import { useState, useEffect } from "react";
import Header from "../components/Header";

function Post() {
    const [isPetDropdownOpen, setPetDropdownOpen] = useState(false);

    const togglePetDropdown = () => {
        setPetDropdownOpen(!isPetDropdownOpen);
    };

    const [isGroupDropdownOpen, setGroupDropdownOpen] = useState(false);

    const [caption, setCaption] = useState("");
    const [content, setContent] = useState("");
    const [media, setMediaBlob] = useState("");

    const [petInfo, setPetInfo] = useState({
        pet_id: '',
        name: '',
    });

    const [groupInfo, setGroupInfo] = useState({
        group_id: '',
        group_name: '',
    });
    
    const [pets, setPets] = useState([]);
    const [groups, setGroups] = useState([]);

    const toggleGroupDropdown = () => {
        setGroupDropdownOpen(!isGroupDropdownOpen);
    };
    useEffect(() => {
        fetchDropdownContent();
    }, []);

    const fetchDropdownContent = async () => {

        try {
            const response = await fetch('/api/pets');
            const data = await response.json();
            setPets(data);
            console.log("pets", data);

        } catch (error) {
            console.error(error.message);
        }

        try {
            const response = await fetch('/api/groups');
            const data = await response.json();
            setGroups(data);
            console.log("groups", groups);

        } catch (error) {
            console.error(error.message);
        }


    }

    const handleMedia = (event) => {
        console.log("EVENT:", event);
        const file = event.target.files[0];

        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const imageBlob = new Blob([reader.result], { type: file.type });
                    console.log('IMAGEBLOB:', imageBlob);
                    setMediaBlob(imageBlob);
                };
                reader.readAsArrayBuffer(file);
            }

        }
    }

    const handleSubmit = () => {

        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('content', content);
        formData.append('pet_id', petInfo.pet_id);
        formData.append('group_id', groupInfo.group_id);
        formData.append('file', media);

        fetch("/api/post", {
            method: "POST",
            // headers: {
            //     "Content-Type": "application/json",
            // },
            // body: JSON.stringify({ caption, content, pet_id: pet_id || null, group_id: group_id || null, media: media || null }),
            body: formData
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log("success");
                } else {
                    alert("failure bot");
                }
            })
            .catch((err) => {
                alert("failure");
            });

    }

    return (

        <Header>
            <div className="w-full">
                <div className="flex justify-center">
                    <span className="text-5xl text-white"><b>Create Post</b></span>
                </div>
                <div className="mt-6">
                    <div className="flex justify-center w-full mx-6">
                        <span className="mr-6 text-pink-400">Caption:</span>
                        <input className="w-3/5 rounded-md" type="text" onChange={(e) => setCaption(e.target.value)} required />

                    </div>
                    <div className="mt-6 flex justify-center w-full mx-6">
                        <textarea className="rounded-md w-2/3" name="postContent" id="post-content" cols="30" rows="10" placeholder="Post here!" onChange={(e) => setContent(e.target.value)} required></textarea>
                    </div>
                    <div className="flex w-auto justify-center mx-6 mt-2">

                        <div className="px-6">
                            <button onClick={togglePetDropdown} className="bg-blue-500 text-white px-4 py-2 rounded">
                                {petInfo.name ? petInfo.name : 'Pet'}
                            </button>

                            {isPetDropdownOpen && (
                                <div className="absolute mt-2 bg-white border rounded">
                                    {pets.map((pet) => (
                                        <button
                                            key={pet.pet_id}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                            onClick={() => setPetInfo({ pet_id: pet.pet_id, name: pet.name })}
                                        >
                                            {pet.name}
                                        </button>
                                    ))}
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => setPetInfo({pet_id: '', name: ''})}>
                                        None
                                    </button>

                                </div>
                            )}
                        </div>



                        <div className="px-6">
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

                        <div>
                            <input type="file" onChange={(e) => handleMedia(e)} class="ml-12 relative inline-block text-lg group" accept="image/*" />
                        </div>

                        <div>
                            <button onClick={handleSubmit} class="ml-12 relative inline-block text-lg group">
                                <span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                                    <span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-yellow-200"></span>
                                    <span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                                    <span class="relative">Submit</span>
                                </span>
                                <span
                                    class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                                    data-rounded="rounded-lg"
                                ></span>
                            </button>
                        </div>






                    </div>


                </div>
            </div>


        </Header>
    );
}

export default Post;
