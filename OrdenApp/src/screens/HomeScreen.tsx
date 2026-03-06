import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, Button } from "react-native";
import { RootStackParamList } from "../navigation/StackNavigator";
import { TabsParamList } from "../navigation/TabsNavigator";
import { i18n, useLanguage } from "../contexts/LanguageContext";

type Props = NativeStackScreenProps<TabsParamList, 'Home'>;

export default function HomeScreen() {
    //destructuring de parametro de ruta: sacando una propiedad de un objeto
    // const {email} = route.params

    const { changeLanguage, language } = useLanguage();

    return (
        <View>
            <Text>{i18n.t('welcome')} home</Text>
            <Text>Tu idioma actual es: {language} </Text>
            <Button title="EN" onPress={() => changeLanguage('en')} />
            <Button title="ES" onPress={() => changeLanguage('es')} />
            <Button title="DE" onPress={() => changeLanguage('de')} />
            <Button title="FR" onPress={() => changeLanguage('fr')} />
        </View>
    );
}