import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TrabajoScreen from "../screens/TrabajoScreen"; // importar TrabajoScreen

export type TabsParamList = {
    Home: undefined;
    Profile: undefined;
    Trabajo: undefined; // agregar trabajo
}

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator () {
    return(
        <Tab.Navigator screenOptions={{ headerShown: true }}>
            <Tab.Screen 
                name="Home"
                component={HomeScreen}
                options={{ title: "Inicio" }}
            />
            <Tab.Screen 
                name="Trabajo"
                component={TrabajoScreen}
                options={{ title: "Trabajo" }}
            />
            <Tab.Screen 
                name="Profile"
                component={ProfileScreen}
                options={{ title: "Perfil" }}
            />
        </Tab.Navigator>
    );
}