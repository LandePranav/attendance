import { useContext } from "react";
import Navbar from "../components/navbar";
import { studContext } from "../context/studentContext";
import {format} from 'date-fns';

export default function Home() {
    const {name, email} = useContext(studContext);
    const today = new Date();

    async function handleSubmit(e){
        e.preventDefault();

    }

    return(
        <div className="w-screen">
            <Navbar />

            <div className="w-full p-2">
                <div className="w-full rounded-full bg-slate-400 px-8 py-3">
                    <h2>Hello, {name}</h2>
                    <h3 className="text-lg font-mono mt-2">
                        Mark your attendance for Today 
                    </h3>
                    <p className="text-sm font-semibold">
                        {format(today, "EEEE, MMMM do, yyyy")}
                    </p>
                    <form onSubmit={handleSubmit}>
                        
                    </form>
                </div>
                
            </div>


        </div>
    );
}