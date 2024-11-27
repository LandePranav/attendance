import { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/navbar";
import { studContext } from "../context/studentContext";
import { format, isSameDay } from "date-fns";
import axios from "axios";
import Webcam from 'react-webcam';

export default function Home() {
    const { name, email } = useContext(studContext);
    const today = new Date();
    const [image, setImage] = useState(null);
    const webcamRef = useRef(null);
    const [history, setHistory] = useState([]);
    const [markedToday, setMarkedToday] = useState(false);

    useEffect(() => {
        if (!name) return;

        const fetchHistory = async () => {
            try {
                const res = await axios.post("/history/" + name);
                if (res.data && res.data.data) {
                    setHistory(res.data.data);
                    // Check if the first record matches today's date
                    if (res.data.data.length > 0) {
                        const firstEntryDate = new Date(res.data.data[0].timestamp);
                        if (isSameDay(firstEntryDate, today)) {
                            setMarkedToday(true);
                        }
                    }
                } else if (res.data.message) {
                    setHistory([]);
                }
            } catch (error) {
                console.log("Error in Getting History: ", error);
            }
        };
        fetchHistory();
    }, [handleSubmit]);

    const capture = () => {
        const capturedImage = webcamRef.current.getScreenshot() ;
        setImage(()=> capturedImage);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!image) {
            alert("Please capture an image first!");
            return;
        }

        try {
            const timestamp = new Date().toISOString();
            const response = await axios.post("/attendance", {
                name,
                email,
                image,
                timestamp,
            });
            console.log("Attendance recorded:", response.data);
            alert("Attendance recorded successfully!");
        } catch (error) {
            console.error("Error submitting attendance:", error);
            alert("Failed to record attendance. Try again.");
        }
        setImage(null);
    }

    return (
        <div className="w-screen">
            <Navbar />
            <div className="w-full p-2 px-12">
                <div className="w-full rounded-lg bg-slate-300 px-12 py-3">
                    <h2>Hello, {name}</h2>

                    {markedToday ? (
                        <>
                        <p className="text-sm font-semibold">
                        {format(today, "EEEE, MMMM do, yyyy")}
                        </p>
                        <h2 className="text-green-500 font-bold">
                            You have already marked today’s attendance!
                        </h2>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-lg font-mono mt-2">
                                Mark your attendance for Today
                            </h3>
                            <p className="text-sm font-semibold">
                                {format(today, "EEEE, MMMM do, yyyy")}
                            </p>
                            <div className="mt-4">

                                <Webcam 
                                    className="rounded-3xl mx-auto"
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width={400}
                                />
                                <div className="w-full mt-4 flex justify-center">
                                    <button type="button" className="rounded-lg text-white mx-auto px-2 py-1 bg-blue-500" onClick={capture}>
                                        Capture Photo
                                    </button>
                                </div>

                                {image && (
                                    <div className="mt-8 w-full mx-0 flex justify-evenly items-center">
                                        <div className="flex justify-start gap-10 items-center">
                                            <p className="text-black font-semibold">Captured Image</p>
                                            <img src={image} alt="Captured" className="w-[200px] h-[150px] rounded-xl" />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
                                        >
                                            Submit Attendance
                                        </button>
                                    </div>
                                )}
                            </div>
                            <br />
                            
                        </form>
                    )}
                </div>
                <div className="px-2 py-2 mt-6">
                    <h2 className="mb-3">Your Attendance History!</h2>
                    <div className="pt-2">
                        {history.length > 0 ? (
                            <div>
                                {history.map((record) => (
                                    <div key={record._id} className="flex justify-start items-center gap-3">
                                        <img
                                            src={record.image}
                                            alt="user_img"
                                            className="w-8 h-8 rounded-lg"
                                        />
                                        <p>{record.name}</p>
                                        <p>{record.email}</p>
                                        <p className="font-semibold">{format(record.timestamp, "EE, MMMM do, yyyy")}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No attendance history found !!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
