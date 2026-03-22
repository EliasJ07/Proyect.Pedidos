import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from '../screens/RegisterScreen';
import TabsNavigator from './TabsNavigator';
import ProfileScreen from '../screens/ProfileScreen';


export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Profile: undefined;
    Tabs: undefined; // ya no necesitamos pasar email, se obtiene desde Redux
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    return(
        <Stack.Navigator
            initialRouteName='Login'
            screenOptions={{headerShown: true}}
        >
            <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{title:'Inicio de Sesión'}}
            />

            <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{title:'Registro'}}
            />
            <Stack.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{title:'Perfil'}}
            />

            <Stack.Screen 
                name="Tabs"
                component={TabsNavigator}
                options={{headerShown: false}} // ocultamos header para las tabs
            />
        </Stack.Navigator>
    );
}