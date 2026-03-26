import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Image,
} from "react-native";
import CustomButton from "../components/CustomButton";

/* Expo Document & Image Picker */
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

/* REDUX */
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { updateTrabajo, TrabajoItem } from "../store/trabajosSlice";

/* SUPABASE */
import { supabase } from "../supabase/supabase";

export default function TrabajoScreen() {
  const trabajos = useSelector((state: RootState) => state.trabajos.items);
  const dispatch = useDispatch<AppDispatch>();

  // Expandir / Contraer
  const toggleExpand = (id: string) => {
    const trabajo = trabajos.find((t) => t.id === id);
    if (!trabajo) return;
    dispatch(updateTrabajo({ id, changes: { expanded: !trabajo.expanded } }));
  };

  // Contador
  const incrementQuantity = (id: string) => {
    const trabajo = trabajos.find((t) => t.id === id);
    if (!trabajo) return;
    dispatch(updateTrabajo({ id, changes: { quantity: trabajo.quantity + 1 } }));
  };

  const decrementQuantity = (id: string) => {
    const trabajo = trabajos.find((t) => t.id === id);
    if (!trabajo || trabajo.quantity <= 0) return;
    dispatch(updateTrabajo({ id, changes: { quantity: trabajo.quantity - 1 } }));
  };

  // Notas
  const updateNotes = (id: string, text: string) => {
    dispatch(updateTrabajo({ id, changes: { notes: text } }));
  };

  
    // Seleccionar PDF usando Expo DocumentPicker
  const seleccionarPDF = async (id: string) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        dispatch(updateTrabajo({ id, changes: { pdfAttached: true, pdfName: file.name ?? "archivo.pdf" } }));
        Alert.alert("PDF adjuntado", `Archivo: ${file.name ?? "archivo.pdf"}`);
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo adjuntar el PDF");
    }
  };


  // Foto desde galería
  const seleccionarFoto = async (id: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la galería de fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5, allowsEditing: true });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      dispatch(updateTrabajo({ id, changes: { photoUri: result.assets[0].uri } }));
    }
  };

  // Foto con cámara
  const tomarFoto = async (id: string) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.5, allowsEditing: true });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      dispatch(updateTrabajo({ id, changes: { photoUri: result.assets[0].uri } }));
    }
  };

  const agregarFoto = (id: string) => {
    Alert.alert("Agregar Foto", "Selecciona fuente", [
      { text: "Cámara", onPress: () => tomarFoto(id) },
      { text: "Galería", onPress: () => seleccionarFoto(id) },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  // Guardar / Enviar a Supabase
  const handleGuardar = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Error", "Usuario no autenticado");
        return;
      }

      const dataToInsert = trabajos.map(t => ({
        label: t.label ?? "",
        quantity: t.quantity ?? 0,
        notes: t.notes ?? "",
        pdf_attached: t.pdfAttached ?? false,
        pdf_name: t.pdfName ?? "",
        photo_url: t.photoUri ?? "",
        user_id: user.id, // string o number serializable
      }));

      const { error } = await supabase.from("trabajos").insert(dataToInsert);

      if (error) throw error;

      Alert.alert("Éxito", "Datos guardados correctamente");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  // Render item
  const renderItem = ({ item }: { item: TrabajoItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.itemHeader}>
        <Text style={styles.itemLabel}>{item.label}</Text>
        <Text style={styles.itemQuantity}>{item.quantity > 0 ? item.quantity : ""}</Text>
      </TouchableOpacity>

      {item.expanded && (
        <View style={styles.expandedContainer}>
          {/* Contador */}
          <View style={styles.counterWrapper}>
            <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.counterButton}>
              <Text style={styles.counterText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterNumber}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.counterButton}>
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Notas */}
          <TextInput
            style={styles.notesInput}
            placeholder="Agregar notas..."
            value={item.notes}
            onChangeText={text => updateNotes(item.id, text)}
            multiline
          />

          {/* PDF */}
          <View style={{ marginTop: 10 }}>
            <CustomButton
              title={item.pdfAttached ? `PDF: ${item.pdfName}` : "Seleccionar PDF"}
              onPress={() => seleccionarPDF(item.id)}
            />
          </View>

          {/* Foto */}
          <View style={{ marginTop: 10 }}>
            <CustomButton title="Agregar Foto" onPress={() => agregarFoto(item.id)} />
          </View>

          {item.photoUri && (
            <Image
              source={{ uri: item.photoUri }}
              style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
            />
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trabajos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {/* Guardar */}
      <View style={{ marginTop: 10 }}>
        <CustomButton title="Guardar / Enviar" onPress={handleGuardar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f2f4f7" },
  itemContainer: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 15, padding: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemLabel: { fontSize: 18, fontWeight: "500" },
  itemQuantity: { fontSize: 16, color: "#2E86DE", fontWeight: "bold" },
  expandedContainer: { marginTop: 10 },
  counterWrapper: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  counterButton: { backgroundColor: "#2E86DE", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 },
  counterText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  counterNumber: { fontSize: 18, fontWeight: "bold", marginHorizontal: 15 },
  notesInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, minHeight: 60, textAlignVertical: "top", backgroundColor: "#f9f9f9" },
});