import { createContext, useState } from "react";

export const studContext = createContext();

export default function StudentContext({children}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    

    return(
        <studContext.Provider value={{name, setName, email, setEmail}} >
            {children}
        </studContext.Provider>
    )
}