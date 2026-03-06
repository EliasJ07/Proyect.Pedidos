import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
    Login: undefined,
    Tabs: {email: string},
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    return(
        <Stack.Navigator initialRouteName='Login' 
        screenOptions={{headerShown: true}}
        >
         
            <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{title:'Inicio de Sesion'}}
            />
            <Stack.Screen 
                name="Tabs"
                component = {TabsNavigator}
            />
        </Stack.Navigator>
    );
}