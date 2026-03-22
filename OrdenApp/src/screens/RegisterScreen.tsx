// src/screens/RegisterScreen.tsx
import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Animated } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

/* REDUX opcional */
import { useDispatch } from "react-redux";
import { register as registerRedux, User } from "../store/authSlice";
import { AppDispatch } from "../store/store";

/* Supabase */
import { supabase } from "../supabase/supabase";

/* CONTEXT / i18n */
import { i18n } from "../contexts/LanguageContext";

export default function RegisterScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleOnRegister = async () => {
    // Validaciones básicas
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Ingrese un correo válido");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (phone) {
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(phone)) {
        Alert.alert("Error", "Ingrese un número de teléfono válido (7-15 dígitos)");
        return;
      }
    }

    try {
      // Guardar usuario en Supabase
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone || null,
            password: password,
          },
        ]);

      if (error) {
        Alert.alert("Error al registrar", error.message);
        return;
      }

      // Opcional: guardar en Redux
      const newUser: User = { email };
      dispatch(registerRedux(newUser));

      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.navigate("Login");

    } catch (err: any) {
      Alert.alert("Error", "No se pudo registrar el usuario");
      console.log(err);
    }
  };

  const handleGoToLoginScreen = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.Image
          source={require("../../assets/images/logo.png")}
          style={[
            styles.logo,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        />

        <Text style={styles.title}>Crea tu Cuenta</Text>

        <View style={styles.inputsWrapper}>
          <CustomInput placeholder="Nombre" value={firstName} onChange={setFirstName} typeInput="text" />
          <CustomInput placeholder="Apellido" value={lastName} onChange={setLastName} typeInput="text" />
          <CustomInput placeholder="Correo electrónico" value={email} onChange={setEmail} typeInput="email" />
          <CustomInput placeholder="Teléfono" value={phone} onChange={setPhone} typeInput="text" />
          <CustomInput placeholder="Contraseña" value={password} onChange={setPassword} typeInput="password" />
          <CustomInput placeholder="Confirmar contraseña" value={confirmPassword} onChange={setConfirmPassword} typeInput="password" />
        </View>

        <CustomButton title="Registrar" onPress={handleOnRegister} />

        <TouchableOpacity onPress={handleGoToLoginScreen}>
          <Text style={styles.loginText}>
            ¿Ya tienes cuenta? <Text style={styles.link}>Iniciar sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f7", alignItems: "center", justifyContent: "center", padding: 20 },
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
    elevation: 5,
  },
  logo: { width: 110, height: 110, resizeMode: "contain", marginBottom: 15 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#333" },
  inputsWrapper: { marginTop: 10, width: "100%", gap: 15 },
  loginText: { marginTop: 15, color: "#555", fontSize: 14 },
  link: { color: "#2E86DE", fontWeight: "600" },
});