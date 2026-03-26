import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Animated } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { supabase } from "../supabase/supabase";

/* REDUX */
import { useDispatch, useSelector } from "react-redux";
import { login as loginRedux } from "../store/authSlice";
import { RootState, AppDispatch } from "../store/store";

/* CONTEXT */
import { i18n } from "../contexts/LanguageContext";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

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

  const handleOnLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Ingrese correo y contraseña");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      setLoading(false);

      if (error || !data) {
        Alert.alert("Credenciales incorrectas", "Correo o contraseña incorrectos");
        return;
      }

      // Guardar solo datos serializables en Redux
      dispatch(
        loginRedux({
          id: data.id,             // ✅ number o string
          email: data.email,       // ✅ string
          name: data.name || ""    // opcional
        })
      );

      Alert.alert("Bienvenido", data.email);

      navigation.navigate("Tabs", { screen: "Home" });

    } catch (err: any) {
      setLoading(false);
      Alert.alert("Error", "No se pudo iniciar sesión");
      console.log(err);
    }
  };

  const handleOnLogout = () => {
    Alert.alert("Logout", "Alerta logout desde app");
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
              transform: [{ scale: logoScale }],
            },
          ]}
        />

        <Text style={styles.title}>{i18n.t("signIn")}</Text>

        <View style={styles.buttonsWrapper}>
          <CustomInput
            placeholder={i18n.t("enterEmail")}
            value={email}
            onChange={setEmail}
            typeInput="email"
          />

          <CustomInput
            placeholder="Password"
            value={password}
            onChange={setPassword}
            typeInput="password"
          />

          <CustomButton
            title={loading ? "Iniciando..." : "Login"}
            onPress={handleOnLogin}
            disabled={loading}
          />

          <CustomButton
            title={i18n.t("exit")}
            onPress={handleOnLogout}
            variant="secondary"
          />

          <TouchableOpacity onPress={handleGoToRegisterScreen}>
            <Text style={styles.registerText}>
              ¿No tienes cuenta? <Text style={styles.link}>Registrarse</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {auth.isLoggedIn && (
          <Text style={styles.loggedInText}>
            Usuario logueado: {auth.user?.email}
          </Text>
        )}
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
    padding: 20,
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
    elevation: 5,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  buttonsWrapper: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 15,
  },
  registerText: {
    marginTop: 15,
    color: "#555",
    fontSize: 14,
  },
  link: {
    color: "#2E86DE",
    fontWeight: "600",
  },
  loggedInText: {
    marginTop: 20,
    color: "green",
    fontSize: 16,
    textAlign: "center",
  },
});