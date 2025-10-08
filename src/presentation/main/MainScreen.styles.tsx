import { StyleSheet, ColorSchemeName } from "react-native";
import { palette } from "../Themes";

export const makeMainStyles = (scheme: ColorSchemeName) => {
    const mode = scheme === "dark" ? "dark" : "light";
    const paletteTheme = palette[mode];
    
    return StyleSheet.create({
        screen_container: {
            flex: 1,
            paddingTop: 16,
        },
        selector_container: {
            flexDirection: "row",
            marginBottom: 12,
            paddingHorizontal: 16,
        },
        selector_button: {
            flex: 1,
            flexDirection: "row",
            gap: 8,
            paddingVertical: 10,
            borderWidth: 2,
            borderColor: "#d0d0d0",
            alignItems: "center",
            justifyContent: "center",
        },
        selector_button_left: {
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            marginRight: 8,
            borderColor: paletteTheme.border,
        },
        selector_button_right: {
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            borderColor: paletteTheme.border,
        },
        selector_button_active: {
            backgroundColor: paletteTheme.higlighted,
            borderColor: paletteTheme.higlighted,
        },
        selector_button_text: {
            fontSize: 14,
            fontWeight: "600",
            color: paletteTheme.higlighted,
        },
        selector_button_text_active: {
            color: paletteTheme.inverted_text,
        },
        content_container: {
            flex: 1,
            alignSelf: "stretch",
        },
        state_container: {
            flex: 1,
            alignSelf: "stretch",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 40,
            gap: 8,
        },
        error_text: {
            fontSize: 16,
            color: paletteTheme.text,
            fontWeight: "500",
            textAlign: "center",
            marginTop: 16,
            marginBottom: 32,
        },
        retry_button: {
            backgroundColor: paletteTheme.higlighted,
            paddingVertical: 10,
            paddingHorizontal: 22,
            borderRadius: 24,
            alignSelf: "center",
            borderWidth: 1,
            borderColor: paletteTheme.border,
            elevation: 3,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
        },
        retry_button_text: {
            fontSize: 16,
            color: paletteTheme.inverted_text,
            fontWeight: "600",
        },
    });
};
