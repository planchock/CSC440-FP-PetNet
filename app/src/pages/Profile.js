import { useEffect, useState } from "react";

const postData = [
    {
        post_id: 1,
        user_id: 101,
        first_name: "John",
        last_name: "Doe",
        pet: "Dog",
        username: "johndoe123",
        caption: "Enjoying a day at the park with my furry friend!",
        media: "image.jpg",
        text: "Had a great time outdoors today.",
        group_name: "Pet Lovers"
    },
    {
        post_id: 2,
        user_id: 102,
        first_name: "Alice",
        last_name: "Smith",
        pet: "Cat",
        username: "alicesmith456",
        caption: "Lazy Sunday with my adorable cat.",
        media: "cat_video.mp4",
        text: "Cats make everything better.",
        group_name: "Cat Enthusiasts"
    },
    {
        post_id: 3,
        user_id: 103,
        first_name: "Bob",
        last_name: "Johnson",
        pet: "Hamster",
        username: "bobjohnson789",
        caption: "Meet my tiny ball of fur!",
        media: "hamster_photo.png",
        text: "Small pets, big joy.",
        group_name: "Tiny Pets Club"
    },
    {
        post_id: 4,
        user_id: 104,
        first_name: "Emma",
        last_name: "Davis",
        pet: "Parrot",
        username: "emmadavis010",
        caption: "Teaching my parrot new tricks!",
        media: "parrot_video.mov",
        text: "Birds are amazing learners.",
        group_name: "Bird Lovers United"
    },
    {
        post_id: 5,
        user_id: 105,
        first_name: "Charlie",
        last_name: "Miller",
        pet: "Fish",
        username: "charliemiller222",
        caption: "Aquarium adventures!",
        media: "fish_tank_photo.jpg",
        text: "Underwater beauty.",
        group_name: "Fish Enthusiasts"
    }
];

const petData = [
    {
        id: 1,
        name: "Buddy",
        type: "Dog",
        birthday: "2020-05-15",
        bio: "Friendly and energetic companion."
    },
    {
        id: 2,
        name: "Whiskers",
        type: "Cat",
        birthday: "2019-08-22",
        bio: "Loves to nap and play with yarn."
    },
    {
        id: 3,
        name: "Nibbles",
        type: "Hamster",
        birthday: "2021-02-10",
        bio: "Tiny and cute, enjoys running on the wheel."
    },
    {
        id: 4,
        name: "Rio",
        type: "Parrot",
        birthday: "2018-11-30",
        bio: "Colorful and talkative feathered friend."
    },
    {
        id: 5,
        name: "Finley",
        type: "Fish",
        birthday: "2022-04-05",
        bio: "Beautiful aquatic creature with vibrant scales."
    }
];

const PetCard = ({ pet, canEdit, handleEdit }) => {
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
                    <span className="font-semibold">Born: </span>{pet.birthday}
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p>
                    {pet.bio}
                </p>
                <button onClick={() => handleEdit(pet.id)} className={`${canEdit ? 'group-hover:visible' : ''} invisible scale-x-[-1] m-1 px-3 py-2 text-l font-bold text-white rounded-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800`}>&#9998;</button>
            </div>
        </div >
    );
}

const EditablePetCard = ({ pet, handleCancel, handleSave }) => {
    const [editedPet, setEditedPet] = useState({ ...pet });

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
                        value={editedPet.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                    />
                    <input
                        placeholder="type"
                        type="text"
                        className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedPet.type}
                        onChange={(e) => handleInputChange(e, 'type')}
                    />
                </div>
                <div>
                    <span className="font-semibold">Born: </span>
                    <input
                        type="date"
                        className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                        value={editedPet.birthday}
                        onChange={(e) => handleInputChange(e, 'birthday')}
                    />
                </div>
            </div>
            <textarea
                placeholder="bio"
                value={editedPet.bio}
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

    //{ isError: boolean, errorMsg: string }, errorMsg only required if isError is true
    const [error, setError] = useState();

    //get data on mount
    useEffect(() => {
        setError({ isError: false });

        const fetchData = async () => {
            try {
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

    async function handleUpdate(pet) {
        //send put request
        try {
            const res = await fetch(`/api/pets/${pet.id}`, {
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
                    if (p.id === pet.id) {
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

    return (
        <div className="grid grid-cols-3 lg:grid-cols-4 h-screen">
            <div className="col-span-1 flex flex-col items-center mt-[15vh] gap-2">
                <div className="rounded-full bg-gray-600 h-40 w-40">

                </div>
                <div className="bg-gray-100 p-2 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg">
                    Full Name
                </div>
                <div className="bg-gray-100 p-2 text-xl font-bold border-2 border-gray-900 rounded-lg drop-shadow-lg">
                    username
                </div>
            </div>
            <div className="pl-4 overflow-y-auto content-center col-span-2 lg:col-span-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-l-[20px] border-l-4">
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
                                    if (pet.id === currentlyEditingPet) {
                                        return <EditablePetCard key={pet.id} pet={pet} handleCancel={handleCancelEdit} handleSave={handleUpdate} />
                                    } else {
                                        return <PetCard key={pet.id} pet={pet} handleEdit={handleEdit} canEdit={currentlyEditingPet === null} />
                                    }
                                })
                                :
                                <div className="text-gray-600 italic">no pets</div>
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
            </div>
        </div >
    );
}

export default Profile;