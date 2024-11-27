import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const studContext = createContext();

export default function StudentContext({children}) {
const [name, setName] = useState("");
const [email, setEmail] = useState("");

useEffect(()=> {
        try {
            axios.post('/persist').then(res => {
                    if(res?.data?.name){
                        setName(() => res.data.name);
                        setEmail(() =>  res.data.email);
                    }
            })
        } catch (error) {
            console.log("Err in fetching login detail from token: ", error)
        }
}, []);

return(
    <studContext.Provider value={{name, setName, email, setEmail}} >
        {children}
    </studContext.Provider>
)
}