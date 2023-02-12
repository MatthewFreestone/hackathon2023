import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Admin = () => {
    const router = useRouter();
    const [token, setToken] = useState("");

    useEffect(() => {
        const c_token = localStorage.getItem("token");
        if (!c_token) {
            router.push("/signin");
        }
        else{
            setToken(c_token);
        }
    }, []);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const resetDatabase = () => {
        confirm("Are you sure you want to reset the database?");
        axios.get(`${BACKEND_URL}/resetdb`).then((res) => {
            console.log(res);
        });
    };
    const textUserMorning = () => {
        axios.get(`${BACKEND_URL}/sendmorningmessage?token=${token}`).then((res) => {
            console.log(res);
        });
    };

    const textUserEvening = () => {
        axios.get(`${BACKEND_URL}/sendeveningmessage?token=${token}`).then((res) => {
            console.log(res);
        });
    };
    
    return (
        <div className="flex flex-col gap-10 mx-auto w-1/2 m-5">
            <h1 className="text-3xl text-center">Admin</h1>
            <div className="flex flex-col gap-10">
                <button className="border bg-red-800 h-10" onClick={resetDatabase}>Reset Database</button>
                <button className="border bg-yellow-300 h-10 text-black" onClick={textUserMorning}>Text User Morning</button>
                <button className="border bg-purple-500 h-10" onClick={textUserEvening}>Text User Evening</button>
            </div>
        </div>
    );
};

export default Admin;