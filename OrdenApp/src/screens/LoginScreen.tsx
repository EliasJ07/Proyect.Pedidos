import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image, Animated } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../contexts/AuthContext";
import { i18n } from "../contexts/LanguageContext";

export default function LoginScreen({ navigation }: any) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

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

  const handleOnLogin = () => {
    try {
      const allowed = login(email, password);

      if (allowed) {
        navigation.navigate("Tabs", { screen: "Home" });
      } else {
        Alert.alert("Credenciales Incorrectas", "Por favor ingrese correo gmail");
      }

    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleOnLogout = () => {
    alert("Alerta logout desde app");
  };

  const handleGoToRegisterScreen = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Animated.Image
          source={require("../../assets/images/logo.png")}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }]
            }
          ]}
        />

        <Text style={styles.title}>{i18n.t("signIn")}</Text>

        <View style={styles.buttonsWrapper}>

          <CustomInput
            placeholder={i18n.t("enterEmail")}
            onChange={setEmail}
            value={email}
            typeInput={"email"}
          />

          <CustomInput
            placeholder={"Password"}
            onChange={setPassword}
            value={password}
            typeInput={"password"}
          />

          <CustomButton
            title={"Login"}
            onClick={handleOnLogin}
          />

          <CustomButton
            title={i18n.t("exit")}
            onClick={handleOnLogout}
            variant={"secondary"}
          />

          <TouchableOpacity onPress={handleGoToRegisterScreen}>
            <Text style={styles.registerText}>
              ¿No tienes cuenta? <Text style={styles.link}>Registrarse</Text>
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
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 15
  },

  registerText: {
    marginTop: 15,
    color: "#555",
    fontSize: 14
  },

  link: {
    color: "#2E86DE",
    fontWeight: "600"
  }

});