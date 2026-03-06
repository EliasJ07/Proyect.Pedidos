import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from '../screens/RegisterScreen';
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
    Login: undefined,
    Register: undefined,
    Tabs: { email: string } | undefined,
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
                name="Tabs"
                component={TabsNavigator}
            />

        </Stack.Navigator>
    );
}