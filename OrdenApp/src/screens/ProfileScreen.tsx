import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { supabase } from "../supabase/supabase";
import { logout, setUser } from "../store/authSlice";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const userRedux = useSelector((state: RootState) => state.auth.user);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Obtener usuario actual desde Supabase si Redux está vacío
  const fetchCurrentUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user?.email) {
        console.log("No hay usuario logueado", error);
        return null;
      }
      dispatch(setUser({ email: data.user.email }));
      return data.user;
    } catch (err) {
      console.log("Error fetchCurrentUser:", err);
      return null;
    }
  };

  // Obtener datos del perfil
  const getUserData = async () => {
    setLoading(true);
    try {
      const currentUser = userRedux || (await fetchCurrentUser());
      if (!currentUser?.email) {
        Alert.alert("Error", "No hay usuario logueado");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("firstName,lastName,email,phone,avatar_url")
        .eq("email", currentUser.email)
        .single();

      if (error) {
        console.log("Error obteniendo perfil:", error);
        Alert.alert("Error", "No se pudo cargar el perfil");
        setLoading(false);
        return;
      }

      setProfile(data);

      // Obtener URL pública de la imagen si existe
      if (data.avatar_url) {
        const { data: signedData, error: signedError } = await supabase.storage
          .from("avatars")
          .createSignedUrl(data.avatar_url, 60);
        if (!signedError) setPhotoUrl(signedData.signedUrl);
      }

      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
      });
    } catch (err) {
      console.log("Error inesperado al cargar perfil:", err);
      Alert.alert("Error", "No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  // Refrescar perfil cuando la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [userRedux])
  );

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    navigation.navigate("Login");
  };

  // Seleccionar imagen
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setPhotoUrl(uri);
      uploadPhoto(uri);
    }
  };

  // Subir foto usando expo-file-system y signed URL
 const uploadPhoto = async (uri: string) => {
  const currentUser = userRedux || (await fetchCurrentUser());
  if (!currentUser?.email) return;

  try {
    // Leer archivo como base64 (sin usar EncodingType)
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
    const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: "image/png" });

    // Nombre seguro para el archivo
    const fileName = `avatars/${currentUser.email.replace(/[@.]/g, "_")}.png`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, blob, { upsert: true });
    if (uploadError) throw uploadError;

    // Crear signed URL para mostrar en la app
    const { data: signedData, error: signedError } = await supabase.storage.from("avatars").createSignedUrl(fileName, 60);
    if (signedError) throw signedError;

    setPhotoUrl(signedData.signedUrl);

    // Guardar nombre del archivo en la tabla users
    await supabase.from("users").update({ avatar_url: fileName }).eq("email", currentUser.email);

  } catch (err) {
    console.log("Error uploadPhoto:", err);
    Alert.alert("Error", "No se pudo subir la foto");
  }
};
  // Guardar cambios en perfil
  const updateUserData = async () => {
    if (!form.firstName || !form.lastName) {
      Alert.alert("Error", "Nombre y apellido son obligatorios");
      return;
    }

    const currentUser = userRedux || (await fetchCurrentUser());
    if (!currentUser?.email) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .update({ firstName: form.firstName, lastName: form.lastName, phone: form.phone })
        .eq("email", currentUser.email)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setForm({ firstName: data.firstName, lastName: data.lastName, phone: data.phone });
      setIsEditing(false);
      Alert.alert("Éxito", "Perfil actualizado");
    } catch (err) {
      console.log("Error updateUserData:", err);
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E86DE" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}>
      <View style={styles.card}>
        <TouchableOpacity onPress={pickImage} style={{ marginTop: 40 }}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{profile?.firstName?.charAt(0) || "U"}</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
        <Text style={styles.email}>{profile?.email}</Text>

        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={{ color: "#2E86DE", marginTop: 15, fontWeight: "bold" }}>
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </Text>
        </TouchableOpacity>

        {isEditing ? (
          <>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput style={styles.input} value={form.firstName} onChangeText={text => setForm({ ...form, firstName: text })} />
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput style={styles.input} value={form.lastName} onChangeText={text => setForm({ ...form, lastName: text })} />
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput style={styles.input} value={form.phone} onChangeText={text => setForm({ ...form, phone: text })} />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={updateUserData}>
              <Text style={styles.logoutText}>Guardar cambios</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{profile?.firstName}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Apellido</Text>
              <Text style={styles.value}>{profile?.lastName}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>{profile?.phone || "No registrado"}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Correo</Text>
              <Text style={styles.value}>{profile?.email}</Text>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { width: "100%", alignItems: "center" },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  avatarText: { fontSize: 32, fontWeight: "bold", color: "#2E86DE" },
  name: { fontSize: 22, fontWeight: "bold", color: "#333", marginTop: 10 },
  email: { fontSize: 14, color: "#777", marginBottom: 10 },
  infoBox: { width: "90%", backgroundColor: "#fff", padding: 15, borderRadius: 12, marginTop: 15, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  label: { fontSize: 12, color: "#999", marginBottom: 5 },
  value: { fontSize: 16, fontWeight: "600", color: "#333" },
  input: { borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 5, fontSize: 16 },
  saveButton: { marginTop: 20, backgroundColor: "#2E86DE", width: "90%", padding: 15, borderRadius: 10, alignItems: "center" },
  logoutButton: { marginTop: 30, backgroundColor: "#FF4D4D", width: "90%", padding: 16, borderRadius: 12, alignItems: "center" },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});