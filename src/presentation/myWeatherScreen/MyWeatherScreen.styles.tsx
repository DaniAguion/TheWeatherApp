import { StyleSheet } from "react-native";

export default StyleSheet.create({
    screen_container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    selector_container: {
        flexDirection: "row",
        marginBottom: 12,
    },
    selector_button: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: "#d0d0d0",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    selector_button_left: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        marginRight: 8,
    },
    selector_button_right: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    selector_button_active: {
        backgroundColor: "#1273de",
        borderColor: "#1273de",
    },
    selector_button_text: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1273de",
    },
    selector_button_text_active: {
        color: "#fff",
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
        color: "red",
        fontSize: 14,
        fontWeight: "400",
        textAlign: "center"
    }
});
