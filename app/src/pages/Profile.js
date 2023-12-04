
const Profile = () => {

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
            <div className="col-span-2 lg:col-span-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-l-[20px] border-l-4">
                <div className="m-5">
                    <div className="flex justify-between  border-b-4 border-gray-300">
                        <div>Pets</div>
                        <button>+</button>
                    </div>
                    <div>
                        cards...
                    </div>
                </div>
                <div className="m-5">
                    <div className="flex justify-between  border-b-4 border-gray-300">
                        Posts
                    </div>
                    <div>
                        cards...
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;