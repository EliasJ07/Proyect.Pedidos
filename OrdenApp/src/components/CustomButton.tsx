import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: CustomButtonProps) {
  const styles = getStyles(variant);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabled, // aplica estilo si está deshabilitado
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading} // evita pulsar mientras carga o está deshabilitado
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "white" : "#66442e"}
        />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (variant: "primary" | "secondary") =>
  StyleSheet.create({
    container: {
      paddingVertical: 15,
      alignItems: "center",
      width: "80%",
      backgroundColor: variant === "primary" ? "#66442e" : "white",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#f3f4f6",
      alignSelf: "center",
      marginTop: 10,
    },
    text: {
      color: variant === "primary" ? "white" : "black",
      fontSize: 18,
      fontWeight: "500",
    },
    disabled: {
      opacity: 0.5, // botón visualmente deshabilitado
    },
  });