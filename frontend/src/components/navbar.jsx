import { useContext } from "react";
import { studContext } from "../context/studentContext";
import axios from "axios";

export default function Navbar() {

    const {name,setName, setEmail} = useContext(studContext);

    async function logout(){
        axios.post('/logout').then(()=> {
            setName(()=> "");
            setEmail(()=> "");
            window.location.reload();
        })
    }

    return(
        <div className="w-full bg-gray-700 flex justify-between items-center px-12 py-2 m-0">
            <div>
                <h2 className="text-white">Present Sir</h2>
            </div>
            <div className="flex justify-evenly gap-4">
                <div>
                    <button className="w-full bg-blue-400 rounded-lg p-1 px-2 m-1 text-white">
                        Profile
                    </button>
                </div>
                <div>
                    <button onClick={logout} className="w-full bg-red-400 rounded-lg p-1 m-1 text-white">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}