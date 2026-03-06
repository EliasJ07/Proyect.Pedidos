import { createContext, useContext, useState } from "react";

type User = {
    id?: string,
    email: string,
    token?: string, 
} | null;

type AuthContextType = {
    user:  User;
    isAllowed: boolean;
    // login: (email: string, password: string)=>Promise<void>;
    login: (email: string, password: string) => boolean;
    // register: (email: string, password: string)=>Promise<void>;
    // register: (email: string, password: string)=>boolean;
    logout: ()=>void;
}
// 1. Definir el contexto
const AuthContext = createContext<AuthContextType | null>(null)

//2. Utilizar el contexto: Hook Personalizado 
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error ('useAuth debe usarse dentro de AuthProvider');
    return (context);
};
//3. Definicion de Context Provider 
export const AuthProvider = ({children}: {children: React.ReactNode} ) => {
    const [user, setUser] = useState<User>(null); 
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    const login = (email: string, password: string) => {
        const allowed = email.endsWith('.edu');
        if (allowed){
            setUser({email})
            setIsAllowed(allowed)
        }
        return allowed;
    };
    const logout = () =>{
        setUser(null);
        setIsAllowed(false);
    };

    return (
        <AuthContext.Provider value={{user, isAllowed, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
