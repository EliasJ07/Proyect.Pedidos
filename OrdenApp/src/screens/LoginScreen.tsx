import { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../contexts/AuthContext";
import { i18n } from "../contexts/LanguageContext";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login, isAllowed } = useAuth();

  const handleOnLogin = () => {
    try {

      const allowed = login(email, password);
      if (allowed) {
        navigation.navigate("Tabs", { screen: "Home" })
      } else {
        Alert.alert("Credenciales Incorrectas", "Por favor ingrese correo .gmail");
      }

    } catch (error: any) {
      Alert.alert(error.message)
    }
  }

  const handleOnLogout = () => {
    alert("Alerta logout desde app");
  }

  // NUEVA FUNCION PARA IR A REGISTRO
  const handleGoToRegisterScreen = () => {
    navigation.navigate("Register");
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text>{i18n.t('signIn')}</Text>

        <View style={styles.buttonsWrapper}>

          <CustomInput
            placeholder={i18n.t('enterEmail')}
            onChange={setEmail}
            value={email}
            typeInput={'email'}
          />

          <CustomInput
            placeholder={'Password'}
            onChange={setPassword}
            value={password}
            typeInput={'password'}
          />

          <CustomButton
            title={'Login'}
            onClick={handleOnLogin}
          />

          <CustomButton
            title={i18n.t('exit')}
            onClick={handleOnLogout}
            variant={'secondary'}
          />

          {/* HIPERVINCULO REGISTRAR */}
          <TouchableOpacity onPress={handleGoToRegisterScreen}>
            <Text style={styles.registerText}>
              ¿No tienes cuenta? Registrarse
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: "80%",
    height: "80%",
    borderRadius: 15,
    backgroundColor: '#f7ece7',
  },
  buttonsWrapper: {
    marginTop: 15,
    height: "35%",
    alignItems: "center",
    justifyContent: "space-around",
  },

  // ESTILO DEL LINK
  registerText: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline"
  }
});