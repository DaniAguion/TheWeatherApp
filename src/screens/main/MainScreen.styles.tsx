import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  icon: {
    fontSize: 40,
    marginRight: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  temp: {
    fontSize: 48,
    marginVertical: 4,
  },
  desc: {
    marginBottom: 12,
  },
  wind: {
    marginBottom: 12,
  },
  errorContainer: {
    padding: 16,
  },
  errorText: {
    marginBottom: 8,
  },
  loading: {
    marginTop: 40,
  },
  spacer: {
    height: 12,
  },
});