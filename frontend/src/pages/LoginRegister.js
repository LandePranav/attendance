import axios from "axios";
import { useContext, useState } from "react";
import { studContext } from "../context/studentContext";
import { useNavigate } from "react-router-dom";

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const {name : loggedInName, email: loggedInEmail, setName: setLoggedInName, setEmail: setLoggedInEmail} = useContext(studContext);
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        try {
            if(isLogin){
                const res = await axios.post("/login", {email, password});
                console.log(res.data);
                if(res.data.name){
                    setLoggedInName(() => res.data.name);
                    setLoggedInEmail(() => res.data.email);
                    navigate('/home');
                }
            }else{
                const res = await axios.post("/register", {name, email, password});
                console.log(res.data);
                if(res.data.name){
                    setLoggedInName(() => res.data.name);
                    setLoggedInEmail(() => res.data.email);
                    navigate('/home');
                }
            }
            
        } catch (error) {
            console.error("Something wrong with server: ", error)
        }
    }

    return(
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-[400px] p-8  border border-black rounded-lg ">
                <h1 className="text-center mb-3">
                    Present Sir
                </h1>
                <h2 className="text-center">
                    {isLogin ? ("Login") : ("Register")}
                </h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <label htmlFor="name">
                                Name
                            </label>
                            <br/>
                            <input 
                                type="text" 
                                name="name" 
                                value={name} 
                                onChange={(e)=> setName(e.target.value)}
                            />
                            <br/>
                        </>
                    )}
                    <label htmlFor="email">
                        Email
                    </label>
                    <br/>
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={(e)=> setEmail(e.target.value)}
                    />
                    <br/>
                    <label htmlFor="password">
                        Password
                    </label>
                    <br/>
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                    <br/>
                    
                    <button
                        type="submit"
                        className="bg-blue-400 w-full font-semibold rounded-lg px-2 py-1 mb-1"
                    >
                        {isLogin ? ("Login") : ("Register")}
                    </button>
                </form>

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="bg-blue-100 text-xs rounded-lg px-3 py-1 border border-gray-400"
                >
                    {isLogin ? (
                        <p>
                            "New? Register Here!"
                        </p>
                    ) : (
                        <p>
                            "Have account ? Sign In!"
                        </p>
                    )}
                </button>
            </div>
        </div>
    );
}