import { useEffect, useState } from "react";
import AuthenticatedHeader from "../components/AuthenticatedHeader";

const PetCard = ({ pet, canEdit, handleEdit, handleDelete }) => {
    return (
        <div className="group bg-white p-4 mb-4 rounded-md shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="font-bold">
                        {pet.name}
                    </div>
                    <div className="text-gray-600">{pet.type}</div>
                </div>
                <div>
                    <span className="font-semibold">Born: </span>
                    {
                        pet.birthday.split("T")[0]
                    }
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p>
                    {pet.bio}
                </p>
                <div>
                    <button
                        onClick={() => handleEdit(pet.pet_id)}
                        className={`${canEdit ? 'group-hover:visible' : ''} invisible m-1 px-3 py-2 text-l font-bold text-white rounded-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800`}
                    >✏️</button>
                    <button
                        onClick={() => handleDelete(pet)}
                        className={`${canEdit ? 'group-hover:visible' : ''} invisible m-1 px-3 py-2 text-l font-bold text-white rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500`}
                    >🗑️</button>
                </div>
            </div>
        </div >
    );
}

const EditablePetCard = ({ pet, handleCancel, handleSave }) => {
    const initValue = pet ? {
        ...pet, birthday: new Date(pet.birthday).toISOString().split('T')[0]
    } : { name: null, type: null, birthday: null, bio: null };
    const [editedPet, setEditedPet] = useState(initValue);

    const handleInputChange = (e, field) => {
        setEditedPet((prevPet) => ({
            ...prevPet,
            [field]: e.target.value,
        }));
    };

    return (
        <div className="group bg-white p-4 mb-4 rounded-md shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <input
                        placeholder="name"
                        type="text"
                        className="block mb-1 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedPet?.name || ''}
                        onChange={(e) => handleInputChange(e, 'name')}
                    />
                    <input
                        placeholder="type"
                        type="text"
                        className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedPet?.type || ''}
                        onChange={(e) => handleInputChange(e, 'type')}
                    />
                </div>
                <div>
                    <span className="font-semibold">Born: </span>
                    <input
                        type="date"
                        className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedPet?.birthday || ''}
                        onChange={(e) => handleInputChange(e, 'birthday')}
                    />
                </div>
            </div>
            <textarea
                placeholder="bio"
                value={editedPet?.bio || ''}
                className="w-full h-20 p-2 border border-gray-300 rounded-md"
                onChange={(e) => handleInputChange(e, 'bio')}
            />
            <div className="flex justify-end">
                <button
                    onClick={handleCancel}
                    className="m-1 px-3 py-2 text-l font-bold rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                    Cancel
                </button>
                <button
                    onClick={() => handleSave(editedPet)}
                    className="m-1 px-3 py-2 text-l font-bold text-white rounded-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

const PostCard = ({ post }) => {
    return (
        <div className="bg-white p-4 mb-4 rounded-md shadow-md">
            <div className="flex items-center mb-4">
                <img
                    src={`/api/user/profile-picture/${post.user_id}`}
                    alt="User Profile Pic"
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
        </div>
    )
}

