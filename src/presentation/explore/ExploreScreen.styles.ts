import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  header_desc: {
    fontSize: 14,
    color: "#555",
  },
  finder_contaner: {
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
  findButton: {
    flex: 0.25,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1273de",
    borderWidth: 2,
    borderColor: "#1273de",
    borderRadius: 8
  },
  findButtonText: {
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
