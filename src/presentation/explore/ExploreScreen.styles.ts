import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
  },
  submitButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a7",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  errorText: {
    color: "#c00",
    fontSize: 14,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    gap: 10,
  },
  suggestionCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
    fontSize: 14,
  },
  loadingIndicator: {
    marginTop: 16,
  },
});

export default styles;
