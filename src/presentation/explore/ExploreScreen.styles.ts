import { StyleSheet, ColorSchemeName } from "react-native";
import { palette } from "../Themes";


export const makeExploreStyles = (scheme: ColorSchemeName) => {
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
    search_contaner: {
      flexDirection: "row",
      marginBottom: 24,
      gap: 8,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: paletteTheme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      color: paletteTheme.text,
    },
    search_button: {
      flex: 0.4,
      paddingVertical: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: paletteTheme.higlighted,
      borderRadius: 8
    },
    search_button_text: {
      color: paletteTheme.inverted_text,
      fontWeight: "600",
      fontSize: 15,
    },
    error_text: {
      color: paletteTheme.text,
      fontSize: 14,
    },
    results_container: {
      flex: 1,
    },
    results_title: {
      fontSize: 16,
      color: paletteTheme.text,
      fontWeight: "600",
      paddingBottom: 12,
    },
    results_list: {
      gap: 8,
    },
    location_card: {
      padding: 14,
      borderWidth: 1,
      borderColor: paletteTheme.border,
      borderRadius: 8,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    location_title: {
      fontSize: 14,
      color: paletteTheme.text,
      fontWeight: "600",
    },
    location_country: {
      fontSize: 12,
      color: paletteTheme.secondary_text,
      marginTop: 4,
    },
    no_result_text: {
      fontSize: 14,
      color: paletteTheme.secondary_text,
      textAlign: "center",
      marginTop: 24,
    },
    loading_indication: {
      marginTop: 16,
    },
  });
};
