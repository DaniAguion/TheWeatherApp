import { StyleSheet, ColorSchemeName } from "react-native";
import { palette } from "../Themes";


export const makeSavedStyles = (scheme: ColorSchemeName) => {
    const mode = scheme === "dark" ? "dark" : "light";
    const paletteTheme = palette[mode];

    return StyleSheet.create({
    screen_container: {
      flex: 1,
      paddingTop: 32,
      paddingHorizontal: 32,
      borderRadius: 8,
    },
    header_container: {
      alignItems: "flex-start",
      marginBottom: 32,
    },
    header_title: {
      fontSize: 18,
      color: paletteTheme.text,
      fontWeight: "600",
      marginBottom: 4,
    },
    header_desc: {
      fontSize: 16,
      color: paletteTheme.secondary_text,
    },
    loading_container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    locations_list: {
      paddingBottom: 24,
      gap: 12,
    },
    location_card: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 24,
      borderWidth: 1,
      borderColor: paletteTheme.border,
      borderRadius: 8,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    location_title: {
      flex: 1,
      marginRight: 16,
      fontSize: 18,
      color: paletteTheme.text,
      fontWeight: "600",
    },
    weather_container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 8
    },
    location_temp: {
      fontSize: 18,
      color: paletteTheme.text,
      fontWeight: "500"
    },
    location_weather_icon: {
      fontSize: 40,
    },
    empty_list: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    empty_list_text: {
      textAlign: "center",
      fontSize: 14,
      color: "#555555",
      marginBottom: 8,
    },
    empty_list_subtext: {
      textAlign: "center",
      fontSize: 13,
      color: "#7a7a7a",
    },
    error_text: {
      textAlign: "center",
      fontSize: 14,
      color: "#c00000",
    },
  });
};
