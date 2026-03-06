import { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { i18n } from "../contexts/LanguageContext";

export default function RegisterScreen({ navigation }: any) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {

    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    // aquí podrías guardar el usuario en base de datos
    Alert.alert("Usuario creado correctamente");

    // volver al login
    navigation.navigate("Login");
  };

  const handleGoToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Text style={styles.title}>Crear Cuenta</Text>

        <View style={styles.buttonsWrapper}>

          <CustomInput
            placeholder={"Correo electrónico"}
            onChange={setEmail}
            value={email}
            typeInput={"email"}
          />

          <CustomInput
            placeholder={"Contraseña"}
            onChange={setPassword}
            value={password}
            typeInput={"password"}
          />

          <CustomInput
            placeholder={"Confirmar contraseña"}
            onChange={setConfirmPassword}
            value={confirmPassword}
            typeInput={"password"}
          />

          <CustomButton
            title={"Registrar"}
            onClick={handleRegister}
          />

          <TouchableOpacity onPress={handleGoToLogin}>
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? Iniciar sesión
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
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "80%",
    height: "80%",
    borderRadius: 15,
    backgroundColor: "#f7ece7",
  },

  title: {
    textAlign: "center",
    fontSize: 22,
    marginTop: 20,
  },

  buttonsWrapper: {
    marginTop: 20,
    height: "40%",
    alignItems: "center",
    justifyContent: "space-around",
  },

  loginText: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
  }

});