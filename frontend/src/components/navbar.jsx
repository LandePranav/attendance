export default function Navbar() {
    return(
        <div className="w-full bg-gray-400 flex justify-between items-center px-4">
            <div>
                <h2>Present Sir</h2>
            </div>
            <div className="flex justify-evenly gap-2">
                <div>
                    <button className="w-full bg-blue-400 rounded-lg p-1 px-2 m-1 text-white">
                        Profile
                    </button>
                </div>
                <div>
                    <button className="w-full bg-red-400 rounded-lg p-1 m-1 text-white">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}