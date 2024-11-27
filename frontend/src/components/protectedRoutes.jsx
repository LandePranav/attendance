import { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { studContext } from "../context/studentContext";
import axios from "axios";

export default function ProtectedRoutes() {
    const { name, setName, setEmail } = useContext(studContext);
    const [loading, setLoading] = useState(true); // Track the loading state

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await axios.post('/persist');
                if (res?.data?.name) {
                    setName(res.data.name);
                    setEmail(res.data.email);
                }
            } catch (error) {
                console.log("Err in fetching login detail from token: ", error);
            } finally {
                setLoading(false); // Set loading to false after check
            }
        };

        checkSession();
    }, [setName, setEmail]);

    if (loading) return null; // Optionally render a loading spinner or placeholder

    return name ? <Outlet /> : <Navigate to={"/"} />;
}
