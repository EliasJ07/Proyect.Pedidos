import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import { createContext, useContext, useEffect, useState } from "react";

type Language = 'es' | 'en' | 'de' | 'fr';

type LanguageContextType = {
    language: Language;
    changeLanguage: (lng: Language) => void;
};

//Configuracion de libreria de traducciones, paso 1: definicion de diccionario
const translations = {
    en: {signIn: 'Sign In', 
        welcome: 'Welcome',
        enterEmail: 'Please fill your email',
        exit: 'Exit App'
    },
    es: {signIn: 'Iniciar Sesion', 
        welcome: 'Bienvenido',
        enterEmail: 'Ingrese su correo',
        exit: 'Salir'
    },
    de: {signIn: 'Anmelden',
        welcome: 'Wilkommen',
    },
    fr: {
        signIn: 'Connexion',
    }
}; 

//paso 2: crear una instancia de la libreria de traducciones
const i18n = new I18n(translations);

//paso 3: definir idioma por defecto
i18n.locale = 'es';
i18n.defaultLocale = 'en';
i18n.enableFallback = true;


// 1. Definir el contexto 
const LanguageContext = createContext<LanguageContextType | null>(null);

//2. Utilizar el contexto: Hook Personalizado 
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage debe suarse dentro de LanguageProvider');
    return (context);
}

//3. Definicion de Context Provider
export const LanguageProvider = ({children}: {children: React.ReactNode}) => {
    const [language, setLanguage] = useState<Language>("es");

    useEffect(()=> {
        const loadLanguage = async () =>{
            const storedLanguage = await AsyncStorage.getItem("language");
            if (storedLanguage){
                setLanguage(storedLanguage as Language);
                i18n.locale = storedLanguage;
            }else{
                i18n.locale = i18n.defaultLocale;
            }
        };
        loadLanguage();
    }, [])

    const changeLanguage = async (lng: Language) => {
        setLanguage(lng);
        i18n.locale = lng;
        await AsyncStorage.setItem("language", lng);
    }
    
    return(
        <LanguageContext.Provider value={{language, changeLanguage}}>
            {children}
        </LanguageContext.Provider>
    )
}

export {i18n}