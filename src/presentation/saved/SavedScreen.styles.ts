import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    fontWeight: "600",
    marginBottom: 4,
  },
  header_desc: {
    fontSize: 16,
    color: "#555",
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
