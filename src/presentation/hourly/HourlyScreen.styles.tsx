import { StyleSheet, ColorSchemeName } from "react-native";
import { palette } from "../Themes";

export const makeHourlyStyles = (scheme: ColorSchemeName) => {
  const mode = scheme === "dark" ? "dark" : "light";
  const paletteTheme = palette[mode];

  return StyleSheet.create({
    view_container: {
      flex: 1
    },
    hour_row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderColor: paletteTheme.border,
    },
    first_subgroup: {
      flexDirection: "row",
      justifyContent: "center",
      flexShrink: 1,
      flexWrap: "wrap",
      alignContent: "flex-start", 
      alignItems: "center",
      gap: 4
    },
    hour_desc: {
      fontSize: 12,
      color: paletteTheme.text,
      fontWeight: "500",
    },
    medium_icon: {
      fontSize: 32,
      color: paletteTheme.text,
      textAlign: "center",
      marginHorizontal: 4
    },
    temp: {
      fontSize: 16,
      color: paletteTheme.text,
      fontWeight: "600",
      textAlign: "center",
    },
    subgroup: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 8,
    },
    icon_column: {
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
    },
    small_icon: {
      fontSize: 32,
      marginRight: 4,
    },
    info_column: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      marginLeft: 4
    },
    info_title: {
      fontSize: 10,
      color: paletteTheme.text,
    },
    info_data: {
      fontSize: 10,
      color: paletteTheme.text,
      fontWeight: "600",
    },
    spacer: { 
      height: 8 
    },
  });
};