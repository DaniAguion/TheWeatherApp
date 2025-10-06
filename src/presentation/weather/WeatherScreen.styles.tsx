import { StyleSheet, Dimensions, ColorSchemeName } from "react-native";
import { palette } from "../Themes";


// Calculate item width for 5 columns with padding and margin for horizontal scrolling lists
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_H_PADDING = 16;
const CONTAINER_H_PADDING = 24;
const ELEMENTS_H_PADDING = 6;
const N_COLUMNS = 5;
const ITEM_WIDTH = (SCREEN_WIDTH - ((SCREEN_H_PADDING + CONTAINER_H_PADDING) * 2 + (ELEMENTS_H_PADDING * N_COLUMNS))) / N_COLUMNS;

// Common shadow style for cards



export const makeWeatherStyles = (scheme: ColorSchemeName) => {
  const mode = scheme === "dark" ? "dark" : "light";
  const paletteTheme = palette[mode];

  const cardShadow = {
    shadowColor: paletteTheme.shadowColor,
    borderColor: paletteTheme.border,
    borderWidth: 1,
    borderRadius: 8,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  };

  return StyleSheet.create({
    component_container: {
      paddingVertical: 12,
      paddingHorizontal: CONTAINER_H_PADDING,
    },
    current_container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: paletteTheme.secondary_bg,
    },
    current_main_group: {
      flex: 1.2,
      flexDirection: "column",
      justifyContent: "center",
    },
    current_sec_group: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingVertical: 16,
    },
    current_subgroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    location: {
      fontSize: 20,
      fontWeight: "600",
      color: paletteTheme.text,
    },
    current_icon: {
      fontSize: 50
    },
    current_temp: {
      fontSize: 48,
      color: paletteTheme.text,
    },
    current_weather_desc: {
      fontSize: 18,
      color: paletteTheme.text,
    },
    secondary_text: {
      flex: 1,
      color: paletteTheme.text,
    },
    errorContainer: {
      padding: 16,
    },
    errorText: {
      marginBottom: 8,
      color: paletteTheme.text,
    },
    loading_container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    list_container: {
      flexDirection: "row",
      justifyContent: "center",
    },
    list: {
      flexGrow: 0,
    },
    actions_container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 16,
    },
    action_button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      ...cardShadow
    },
    action_button_icon: {
      fontSize: 28,
      color: paletteTheme.higlighted,
    },
    days_hours_container: {
      width: "100%",
      marginBottom: 16,
      paddingVertical: 16,
      paddingHorizontal: CONTAINER_H_PADDING,
      ...cardShadow
    },
    hours_title: {
      fontSize: 18,
      fontWeight: "600",
      color: paletteTheme.text,
    },
    hour_column: {
      width: ITEM_WIDTH,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: ELEMENTS_H_PADDING,
      borderRadius: 12,
    },
    hour_time: {
      fontWeight: "500",
      fontSize: 14,
      color: paletteTheme.text,
    },
    hour_weather_icon: {
      fontSize: 24,
      color: paletteTheme.text,
    },
    hour_temp: {
      fontSize: 16,
      color: paletteTheme.text,
      textAlign: "center",
    },
    day_column: {
      width: ITEM_WIDTH,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: ELEMENTS_H_PADDING,
      borderRadius: 12,
    },
    day_time: {
      fontSize: 14,
      color: paletteTheme.text,
      fontWeight: "500",
    },
    day_weather_icon: {
      fontSize: 32
    },
    day_max_temp: {
      color: paletteTheme.tempMax,
      fontSize: 16,
      textAlign: "center",
    },
    day_min_temp: {
      color: paletteTheme.tempMin,
      fontSize: 16,
      textAlign: "center",
    },
  });
};