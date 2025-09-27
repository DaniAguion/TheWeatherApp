import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
  },
  header_container: {
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 16,
  },
  header_title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  header_desc: {
    fontSize: 14,
    color: "#555",
  },
  search_contaner: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  search_button: {
    flex: 0.4,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1273de",
    borderWidth: 2,
    borderColor: "#1273de",
    borderRadius: 8
  },
  search_button_text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  error_text: {
    color: "#c00",
    fontSize: 14,
  },
  results_container: {
    flex: 1,
  },
  results_title: {
    fontSize: 16,
    fontWeight: "600",
    paddingBottom: 12,
  },
  results_list: {
    gap: 8,
  },
  location_card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
  },
  location_title: {
    fontSize: 14,
    fontWeight: "600",
  },
  location_country: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  no_result_text: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
    fontSize: 14,
  },
  loading_indication: {
    marginTop: 16,
  },
});

