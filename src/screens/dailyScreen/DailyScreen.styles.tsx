import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 12,
  },
  daily_title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  daily_column: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff"
  },
  daily_time: {
    fontSize: 14,
  },
  daily_icon: {
    fontSize: 24,
    textAlign: "center",
  },
    daily_max_temp: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
  },
  daily_min_temp: {
    color: "#0000ff",
    fontSize: 16,
    textAlign: "center",
  },
});