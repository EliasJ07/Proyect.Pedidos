import { NavigationContainer } from '@react-navigation/native'
import StackNavigator from './src/navigation/StackNavigator'
import { AuthProvider } from './src/contexts/AuthContext'
import { LanguageProvider } from './src/contexts/LanguageContext'
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";


import { Provider } from 'react-redux'
import { store } from './src/store/store'


export default function App() {

  return (
    <Provider store={store}>
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </Provider>
  )
}