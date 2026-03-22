import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
}: CustomButtonProps) {

  const styles = getStyles(variant);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {title}
      </Text>
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
  });