import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type TabsParamList = {
    Home: undefined;
    Profile: undefined;
}

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator () {
    return(
        <Tab.Navigator>
            <Tab.Screen 
                name = "Home"
                component={HomeScreen}
            />
            <Tab.Screen 
                name = "Profile"
                component = {ProfileScreen}
            />
        </Tab.Navigator>
    );
}