const Profile = () => {
    const [currentlyEditingPet, setCurrentlyEditingPet] = useState(null);
    const [addingNewPet, setAddingNewPet] = useState(false);

    const [pets, setPets] = useState([]);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);

    const [pfpUrl, setPfpUrl] = useState('');
    const [imageBlob, setImageBlob] = useState([]);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    //{ isError: boolean, errorMsg: string }, errorMsg only required if isError is true
    const [error, setError] = useState({ isError: false, errorMsg: "" });

    //get data on mount
    useEffect(() => {
        setError({ isError: false });

        const fetchData = async () => {
            try {
                const userResponse = await fetch("/api/user/current", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!userResponse.ok) {
                    throw new Error("Could not load user details.");
                }
                const userData = await userResponse.json();
                setUser(userData);

                const pfpResponse = await fetch(`/api/user/profile-picture/${userData.user_id}`);
                if (!pfpResponse.ok && pfpResponse.status != 404) {
                    throw new Error("Could not load user profile picture.");
                } else if (pfpResponse.status != 404) {
                    const imgData = await pfpResponse.blob();
                    const url = URL.createObjectURL(new Blob([imgData]));
                    setPfpUrl(url);
                }

                const petResponse = await fetch("/api/pets", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!petResponse.ok) {
                    throw new Error("Could not load pets.");
                }

                const petData = await petResponse.json();
                setPets(petData);

                const postResponse = await fetch("/api/posts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!postResponse.ok) {
                    throw new Error("Could not load pets.");
                }

                const postData = await postResponse.json();
                setPosts(postData);
            } catch (error) {
                setError({ isError: true, errorMsg: error.message });
            }
        };

        fetchData();
    }, [])

    function handleEdit(petId) {
        setCurrentlyEditingPet(petId);
    }

    function handleCancelEdit() {
        setCurrentlyEditingPet(null);
    }

    async function handleDelete(pet) {
        try {
            const res = await fetch(`/api/pets/${pet.pet_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                //if successful delete the pet from the array to update ui
                setPets(pets => pets.filter(p => p.pet_id !== pet.pet_id));
            } else {
                throw new Error("Could not delete pet.")
            }
        } catch (error) {
            setError({ isError: true, errorMsg: error.message })
        }
    }

    async function handleUpdate(pet) {
        //send put request
        try {
            const res = await fetch(`/api/pets/${pet.pet_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pet: pet
                })
            });

            if (res.ok) {
                //if successful update the pet in the array to update ui
                setPets(pets => pets.map(p => {
                    if (p.pet_id === pet.pet_id) {
                        return pet;
                    }
                    return p;
                }));
            } else {
                throw new Error("Could not update pet.")
            }
        } catch (error) {
            setError({ isError: true, errorMsg: error.message })
        }

        //set the currently editing pet to null
        setCurrentlyEditingPet(null);
    }

    async function handleAddNewPet(pet) {
        //send post request
        try {
            const res = await fetch(`/api/pets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pet: pet
                })
            });

            if (res.ok) {
                const newPet = await res.json();
                //if successful update the pet in the array to update ui
                setPets(pets => [newPet, ...pets]);
            } else {
                throw new Error("Could not add new pet.")
            }
        } catch (error) {
            setError({ isError: true, errorMsg: error.message })
        }

        //set the currently editing pet to null
        setAddingNewPet(false);
    }

    const handleMedia = (event) => {
        const file = event.target.files[0];

        if (file) {
            if (file.type === "image/jpeg" || file.type === "image/png") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const imageBlob = new Blob([reader.result], { type: file.type });
                    setImageBlob(imageBlob);
                    const url = URL.createObjectURL(new Blob([imageBlob]));
                    setPfpUrl(url);
                };
                reader.readAsArrayBuffer(file);
            }
        }
    };

    async function handleSaveProfile() {
        const formData = new FormData();
        formData.append("file", imageBlob);
        try {
            const res = await fetch(`/api/user/profile-picture`, {
                method: "PUT",
                body: formData
            });
            if (!res.ok) {
                throw new Error("Could not edit profile picture.")
            }
        } catch (error) {
            setError({ isError: true, errorMsg: error.message })
        }
    }

    return (
        <div>

            <AuthenticatedHeader />
            <div className="grid grid-cols-3 lg:grid-cols-4 h-screen">
                <div className="col-span-1 flex flex-col items-center mt-[15vh] gap-2">
                    <div className="rounded-full bg-gray-600 h-40 w-40 relative">
                        {
                            isEditingProfile ?
                                <div className="h-full w-full flex items-center justify-center">
                                    <input
                                        type="file"
                                        onChange={(e) => handleMedia(e)}
                                        className="text-lg opacity-0 absolute inset-0 cursor-pointer"
                                        accept=".jpeg, .jpg, .png"
                                    />
                                    <div className="p-1 italic text-center text-gray-300 text-xl">
                                        click here to select picture
                                    </div>
                                </div>
                                :
                                pfpUrl ?
                                    <img src={pfpUrl} className="text-center h-full w-full object-cover rounded-full" />
                                    :
                                    <div className="p-1 text-center h-full w-full flex items-center justify-center text-gray-300 text-xl">
                                        No Profile Picture
                                    </div>
                        }
                    </div>
                    <div className="bg-gray-100 p-2 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg">
                        {user.first_name} {user.last_name}
                    </div>
                    <div className="bg-gray-100 p-2 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg">
                        @{user.username}
                    </div>
                    <div className="bg-gray-100 p-2 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg">
                        {user.pet_count} pets
                    </div>
                    <div className="bg-gray-100 p-2 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg">
                        {user.post_count} posts
                    </div>
                    {
                        isEditingProfile ?
                            <button onClick={handleSaveProfile} className="m-1 px-5 py-1 text-l font-bold text-white rounded-lg drop-shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800">
                                Save
                            </button>
                            :
                            <button onClick={() => setIsEditingProfile(true)} className="m-1 px-5 py-1 text-l font-bold text-white rounded-lg drop-shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800">
                                Edit
                            </button>
                    }
                </div>
                <div className="relative px-4 overflow-y-auto content-center col-span-2 lg:col-span-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-l-[20px] border-l-4">
                    <div className="lg:w-4/5 lg:m-auto">
                        <div className="m-5">
                            <div className="flex justify-between items-center border-b-4 border-gray-300 mb-3">
                                <div className="text-xl font-bold">Pets</div>
                                <button onClick={() => setAddingNewPet(true)} className="m-1 px-5 py-1 text-l font-bold text-white rounded-lg drop-shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800">
                                    Add Pet
                                </button>
                            </div>
                            {
                                addingNewPet ? <EditablePetCard pet={undefined} handleCancel={() => setAddingNewPet(false)} handleSave={handleAddNewPet} /> : ''
                            }
                            {
                                pets.length > 0 ?
                                    pets.map(pet => {
                                        if (pet.pet_id === currentlyEditingPet) {
                                            return <EditablePetCard key={pet.pet_id} pet={pet} handleCancel={handleCancelEdit} handleSave={handleUpdate} />
                                        } else {
                                            return <PetCard key={pet.pet_id} pet={pet} handleEdit={handleEdit} handleDelete={handleDelete} canEdit={currentlyEditingPet === null} />
                                        }
                                    })
                                    :
                                    !addingNewPet ?
                                        <div className="text-gray-600 italic">no pets</div>
                                        :
                                        ''
                            }
                        </div>
                        <div className="m-5">
                            <div className="text-xl font-bold flex justify-between border-b-4 border-gray-300 mb-3">
                                Posts
                            </div>
                            {
                                posts.length > 0 ?
                                    posts.map(post => <PostCard key={post.post_id} post={post} />)
                                    :
                                    <div className="text-gray-600 italic">no posts</div>
                            }
                        </div>
                    </div>
                    {
                        error.isError ?
                            //error toast
                            <div className="fixed m-5 bottom-0 right-0">
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex align-center" role="alert">
                                    <span className="block sm:inline"><strong className="font-bold">An Error Occurred! </strong>{error?.errorMsg}</span>
                                    <span onClick={() => setError({ isError: false })}>
                                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                                    </span>
                                </div>
                            </div>
                            :
                            ''
                    }
                </div>
            </div >
        </div>
    );
}

export default Profile;