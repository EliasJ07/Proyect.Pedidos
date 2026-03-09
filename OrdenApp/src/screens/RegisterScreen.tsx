import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image, Animated } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { i18n } from "../contexts/LanguageContext";

export default function RegisterScreen({ navigation }: any) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Animación del logo
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    Alert.alert("Usuario creado correctamente");
    navigation.navigate("Login");
  };

  const handleGoToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Animated.Image
          source={require("../../assets/images/logo.png")}
          style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
        />

        <Text style={styles.title}>Ingresa tus datos
        </Text>

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
              ¿Ya tienes cuenta? <Text style={styles.link}>Iniciar sesión</Text>
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
    backgroundColor: "#f2f4f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },

  card: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    padding: 25,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5
  },

  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginBottom: 15
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333"
  },

  buttonsWrapper: {
    width: "100%",
    alignItems: "center",
    gap: 15
  },

  loginText: {
    marginTop: 15,
    color: "#555",
    fontSize: 14
  },

  link: {
    color: "#2E86DE",
    fontWeight: "600"
  }

});