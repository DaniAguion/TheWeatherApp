import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen_container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
  },
  header_container: {
    marginBottom: 16,
  },
  header_title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  header_desc: {
    fontSize: 14,
    color: "#555555",
  },
  loading_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list_content: {
    paddingBottom: 24,
    gap: 12,
  },
  location_card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
  },
  location_title: {
    fontSize: 16,
    fontWeight: "600",
  },
  location_meta: {
    marginTop: 4,
    fontSize: 13,
    color: "#666666",
  },
  location_coords: {
    marginTop: 4,
    fontSize: 12,
    color: "#7a7a7a",
  },
  empty_state_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  empty_state_text: {
    textAlign: "center",
    fontSize: 14,
    color: "#555555",
  },
  empty_state_subtext: {
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
