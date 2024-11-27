import { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/navbar";
import { studContext } from "../context/studentContext";
import { format, isSameDay } from "date-fns";
import axios from "axios";

export default function Home() {
    const { name, email } = useContext(studContext);
    const today = new Date();
    const videoRef = useRef(null);
    const [image, setImage] = useState(null);
    const [cameraOn, setCameraOn] = useState(false);
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
    }, [name]);

    async function handleSubmit(e) {
        // e.preventDefault();
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

    const startCamera = async () => {
        if (!videoRef.current) {
            console.error("Video element is not mounted yet.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setCameraOn(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const captureImage = () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setImage(imageData);
        stopCamera();
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setCameraOn(false);
    };

    return (
        <div className="w-screen">
            <Navbar />
            <div className="w-full p-2">
                <div className="w-full rounded-lg bg-slate-400 px-12 py-3">
                    <h2>Hello, {name}</h2>

                    {markedToday ? (
                        <>
                        <p className="text-sm font-semibold">
                        {format(today, "EEEE, MMMM do, yyyy")}
                        </p>
                        <h2 className="text-green-300 font-bold">
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
                                {!cameraOn && (
                                    <button
                                        type="button"
                                        onClick={() => setCameraOn(true)}
                                        className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                                    >
                                        Start Camera
                                    </button>
                                )}

                                {cameraOn && (
                                    <div>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            className="w-full h-auto rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={captureImage}
                                            className="bg-green-500 text-white px-4 py-1 mt-2 rounded-lg"
                                        >
                                            Capture Image
                                        </button>
                                    </div>
                                )}

                                {image && (
                                    <div className="mt-4">
                                        <p className="text-sm font-semibold">Captured Image:</p>
                                        <img src={image} alt="Captured" className="w-full h-auto rounded" />
                                    </div>
                                )}
                            </div>
                            <br />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-1 mt-4 rounded-lg"
                            >
                                Submit Attendance
                            </button>
                        </form>
                    )}
                </div>
                <div className="px-2 py-2">
                    <h2>Your Attendance History!</h2>
                    <div className="pt-2">
                        {history.length > 0 ? (
                            <div>
                                {history.map((record) => (
                                    <div key={record._id} className="flex justify-start gap-3">
                                        <img
                                            src={record.image}
                                            alt="user_img"
                                            className="w-6 h-6"
                                        />
                                        <p>{record.name}</p>
                                        <p>{record.email}</p>
                                        <p>{new Date(record.timestamp).toLocaleString()}</p>
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
