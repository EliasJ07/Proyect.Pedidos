import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // para icono + (asegúrate de tener expo/vector-icons)

export default function HomeScreen() {
  const { changeLanguage, language } = useLanguage();
  const auth = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<any>();

  const goToTrabajo = () => {
    navigation.navigate("Trabajo"); // redirige a la pantalla Trabajo
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        {i18n.t('welcome')}, {auth.user?.email || "Invitado"}
      </Text>

      <Text style={styles.info}>Tu idioma actual es: {language}</Text>

      <View style={styles.buttonsWrapper}>
        <Button title="EN" onPress={() => changeLanguage('en')} />
        <Button title="ES" onPress={() => changeLanguage('es')} />
        <Button title="DE" onPress={() => changeLanguage('de')} />
        <Button title="FR" onPress={() => changeLanguage('fr')} />
      </View>

      {/* Botón flotante + */}
      <TouchableOpacity style={styles.fab} onPress={goToTrabajo}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    marginBottom: 25,
    color: "#555",
    textAlign: "center",
  },
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    gap: 10,
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#2E86DE",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fabText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 2,
  },
});